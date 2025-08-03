# シーン一括更新機能の実装（フロントエンド楽観的更新）

## プロジェクト概要
- 機能の目的: シーン操作時のAPI呼び出し回数削減・UX改善
- 実装する機能の範囲: フロントエンド楽観的更新 + シーン一括更新API
- GitHub Issue: #106
- データ保存先: Neo4j GraphDB（既存と同じ）

## 現在の課題分析
### 問題の特定
- **無駄なAPI呼び出し**: シーン追加・削除・編集の度に個別APIコール
- **UX問題**: 操作の度にローディング・ネットワーク待機
- **データ整合性リスク**: 複数の個別更新で中間状態が発生

### 具体的な改善ターゲット
```typescript
// 現在の問題のあるフロー
// シーン1作成 → PUT /api/graph-scenes/{id1} (API呼び出し1)
// シーン2作成 → PUT /api/graph-scenes/{id2} (API呼び出し2)  
// シーン1削除 → DELETE /api/graph-scenes/{id1} (API呼び出し3)
// = 3回のAPI呼び出し + 3回のローディング

// 改善後の理想的なフロー
// シーン1作成 → フロントエンド状態更新のみ（即座に反映）
// シーン2作成 → フロントエンド状態更新のみ（即座に反映）
// シーン1削除 → フロントエンド状態更新のみ（即座に反映）
// 「変更を保存」ボタン → PUT /api/graph-scenes/scenario/{scenarioId}/batch (API呼び出し1回)
```

## アーキテクチャ分析
### 現在のシステム構成
- 関連する既存コンポーネント: SceneManagement.tsx, useGraphSceneMutation, useGraphSceneDeleteMutation
- 技術スタック: React + TypeScript (Frontend), Hono.js + Cloudflare Workers (Backend)
- 既存のAPIパターン: 個別CRUD操作（PUT, DELETE）
- データベース: Neo4j GraphDB

### 既存実装の詳細調査
**調査完了項目**:

#### 1. 現在のシーン状態管理（SceneManagement.tsx）
**現在の実装方式**:
- **状態管理**: 基本的なReact useState（フォーム状態のみ）
- **データソース**: propsとして受け取るscenes配列（親コンポーネントから取得）
- **個別操作**: 作成・更新・削除すべて即座にAPI呼び出し実行
- **更新通知**: `onSceneUpdated?.()`で親に再フェッチ依頼

**問題点**:
```typescript
// 現在の問題フロー
handleCreateSubmit -> createMutation.trigger() -> API呼び出し -> onSceneUpdated() -> 親で再フェッチ
handleUpdateSubmit -> updateMutation.trigger() -> API呼び出し -> onSceneUpdated() -> 親で再フェッチ  
handleDeleteScene -> apiClient.$delete() -> API呼び出し -> onSceneUpdated() -> 親で再フェッチ
```

#### 2. 既存API構造（graphScene.ts）
**バックエンドルート設計**:
- `GET /api/graph-scenes/scenario/{scenarioId}`: シーン一覧取得
- `PUT /api/graph-scenes/{id}`: シーン作成・更新（MERGE使用）
- `DELETE /api/graph-scenes/{id}`: シーン削除

**Neo4jクエリパターン**:
```cypher
-- 個別作成・更新（既存）
MERGE (scene:Scene {id: $id})
SET scene.title = $title, scene.overview = $overview, scene.scenarioId = $scenarioId, scene.order = $order
WITH scene
MATCH (scenario:Scenario {id: $scenarioId})
MERGE (scenario)-[:HAS_SCENE]->(scene)

-- 個別削除（既存）
MATCH (scene:Scene {id: $id})
OPTIONAL MATCH (scene)-[r]-()
DELETE r, scene
```

#### 3. SWR使用状況
**データフェッチ戦略**:
- `useGraphScenesQuery`: データ取得（SWR）
  - キー: `api/graph-scenes/scenario/${scenarioId}`
  - 設定: `revalidateOnFocus: false, revalidateOnReconnect: true`
