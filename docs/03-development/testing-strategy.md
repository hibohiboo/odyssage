# Odyssage プロジェクト テスト戦略

## 概要

本ドキュメントでは、Odyssageプロジェクトにおけるテスト戦略を定義します。
**フルスタックアーキテクチャでの責務分担**に基づく適切なテストアプローチを確立し、品質保証の指針とします。

## 🔄 設計判断の重要な更新（2025-08-11）

### DDDアーキテクチャ議論からの学習
Sprint 003のバックエンドリアーキテクティング検討において、重要な設計判断の見直しを実施：

#### **従来の誤認識**
- バックエンドを独立したDDDシステムとして評価
- 複雑なドメインロジックがバックエンドに存在すると仮定
- Edge Computing環境を「制約」として認識

#### **正しい理解への転換**
- **フルスタック責務分担**: 複雑ビジネスロジックはフロントエンド、バックエンドはデータ永続化
- **補完的業務の適切評価**: バックエンドは「データ更新の補完業務」として軽量・効率的設計
- **技術選択の最適化**: Cloudflare Workers は制約ではなく最適化された選択

#### **テスト戦略への影響**
- **逆ピラミッド型テスト採用**: 統合テスト・E2Eテスト重視
- **フロントエンド複雑性重視**: 楽観的更新・状態管理の品質保証
- **バックエンド最小限テスト**: 境界値・エラー処理に絞った効率的テスト

## テスト戦略の決定フロー

### 1. 業務領域のカテゴリ判定

#### 中核の業務領域
- **TRPGセッション管理**: シナリオ、シーン、プレイヤー管理
- **ゲームマスター支援**: セッション進行、状況管理
- **データ関係性管理**: GraphDBによる複雑な関係性

#### 補完・一般の連携
- **ユーザー認証**: Firebase Authentication連携
- **ファイル管理**: 画像・ドキュメントアップロード
- **通知機能**: メール・プッシュ通知

### 2. 業務ロジック実装方法の決定

#### トランザクションスクリプト
- **適用**: 補完・一般連携でデータ構造が単純
- **例**: ユーザー認証、単純なCRUD操作
- **特徴**: 手続き型処理、シンプルなデータフロー

#### アクティブレコード  
- **適用**: 補完・一般連携でデータ構造が複雑
- **例**: ファイル管理、設定管理
- **特徴**: データとロジックの結合、ORMパターン

#### ドメインモデル
- **適用**: 中核業務領域（分析・監査記録以外）
- **例**: シナリオ・シーン管理、セッション進行
- **特徴**: 豊富なドメインオブジェクト、複雑なビジネスルール

#### イベント履歴式ドメインモデル
- **適用**: 中核業務領域の分析・監査記録
- **例**: セッション履歴、プレイヤー行動ログ
- **特徴**: イベントソーシング、監査証跡

### 3. テスト方針の選択

#### 逆ピラミッド型テスト（トランザクションスクリプト）
```
Unit Tests
△ 最小限・境界値のみ
 \
  \
   Integration Tests  
  △ 主要テスト・API動作確認
 / \
/   \
E2E Tests
△ ユーザーシナリオ・受け入れテスト
```

#### ダイヤモンド型テスト（アクティブレコード）
```
    E2E Tests
   △ 重要シナリオ
  / \
 /   \
Integration Tests
△ データ操作・API連携
 \   /
  \ /
Unit Tests
△ データ検証・境界値
```

#### ピラミッド型テスト（ドメインモデル）
```
    E2E Tests
   △ 最小限・重要シナリオ
  / \
 /   \
Integration Tests
△ ドメインサービス連携
 \   /
  \ /
   Unit Tests
△ ドメインロジック・豊富なテスト
```

## 機能別テスト方針

### GraphDBシーン機能（2025-08-11 設計判断更新）
- **業務領域**: 中核の業務領域
- **フルスタック責務分担**: 
  - **フロントエンド**: 複雑なビジネスロジック（楽観的更新、状態管理）
  - **バックエンド**: データ永続化（補完的業務）
- **実装方法**: トランザクションスクリプト（データ構造シンプル）
- **テスト方針**: 逆ピラミッド型テスト（統合テスト重視）

#### Phase 1: E2E Tests（重点実装）
```
ユーザーシナリオ（フロントエンド重視）:
- シーン作成・編集・削除の完全なフロー
- 楽観的更新の正常動作確認
- GraphDBとの連携動作
- エラー状態でのUX確認
```

#### Phase 2: Integration Tests（中程度）
```
API・データ永続化:
- GET /api/graph-scenes/scenario/{scenarioId}
- PUT /api/graph-scenes/{id}
- Neo4j・PostgreSQL統合
- データ整合性確認
```

