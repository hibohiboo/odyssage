# 統合テスト記述ガイド

**最終更新**: 2025-08-12  
**対象**: Odyssage Backend 統合テスト  
**品質改善プロジェクト**: フェーズ1-3完了済み

## 📖 概要

このガイドは、統合テスト品質改善プロジェクトで確立されたベストプラクティスを文書化したものです。新規テストの記述、既存テストの改善、コードレビューの基準として活用してください。

## 🏗️ 基本構造

### 1. ファイル構成

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * API名 統合テスト
 * エンドポイントの説明とテスト対象の概要
 */
describe('API名 統合テスト', () => {
  // テスト設定
  // テストデータ定義
  // テスト実装
});
```

### 2. 統一されたdescribe構造

```typescript
describe('API名 統合テスト', () => {
  describe('HTTP_METHOD /endpoint', () => {
    // 正常系テスト
    it('リソースを正しく取得できる', () => {});
    
    // スキーマ検証
    it('レスポンススキーマが適切な形式である', () => {});
    
    // 異常系テスト  
    it('バリデーションエラーで400エラー', () => {});
    it('存在しないリソースで404エラー', () => {});
    
    // 認証認可テスト
    it('認証なしでもテスト環境ではバイパスされ200成功', () => {});
  });
});
```

## 🔧 推奨ツールの使用方法

### IntegrationTestApiクラス

**目的**: API呼び出しの共通化とコードの重複排除

```typescript
// ✅ 推奨: IntegrationTestApiを使用
const api = new IntegrationTestApi(app, getEnv());
const res = await api.getUser(testUserId);

// ❌ 非推奨: 個別のヘルパー関数
const getUser = async (uid: string) => app.request(...);
```

**主要メソッド**:
- `getUser(uid)`, `putUser(uid, userData)`
- `createSession(gmId, sessionData)`, `getGmSessions(gmId)`
- `getStockedScenarios(uid)`, `addScenarioStock(uid, scenarioId)`
- `createScenario(userId, scenarioData)`, `getAllScenarios()`

### TestFixturesクラス

**目的**: テストデータの標準化と一元管理

```typescript
// ✅ 推奨: TestFixturesの定数を使用
const testUserId = TestFixtures.TEST_USERS.GM_USER.id;
const testScenario = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO;

// セットアップでの使用
beforeSetup: async (connectionString) => {
  const fixtures = new TestFixtures(connectionString);
  await fixtures.setupBasicTestData();
}
```

## ✅ 検証パターン

### 1. 値ベース検証（推奨）

```typescript
// ✅ 推奨: 完全な値検証
expect(data).toEqual({
  id: expect.any(String),
  title: testScenario.title,
  status: '準備中',
  createdAt: expect.any(String),
});

// ❌ 非推奨: 個別プロパティチェック
expect(data).toHaveProperty('id');
expect(typeof data.id).toBe('string');
expect(data.title).toBe(testScenario.title);
```

### 2. 配列検証

```typescript
// ✅ 推奨: 長さと内容の統合チェック
expect(data).toHaveLength(2);
expect(data).toContainEqual(expect.objectContaining({
  id: testScenario1.id,
  title: testScenario1.title,
}));

// ❌ 非推奨: 分離した検証
expect(Array.isArray(data)).toBe(true);
expect(data.length).toBe(2);
```

### 3. エラーハンドリング

```typescript
// ✅ 推奨: 統一されたエラー検証
import { ErrorValidationPatterns } from './helpers/TestStructureGuide';

await ErrorValidationPatterns.BadRequest.validate(response, 'Invalid input');
ErrorValidationPatterns.NotFound.validate(response, 'User');

// ❌ 非推奨: 個別エラーチェック
expect(response.status).toBe(400);
expect(response.headers.get('content-type')).toContain('application/json');
```

## 🎯 テストケース命名規則

### 正常系
- `リソースを正しく取得できる`
- `新規...を正しく作成できる`
- `...を正しく更新できる`
- `...を正しく削除できる`

### 異常系
- `バリデーションエラーで400エラー`
- `不正なUUID形式で400エラー`
- `存在しない...で404エラー`
- `権限不足で403エラー`

### スキーマ検証
- `レスポンススキーマが適切な形式である`
- `...がない場合は空配列を返す`

### 認証認可
- `認証なしでもテスト環境ではバイパスされ200成功`
- `認証が不要で200成功`

## 🚀 パフォーマンス最適化

### 1. データベース操作の最小化

```typescript
// ✅ 推奨: 必要最小限のクリーンアップ
beforeEach(async () => {
  // 関連テーブルのみクリーンアップ
  await execSql(getConnectionString(), 'DELETE FROM scenario_stock');
});