- `useGraphSceneMutation`: 作成・更新（SWRMutation）
  - 各操作後に親コンポーネントでSWRキャッシュの再フェッチが必要

**キャッシュ更新の課題**:
```typescript
// 現在：操作後に毎回サーバーから全データ再取得
onSceneUpdated?.() -> useGraphScenesQuery再実行 -> 全シーン再フェッチ
```

#### 4. バリデーション・スキーマ定義
**既存スキーマ（schema.ts）**:
```typescript
export const graphSceneRequestSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  overview: v.pipe(v.string(), v.minLength(1), v.maxLength(1000)),
  scenarioId: v.pipe(v.string(), v.uuid()),
  order: v.pipe(v.number(), v.minValue(0), v.integer()),
});
```

**エラーハンドリング**:
- 400: バリデーションエラー
- 404: シーン未発見（削除時）
- 500: データベースエラー

#### 5. UIコンポーネント構造
**コンポーネント分離**:
- `SceneManagement.tsx`: 状態管理・API呼び出し（Container）
- `SceneGraphList.tsx`: 表示・基本イベント（Presentational）
- `SceneForm.tsx`: フォーム入力（Presentational）

**現在の課題**:
- **即座の操作感なし**: 各操作でローディング状態発生
- **ネットワーク依存**: オフライン時の操作不可
- **無駄なAPI呼び出し**: 連続操作時の個別API実行

## データモデル設計

### 一括更新API設計
#### エンドポイント仕様
- **エンドポイント**: PUT `/api/graph-scenes/scenario/{scenarioId}/batch`
- **認証**: Firebase Authentication必須（bearerAuth）
- **戦略**: 既存シーン全削除 → 新規シーン配列で一括再構築

#### リクエスト・レスポンス設計
```typescript
// 一括更新リクエスト（簡略化戦略）
interface BatchUpdateRequest {
  scenes: Array<{
    id?: string;           // 一時IDまたは既存ID（サーバーで新IDに置換）
    title: string;
    overview: string;
    order: number;
    // operationフィールドは不要（全て再構築のため）
  }>;
}

// レスポンス設計
interface BatchUpdateResponse {
  scenes: Array<{
    id: string;            // サーバーで生成された正式ID
    title: string;
    overview: string;
    order: number;
    scenarioId: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  summary: {
    totalScenes: number;   // 保存されたシーン数
    message: string;       // 操作結果メッセージ
  };
}
```

#### 設計判断の理由
**簡略化戦略を採用**:
- **全削除→再構築**: 差分計算ではなく、全削除後に新規作成で一括処理
- **操作種別なし**: create/update/deleteの区別をしない（簡単な実装）
- **ID再生成**: 一時IDを含む全IDをサーバーで新規生成（UUID重複回避）

**メリット**:
- **実装の単純化**: 差分計算・MERGE文の複雑なロジック不要
- **データ整合性**: トランザクション内での全操作により状態の一貫性保証
- **ID重複回避**: サーバーで全ID再生成によりUUID衝突リスク排除

**デメリット**:
- **パフォーマンス**: 大量シーン時の全削除・再作成コスト
- **タイムスタンプ**: 既存シーンのcreatedAtが失われる
- **一時停止**: 全削除→再作成間の瞬間的データ不整合（トランザクションで解決）

### Neo4jクエリ戦略