#### Phase 3: Unit Tests（最小限）
```
バックエンド境界値・エラーケース:
- UUID形式検証
- データ変換処理
- Neo4j接続エラーハンドリング

フロントエンド重要ロジック:
- useOptimisticScenes の複雑な状態管理
- useGraphScenesQuery のキャッシュ戦略
- フォーム状態の楽観的更新
```

### ユーザー認証機能
- **業務領域**: 補完・一般の連携
- **実装方法**: トランザクションスクリプト（データ構造単純）
- **テスト方針**: 逆ピラミッド型テスト

#### Phase 1: E2E Tests（重点実装）
```
ユーザーシナリオ:
- ログイン・ログアウト
- パスワードリセット
- アカウント作成
```

#### Phase 2: Integration Tests（中程度）
```
API:
- Firebase Auth連携
- JWT検証
- セッション管理
```

#### Phase 3: Unit Tests（最小限）
```
境界値・エラーケース:
- トークン形式検証
- タイムアウト処理
```

### ファイル管理機能
- **業務領域**: 補完・一般の連携
- **実装方法**: アクティブレコード（データ構造複雑）
- **テスト方針**: ダイヤモンド型テスト

#### Phase 1: Integration Tests（重点実装）
```
API・データ操作:
- ファイルアップロード・ダウンロード
- メタデータ管理
- ストレージ連携
```

#### Phase 2: Unit Tests & E2E Tests（同程度）
```
Unit Tests:
- ファイル形式検証
- サイズ制限チェック

E2E Tests:
- ファイル管理ユーザーシナリオ
```

## テスト実装指針

### 1. 開発フローとテスト

#### ドメインモデル（ピラミッド型）
```
開発段階          | 実装するテスト
------------------|------------------
設計・仕様策定    | ドメインルール定義
実装開始          | Unit Test作成（TDD）
実装完了          | Unit Test完成・Integration Test作成
機能統合          | Integration Test実行
リリース準備      | E2E Test最小限実装
```

#### トランザクションスクリプト（逆ピラミッド型）
```
開発段階          | 実装するテスト
------------------|------------------
設計・仕様策定    | ユーザーシナリオ定義
実装開始          | E2E Test作成
実装完了          | Integration Test作成
機能統合          | Unit Test（境界値のみ）
リリース準備      | 全テスト実行
```

### 2. GraphDBシーン機能の推奨テスト計画（2025-08-11改訂）

#### E2E Tests（最重要・詳細実装）
```
ユーザー完全シナリオ:
- シーン作成→編集→削除の完全フロー
- 楽観的更新→サーバー同期の動作確認
- 複数シーン同時編集での整合性
- ネットワークエラー時の自動復旧UX
- GraphDB障害時のフォールバック動作

フロントエンド重要ロジック（E2Eレベルで検証）:
- useOptimisticScenes の状態管理
- SceneForm 楽観的更新体験
- エラー状態の適切な表示
```

#### Integration Tests（中程度実装）
```
API・データ永続化統合:
- GET /api/graph-scenes/scenario/{scenarioId}: データ取得確認
- PUT /api/graph-scenes/{id}: データ永続化確認
- Neo4j・PostgreSQL間のデータ整合性
- GraphDB関係性の正確性確認
```

#### Unit Tests（最小限実装）
```
バックエンド境界値処理:
- GraphSceneService: データ変換・永続化ロジック  
- Neo4jドライバー: 接続・クエリ実行エラー
- バリデーター: UUID・データ形式チェック

フロントエンド複雑ロジック単体:
- useOptimisticScenes: 状態更新ルール
- 楽観的更新: 競合状態の処理ロジック
```

## 完了基準

### フルスタック機能の完了判定（2025-08-11改訂）

#### 中核業務（GraphDBシーンなど）の完了基準
```
✅ E2E Tests: 全ユーザーシナリオが正常動作（最重要）
✅ Integration Tests: API・データ永続化連携確認
✅ Lint・型チェック: エラーゼロ
✅ 手動動作確認: 楽観的更新を含む完全フロー
⭕ Unit Tests: 境界値・複雑ロジック単体（最小限）
```

#### 補完・連携業務の完了判定
```
✅ E2E Tests: 全ユーザーシナリオが正常動作
✅ Integration Tests: API・外部サービス連携確認
✅ Lint・型チェック: エラーゼロ
⭕ Unit Tests: 境界値・エラーケースのみ（最小限）
```

**重要な変更点**: DDDドメインモデル前提を廃止、フルスタック責務分担に基づく戦略に統一

---

## 📚 APIテスト実装ベストプラクティス（2025-08-11追加）

### 実装完了から得た重要な教訓

#### **1. バリデーションテスト注意事項**
- **期待値の推測禁止**: スキーマ定義確認→実動作確認→テストケース作成
- **実例**: `userParamSchema = v.object({ uid: v.string() })`の場合、空文字で400エラーにならない
- **対策**: 事前にスキーマ内容とAPI実装両方を確認