// ❌ 非推奨: 全テーブルクリーンアップ
beforeEach(async () => {
  await fixtures.cleanupAllTables();
  await fixtures.setupBasicTestData();
});
```

### 2. 共有テストデータの活用

```typescript
// ✅ 推奨: beforeAllで共有データ作成
beforeAll(async () => {
  const fixtures = new TestFixtures(connectionString);
  await fixtures.setupBasicTestData(); // ユーザー・シナリオ
});

beforeEach(async () => {
  // テスト固有データのみクリーンアップ・作成
  await fixtures.cleanupSessions();
});
```

### 3. API呼び出し回数の最小化

```typescript
// ✅ 推奨: レスポンス再利用
const listRes = await api.getStockedScenarios(testUserId);
const stocks = await api.getJsonResponse(listRes);

// ❌ 非推奨: 重複API呼び出し
const listRes = await api.getStockedScenarios(testUserId);
const stocks1 = await listRes.json();
const stocks2 = await listRes.json(); // エラーになる可能性
```

## 🛡️ 品質保証

### 1. テスト独立性の確保

```typescript
// ✅ 推奨: ユニークIDによる分離
beforeEach(() => {
  testResourceId = `resource-${Date.now()}-${Math.random()}`;
});

// ❌ 非推奨: 固定IDによる依存関係
const testResourceId = 'fixed-test-id'; // テスト間で競合の可能性
```

### 2. 擬陽性の回避

```typescript
// ✅ 推奨: 確定的な検証
expect(data).toHaveLength(2);
expect(data[0].id).toBe(expectedId1);
expect(data[1].id).toBe(expectedId2);

// ❌ 非推奨: 条件分岐による擬陽性
if (data.length > 0) {
  expect(data[0]).toHaveProperty('id'); // 条件によってスキップされる
}
```

### 3. エラーメッセージの明確化

```typescript
// ✅ 推奨: わかりやすいエラーメッセージ
expect(response.status).toBe(200); // Vitestが自動的に詳細表示

// ✅ 推奨: カスタムメッセージ（必要に応じて）
expect(data.length).toBe(expectedLength, 
  `Expected ${expectedLength} items but got ${data.length}`);
```

## 📋 必須チェックリスト

### 新規テスト作成時

- [ ] IntegrationTestApiクラスを使用している
- [ ] TestFixturesの定数を使用している
- [ ] 統一されたdescribe構造に従っている
- [ ] 値ベース検証を使用している
- [ ] テストケース名が命名規則に従っている
- [ ] beforeEach/afterEachでテスト独立性を確保している
- [ ] 不要なコメントを避けている
- [ ] import順序がlintルールに従っている

### 既存テスト改善時

- [ ] 重複ヘルパー関数をIntegrationTestApiに統合
- [ ] toHaveProperty + typeof を toEqual に変更
- [ ] 冗長なテストケースを削除
- [ ] 擬陽性の可能性を排除
- [ ] パフォーマンス改善（不要なDB操作削除）

## 🔍 トラブルシューティング

### よくある問題と解決方法

**1. テスト間でのデータ競合**
```typescript
// 解決方法: ユニークIDの使用
const uniqueId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**2. PostgreSQLコンテナ接続エラー**
```bash
# 解決方法: Dockerの再起動
docker system prune -f
bun run test
```

**3. import順序エラー**
```typescript
// 正しい順序
import { external } from 'external-package';
import { internal } from './internal-module';
import { helpers } from './helpers';
import { utils } from './test-utils';
```

**4. expectインポートエラー**
```typescript
// 必須インポート
import { describe, expect, it, beforeEach } from 'vitest';
```

## 📈 継続的改善

### パフォーマンス監視

- テスト実行時間: 個別テスト100ms以下、ファイル全体5秒以下を目標
- 失敗率: 5%以下を維持
- GraphDBテストは現在除外中（Neo4j接続問題）

### 新機能追加時の拡張方針

1. **IntegrationTestApiの拡張**: 新しいエンドポイント用メソッド追加
2. **TestFixturesの拡張**: 新しいリソース用の定数・ヘルパー追加
3. **エラーパターンの拡張**: 新しいエラー形式の統一検証パターン追加

---

**参考資料**:
- [フェーズ1-3完了記録](../../docs/03-development/sprints/sprint_003/backend-rearchitecting/integration-test-improvement-todo.md)
- [TestStructureGuide.ts](./helpers/TestStructureGuide.ts)
- [IntegrationTestApi.ts](./helpers/IntegrationTestApi.ts)
- [TestFixtures.ts](./helpers/TestFixtures.ts)