#### 一括更新クエリ設計（トランザクション統合版）
```cypher
// 統合トランザクションクエリ（1回のセッション実行）
// 1. シナリオ存在確認
MATCH (scenario:Scenario {id: $scenarioId})

// 2. 既存シーン全削除
OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
DETACH DELETE scene

// 3. 新しいシーン一括作成（UUIDサーバー生成）
WITH scenario
UNWIND $scenes as sceneData
CREATE (newScene:Scene {
  id: randomUUID(),
  title: sceneData.title,
  overview: sceneData.overview,
  order: sceneData.order,
  scenarioId: $scenarioId,
  createdAt: datetime(),
  updatedAt: datetime()
})
CREATE (scenario)-[:HAS_SCENE]->(newScene)

// 4. 作成されたシーンを順序で返却
WITH scenario
MATCH (scenario)-[:HAS_SCENE]->(resultScene:Scene)
RETURN resultScene.id as id,
       resultScene.title as title,
       resultScene.overview as overview,
       resultScene.order as order,
       resultScene.scenarioId as scenarioId,
       resultScene.createdAt as createdAt,
       resultScene.updatedAt as updatedAt
ORDER BY resultScene.order ASC
```

#### クエリ設計の技術的考慮事項

**トランザクション処理**:
- **原子性保証**: 全操作が1つのNeo4jセッション内で実行
- **シナリオ存在確認**: MATCH文で存在しない場合は自動的に失敗
- **全削除→再作成**: OPTIONAL MATCHで既存シーンがない場合も正常処理

**ID生成戦略**:
- **randomUUID()使用**: Neo4j組み込み関数でサーバー側UUID生成
- **一時ID無視**: フロントエンドの一時IDは使用せず、全て新規生成
- **重複回避**: サーバー生成UUIDで確実な一意性保証

**パフォーマンス考慮**:
- **UNWIND使用**: 配列を効率的に展開して一括処理
- **WITH句活用**: 中間結果を適切に受け渡し
- **ORDER BY**: 結果を順序で並び替えてフロントエンド表示順を保証

#### エラーケース対応
```cypher
// シナリオ不存在時の動作確認クエリ
OPTIONAL MATCH (scenario:Scenario {id: $scenarioId})
WITH scenario
WHERE scenario IS NOT NULL
// 上記でscenario=NULLの場合、後続処理は実行されずクエリ終了
```

## フロントエンド楽観的更新設計

### 状態管理アーキテクチャ設計
```typescript
// 楽観的更新の状態設計
interface OptimisticSceneState {
  // データ状態
  original: Scene[];              // サーバーから取得した元データ（変更なし）
  current: Scene[];               // 現在の表示データ（楽観的更新後）
  
  // 状態フラグ
  hasUnsavedChanges: boolean;     // 未保存変更の有無
  isLoadingBatch: boolean;        // 一括更新実行中フラグ
  
  // 操作履歴（デバッグ・巻き戻し用）
  pendingOperations: Array<{
    id: string;                   // 操作ID（UUID）
    type: 'create' | 'update' | 'delete';
    sceneId: string;
    previousData?: Scene;         // 巻き戻し用の元データ
    newData?: Partial<Scene>;     // 更新データ
    timestamp: number;            // 操作時刻
  }>;
}

// 楽観的更新Hook設計
interface UseOptimisticScenesResult {
  // データ
  scenes: Scene[];              // 表示用シーン配列
  hasUnsavedChanges: boolean;   // 未保存変更フラグ
  isLoadingBatch: boolean;      // 一括保存中フラグ
  
  // 操作メソッド
  optimisticCreate: (scene: Omit<Scene, 'id'>) => void;
  optimisticUpdate: (id: string, updates: Partial<Scene>) => void;
  optimisticDelete: (id: string) => void;
  
  // 保存・破棄
  saveAllChanges: () => Promise<void>;
  discardAllChanges: () => void;
  
  // 状態リセット
  refreshFromServer: () => Promise<void>;
}
```

