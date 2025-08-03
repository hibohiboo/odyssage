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
- エンドポイント: PUT `/api/graph-scenes/scenario/{scenarioId}/batch`
- 認証: Firebase Authentication必須（bearerAuth）
- リクエストボディ: シーン配列全体（作成・更新・削除を統合）

```typescript
// 一括更新リクエストの設計案
interface BatchUpdateRequest {
  scenes: Array<{
    id?: string;           // 新規作成時はundefined、既存更新時は既存ID
    title: string;
    overview: string;
    order: number;
    operation?: 'create' | 'update' | 'delete'; // 明示的な操作種別
  }>;
}

// レスポンス設計案  
interface BatchUpdateResponse {
  updatedScenes: Array<{
    id: string;
    title: string;
    overview: string;
    order: number;
    scenarioId: string;
  }>;
  summary: {
    created: number;
    updated: number;
    deleted: number;
  };
}
```

### Neo4jクエリ戦略
```cypher
// 一括更新のクエリ設計案
// 1. 既存シーン全削除
MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)
DETACH DELETE scene

// 2. 新しいシーン一括作成
UNWIND $scenes as sceneData
MATCH (scenario:Scenario {id: $scenarioId})
CREATE (scene:Scene {
  id: sceneData.id,
  title: sceneData.title,
  overview: sceneData.overview,
  order: sceneData.order
})
CREATE (scenario)-[:HAS_SCENE]->(scene)
RETURN scene
```

## フロントエンド楽観的更新設計
### 状態管理アーキテクチャ
```typescript
// 楽観的更新の状態設計
interface SceneState {
  original: Scene[];        // サーバーから取得した元データ
  current: Scene[];         // 現在の表示データ（楽観的更新後）
  hasUnsavedChanges: boolean; // 未保存変更の有無
  pendingOperations: Array<{ // 保留中の操作ログ
    type: 'create' | 'update' | 'delete';
    sceneId: string;
    data?: Partial<Scene>;
  }>;
}
```

### 楽観的更新のメリット・デメリット
**メリット**:
- **即座のUI反映**: ネットワーク待機なしの快適なUX
- **API呼び出し削減**: 複数操作を1回のバッチ更新に集約
- **データ整合性向上**: トランザクション的な一括更新

**デメリット・リスク**:
- **サーバーエラー時の巻き戻し**: 楽観的更新の取り消し処理が必要
- **複雑な状態管理**: original/current状態の適切な管理
- **競合状態**: 他ユーザーとの同時編集時の課題（今回は対象外）

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
- [ ] 既存システム詳細調査開始

## 参考情報
- 関連ファイル:
  - 現在のシーン管理: `apps/frontend/src/entities/scenario/components/SceneManagement.tsx`
  - シーンAPI: `apps/backend/src/route/graphScene.ts`
  - OpenAPI: `docs/redocly/openapi/paths/graphScenes.yaml`
- 技術参考:
  - 楽観的更新パターン: SWRのmutate API
  - 一括更新実装: Neo4j UNWIND句、トランザクション