#### **2. テスト冗長性の排除** 
- **同一データソース検証の回避**: beforeSetupデータと期待値の重複検証を防ぐ
- **実例**: 「API取得」テストと「API-DB一致」テストが同じデータで重複
- **対策**: テストケース追加前に既存テストとの重複チェック

#### **3. 可読性パターンの活用**
```typescript
// ✅ 推奨パターン（graph-scenario.spec.ts準拠）
describe('API名 統合テスト', () => {
  const { getApp, getEnv } = setupTestEnv({ beforeSetup: ... });
  let app: ReturnType<typeof getApp>;
  
  beforeEach(() => { app = getApp(); });
  
  /** 共通リクエスト関数 */
  const apiRequest = async (params) => app.request(...);
  
  it('簡潔なテスト名', async () => {
    const res = await apiRequest(data);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedData);
  });
});
```

#### **4. 環境考慮したテスト範囲**
- **パフォーマンステスト除外**: Testcontainersローカル環境では意味なし
- **機能テスト集中**: 正常系・異常系・エラーハンドリング・レスポンス形式
- **本番測定**: パフォーマンスはCloudflare Analytics等で実測

#### **5. 避けるべきアンチパターン**
- ❌ 冗長なデータ整合性テスト（同一データソースでの重複検証）
- ❌ ローカル環境でのパフォーマンステスト
- ❌ 詳細すぎるコメント・プロパティ単位の個別検証
- ❌ `[正常系]`等の冗長なテスト名プレフィックス
- ❌ **個別エンドポイントでの不要なヘッダーテスト**（特殊要件なしなら既存で十分）

#### **6. データ変更APIの重要パターン**
```typescript
// ✅ upsert動作の適切な検証
it('新規ユーザー登録', async () => {
  const res = await putUser(newUserId, userData);
  expect(res.status).toBe(204);
  
  // 重要: 操作後の状態確認
  const getRes = await getUser(newUserId);
  expect(getRes.status).toBe(200);
  expect(await getRes.json()).toEqual(expectedData);
});
```

#### **7. OpenAPI First 開発プロセス**
- **原則**: 実装変更前に必ずOpenAPI仕様を先に修正
- **対象**: パラメータ名・エラーケース・認証要件・レスポンススキーマ
- **効果**: 仕様と実装の一貫性保証・後戻り作業削減
- **フロー**: OpenAPI修正 → 実装修正 → テスト確認

#### **8. 実践的な注意事項**
- **テストコマンド**: `bun run test` が正しい（`bun test` は直接実行で環境変数等が不足）
- **エラーハンドリング**: 配列分割代入時の `undefined` チェック必須
- **バリデーション確認**: 期待値は推測せず実際動作で確認
- **Docker環境**: 統合テストはTestcontainers必須・環境問題の切り分け重要

#### **9. データベース制約とエラーハンドリング**
- **DB制約エラー**: 重複制約・外部キー制約違反は500エラーで適切に処理される
- **冪等性重要**: DELETE操作は存在しないリソースでも200成功が適切
- **テーブル名確認**: 実装前にDrizzle ORMスキーマ定義の正確な確認必須
- **制約期待値**: DB制約違反テストでは500エラーを期待値に設定

#### **10. 複合エンドポイントテスト戦略**
```typescript
// ✅ 関連する複数エンドポイントを1つのファイルで統合テスト
describe('User Stock API 統合テスト', () => {
  // GET/POST/DELETE を関係性を含めて包括的にテスト
  beforeEach(async () => {
    // クリーンアップ→テストデータ準備の効率化
    await execSql(conn, 'delete from scenario_stock'); 
    await execSql(conn, 'delete from scenarios');
    // テストシナリオ準備
  });
  
  it('操作後の状態確認', async () => {
    await addStock(userId, scenarioId); // POST操作
    
    const stocks = await getStocks(userId); // GET確認
    expect(stocks.length).toBe(1); // 関係性検証
  });
});
```

### 参考実装
- **単一リソース操作**: `apps/backend/test/integrations/user-management.spec.ts` (GET/PUT /api/users/{uid})
- **個別リソース取得**: `apps/backend/test/integrations/scenario-detail.spec.ts` (GET /api/scenario/{id})
- **リスト取得**: `apps/backend/test/integrations/scenario-public.spec.ts` (GET /api/scenarios, GET /api/scenarios/public)
- **認証付きリソース管理**: `apps/backend/test/integrations/user-scenario.spec.ts` (POST/GET /api/users/{uid}/scenario)
- **複合エンドポイント**: `apps/backend/test/integrations/user-stock.spec.ts` (GET/POST/DELETE stocked-scenarios)
- **成功例**: 冗長テスト排除・upsert動作検証・スキーマ変更対応

---

この戦略により、業務領域に応じた効率的で適切なテストアプローチを実現します。