### 楽観的更新フロー設計
```typescript
// 理想的な操作フロー
// 1. ユーザーがシーン作成
optimisticCreate({ title: '新シーン', overview: '概要', scenarioId, order: 1 })
  → current配列に即座に追加（UI即座反映）
  → hasUnsavedChanges = true

// 2. ユーザーがシーン編集  
optimisticUpdate(sceneId, { title: '更新タイトル' })
  → current配列の該当要素更新（UI即座反映）
  → hasUnsavedChanges = true

// 3. ユーザーがシーン削除
optimisticDelete(sceneId)
  → current配列から即座に除去（UI即座反映）
  → hasUnsavedChanges = true

// 4. ユーザーが「変更を保存」ボタンクリック
saveAllChanges()
  → isLoadingBatch = true
  → API呼び出し: PUT /api/graph-scenes/scenario/{scenarioId}/batch
  → 成功時: original = current, hasUnsavedChanges = false
  → 失敗時: current = original（巻き戻し）
```

### 一括更新API統合戦略
```typescript
// 一括更新実行時の処理
const saveAllChanges = async () => {
  try {
    setIsLoadingBatch(true);
    
    // 現在のシーン配列を一括更新APIに送信
    const response = await apiClient.api['graph-scenes'].scenario[':scenarioId'].batch.$put({
      param: { scenarioId },
      json: { scenes: current }
    });
    
    if (response.ok) {
      const updatedScenes = await response.json();
      // 成功：サーバーデータで状態を更新
      setOriginal(updatedScenes.scenes);
      setCurrent(updatedScenes.scenes);
      setHasUnsavedChanges(false);
      clearPendingOperations();
      
      // SWRキャッシュも更新
      mutate(`api/graph-scenes/scenario/${scenarioId}`, updatedScenes.scenes);
    }
  } catch (error) {
    // エラー時：楽観的更新を巻き戻し
    setCurrent([...original]);
    setHasUnsavedChanges(false);
    alert('保存に失敗しました。変更を元に戻します。');
  } finally {
    setIsLoadingBatch(false);
  }
};
```

### 楽観的更新のメリット・デメリット
**メリット**:
- **即座のUI反映**: ネットワーク待機なしの快適なUX
- **API呼び出し削減**: 複数操作を1回のバッチ更新に集約  
- **オフライン対応**: ネットワークなしでも一時的な操作可能
- **データ整合性向上**: トランザクション的な一括更新

**デメリット・リスク**:
- **複雑な状態管理**: original/current/pending状態の適切な管理が必要
- **サーバーエラー時の巻き戻し**: 楽観的更新の取り消し処理実装が必要
- **ID生成戦略**: 楽観的作成時の一意ID生成（サーバーで再生成される可能性）
- **競合状態**: 他ユーザーとの同時編集時の課題（今回は対象外）

### Hook実装における技術的考慮事項
#### ID生成戦略
```typescript
// 楽観的作成時のID戦略
const optimisticCreate = (sceneData: Omit<Scene, 'id'>) => {
  const tempId = `temp_${generateUuid()}`; // 一時ID（temp_プレフィックス）
  const newScene: Scene = {
    ...sceneData,
    id: tempId,
  };
  
  // 一括保存時にサーバーで正式IDに置換される
  setCurrent(prev => [...prev, newScene]);
  setHasUnsavedChanges(true);
};
```

#### エラー回復戦略
```typescript
// サーバーエラー時の巻き戻し
const rollbackChanges = () => {
  setCurrent([...original]);
  setPendingOperations([]);
  setHasUnsavedChanges(false);
};
```

## 実装計画
### TODO LIST
- [ ] 既存シーン管理機能の詳細調査・分析
- [ ] フロントエンド楽観的更新の状態管理設計
- [ ] 一括更新API設計・OpenAPI仕様書作成
- [ ] Neo4jバッチ更新クエリ設計・検証
- [ ] バックエンドAPI実装（PUT /api/graph-scenes/scenario/{scenarioId}/batch）
- [ ] フロントエンド楽観的更新実装
  - [ ] 状態管理Hook（useOptimisticScenes）作成
  - [ ] SceneManagement.tsxリファクタリング
  - [ ] 「変更を保存」「変更を破棄」ボタン実装
- [ ] エラーハンドリング強化
  - [ ] サーバーエラー時の楽観的更新巻き戻し
  - [ ] ネットワークエラー対応
- [ ] 統合テスト実行
- [ ] E2Eテスト（BDD）

### 段階的実装戦略
**Phase 1: 調査・設計段階**
1. 既存コード詳細分析（SceneManagement.tsx, API層）
2. 楽観的更新アーキテクチャ設計
3. 一括更新API仕様策定・OpenAPI作成

**Phase 2: バックエンド実装**
1. Neo4jバッチ更新クエリ実装・テスト
2. 一括更新APIエンドポイント実装
3. バリデーション・エラーハンドリング

**Phase 3: フロントエンド実装**  
1. 楽観的更新Hook実装
2. SceneManagement.tsxリファクタリング
3. 保存・破棄ボタン・状態表示UI

**Phase 4: 統合・品質保証**
1. 統合テスト・E2Eテスト
2. パフォーマンス検証
3. エラーケース動作確認

## 実装ガイドライン
### 設計原則
- **後方互換性維持**: 既存の個別API（PUT, DELETE）も並行維持
- **段階的移行**: SceneManagement.tsxのみを楽観的更新に変更、他への影響最小化
- **エラー回復性**: サーバーエラー時の適切な状態巻き戻し機能
- **テスト重視**: 楽観的更新の複雑な状態遷移をカバーする包括的テスト

### 技術的制約・考慮事項
- **トランザクション**: Neo4jで一括更新の原子性確保
- **ID生成**: 楽観的更新時の一意ID生成戦略（UUID）
- **競合回避**: 同一シナリオの同時編集は今回対応外（将来課題）
- **パフォーマンス**: 大量シーン（100+）での処理性能

## 進捗記録
### 2025-08-03
- [x] 証跡ファイル作成・実装計画策定
- [x] 既存システム詳細調査完了
- [x] フロントエンド楽観的更新アーキテクチャ設計完了
- [x] 一括更新API設計・OpenAPI仕様書作成完了
- [x] Valibotスキーマ定義追加完了
- [x] バックエンドAPI実装完了（一括更新）
- [x] 統合テスト作成・実行完了（7テスト全通過）
- [x] フロントエンド楽観的更新実装完了
- [x] 楽観的更新Hook作成・テスト完了（7テスト全通過）
- [x] UIコンポーネント実装完了（一時ID表示対応）
- [x] ESLint・TypeScript・ビルド全通過

### 完了した設計成果物
#### 1. OpenAPI仕様書（graphScenesBatch.yaml）
- **エンドポイント**: PUT `/api/graph-scenes/scenario/{scenarioId}/batch`
- **リクエスト**: シーン配列（id optional、title/overview/order required）
- **レスポンス**: 更新されたシーン配列 + 操作サマリー
- **エラーハンドリング**: 400/401/404/500の適切なレスポンス

#### 2. Valibotスキーマ定義（schema.ts）
```typescript
// 追加されたスキーマ
- graphSceneBatchItemSchema: 個別シーンバリデーション
- graphSceneBatchRequestSchema: 一括更新リクエスト
- graphSceneBatchResponseSchema: 一括更新レスポンス  
- 対応する型定義: GraphSceneBatchItem, GraphSceneBatchRequest, GraphSceneBatchResponse
```

#### 3. API統合
- **api.yaml**: 新エンドポイント追加（/api/graph-scenes/scenario/{scenarioId}/batch）
- **既存APIとの並行運用**: 既存の個別操作API（PUT, DELETE）も維持

#### 4. バックエンドAPI実装（graphScene.ts）
- **エンドポイント**: PUT `/api/graph-scenes/scenario/{scenarioId}/batch`
- **Neo4jクエリ**: 2段階実行（存在確認→削除→作成）
- **エラーハンドリング**: 404 Scenario not found, 400 Validation error, 500 Database error
- **レスポンス**: 更新されたシーン配列 + 操作サマリー

#### 5. 統合テスト（graph-scene-batch.spec.ts）
**テストカバレッジ**:
- ✅ 正常な一括更新（3シーン作成）
- ✅ 空配列による全削除
- ✅ バリデーションエラー処理（必須フィールド不足、不正UUID）
- ✅ 存在しないシナリオでの404エラー
- ✅ 一括更新後の個別取得との整合性確認
- ✅ 大量データ（50シーン）でのパフォーマンステスト

**テスト結果**: 7テスト全通過 ✅

#### 6. フロントエンド楽観的更新実装
**Hook実装（useOptimisticScenes.ts）**:
- **状態管理**: original/current二重状態による楽観的更新
- **操作メソッド**: optimisticCreate/Update/Delete即座実行
- **一括保存**: saveAllChanges によるバッチAPI統合
- **エラー回復**: サーバーエラー時の自動巻き戻し機能

**コンポーネント実装（SceneManagementOptimistic.tsx）**:
- **未保存変更警告**: 黄色のバナーで視覚的に通知
- **保存・破棄ボタン**: 一括操作の明確なUX
- **一時ID表示**: 新規シーンに「新規」バッジ表示
- **即座のUI反映**: ネットワークなしでも快適な操作感

**UIコンポーネント拡張（SceneGraphList.tsx）**:
- **一時ID検出**: `temp_`プレフィックスで新規シーン識別
- **視覚的表示**: 新規シーンに amber色のバッジ表示

**単体テスト（useOptimisticScenes.test.ts）**:
- ✅ 楽観的CRUD操作の正常動作
- ✅ 変更破棄機能の動作確認
- ✅ サーバーデータリフレッシュ機能
- ✅ 順序ソート機能

**テスト結果**: 7テスト全通過 ✅

### 設計の技術的特徴
- **簡略化戦略採用**: 差分計算ではなく全削除→再構築で実装の単純化
- **ID再生成**: サーバー側で全IDを新規生成してUUID重複を回避
- **OpenAPI First**: 実装前に詳細な仕様策定・Valibotスキーマ統合
- **トランザクション保証**: Neo4jセッション内での原子性確保
- **包括的テスト**: 正常系・異常系・境界値・パフォーマンスの全カバー

### バックエンド実装の技術的ハイライト
#### Neo4jクエリ戦略
```cypher
-- 1. シナリオ存在確認（事前チェック）
MATCH (scenario:Scenario {id: $scenarioId}) RETURN scenario

-- 2. 既存シーン全削除
MATCH (scenario:Scenario {id: $scenarioId})
OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
DETACH DELETE scene

-- 3. 新シーン一括作成（空配列対応）
MATCH (scenario:Scenario {id: $scenarioId})
UNWIND $scenes as sceneData
CREATE (newScene:Scene {
  id: randomUUID(),
  title: sceneData.title,
  overview: sceneData.overview,
  order: sceneData.order,
  scenarioId: $scenarioId,
  createdAt: datetime(),
  updatedAt: datetime()
})
CREATE (scenario)-[:HAS_SCENE]->(newScene)
RETURN newScene.* ORDER BY newScene.order ASC
```

#### 実装上の技術判断
- **事前存在確認**: シナリオ不存在時の早期404返却
- **2段階実行**: 削除と作成を分離して空配列ケースに対応
- **randomUUID()**: Neo4j組み込み関数による確実なID生成
- **エラー分岐**: Neo4jエラーコードによる適切なHTTPステータス返却

## 参考情報
- 関連ファイル:
  - 現在のシーン管理: `apps/frontend/src/entities/scenario/components/SceneManagement.tsx`
  - シーンAPI: `apps/backend/src/route/graphScene.ts`
  - OpenAPI: `docs/redocly/openapi/paths/graphScenes.yaml`
- 技術参考:
  - 楽観的更新パターン: SWRのmutate API
  - 一括更新実装: Neo4j UNWIND句、トランザクション