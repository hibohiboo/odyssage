# 統合テスト コードレビューチェックリスト

**最終更新**: 2025-08-12  
**対象**: Odyssage Backend 統合テスト  
**用途**: PR作成時・コードレビュー時の品質チェック

## 🎯 使用方法

### レビュー担当者向け
- [ ] このチェックリストの全項目を確認
- [ ] 各カテゴリで✅/❌を判定
- [ ] ❌項目がある場合は修正を依頼
- [ ] 全項目✅でApprove

### PR作成者向け
- [ ] セルフレビューでこのチェックリストを確認
- [ ] 問題がある場合は事前に修正
- [ ] PR説明文に「チェックリスト確認済み」を記載

## 📋 品質チェック項目

### 🏗️ カテゴリA: 基本構造

**A1. ファイル構成**
- [ ] 必要なimportが全て記載されている
- [ ] import順序がlintルールに従っている
- [ ] 不要なimportがない
- [ ] ファイル先頭にテスト概要コメントがある

**A2. describe構造**
- [ ] メインdescribe: 「API名 統合テスト」形式
- [ ] エンドポイント別describe: 「HTTP_METHOD /path」形式
- [ ] テストの分類（正常系/異常系/認証）が明確
- [ ] ネストが適切（3階層まで）

**A3. テストケース命名**
- [ ] 命名規則に従っている（[README.md参照](./README.md#テストケース命名規則)）
- [ ] テストの目的が名前から明確
- [ ] 動詞で始まっている（「取得できる」「作成できる」等）
- [ ] 同名のテストケースがない

```typescript
// ✅ 良い例
describe('User Management API 統合テスト', () => {
  describe('GET /api/users/{uid}', () => {
    it('存在するユーザーを正しく取得できる', () => {});
    it('存在しないユーザーで404エラー', () => {});
  });
});

// ❌ 悪い例  
describe('User tests', () => {
  it('test1', () => {});
  it('user retrieval', () => {});
});
```

### 🔧 カテゴリB: 推奨ツール使用

**B1. IntegrationTestApi使用**
- [ ] `IntegrationTestApi`クラスを使用している
- [ ] 個別ヘルパー関数を作成していない
- [ ] APIクライアントが適切にインスタンス化されている
- [ ] 既存メソッドで対応できない場合のみ新メソッド追加

**B2. TestFixtures使用**
- [ ] `TestFixtures`の定数を使用している
- [ ] ハードコードされたテストデータがない
- [ ] 新しいテストデータは`TestFixtures`に追加
- [ ] `setupBasicTestData()`が適切に使用されている

**B3. ErrorValidationPatterns使用**
- [ ] エラー検証で統一パターンを使用
- [ ] 個別のstatus/header検証をしていない
- [ ] 新しいエラーパターンは`TestStructureGuide`に追加

```typescript
// ✅ 良い例
const api = new IntegrationTestApi(app, getEnv());
const res = await api.getUser(TestFixtures.TEST_USERS.GM_USER.id);
await ErrorValidationPatterns.NotFound.validate(response, 'User');

// ❌ 悪い例
const getUser = async (uid: string) => app.request(`/api/users/${uid}`, ...);
const res = await getUser('hardcoded-user-id');
expect(res.status).toBe(404);
```

### ✅ カテゴリC: 検証パターン

**C1. 値ベース検証**
- [ ] `toEqual()`による完全検証を使用
- [ ] `toHaveProperty()` + `typeof`チェックを避けている
- [ ] `expect.any(String)`等で型チェック
- [ ] 動的値（ID、日付）を適切に処理

**C2. 配列検証**
- [ ] `toHaveLength()`で長さチェック
- [ ] `toContainEqual()`で内容チェック
- [ ] `Array.isArray()`等の冗長チェックを避けている

**C3. エラー検証**
- [ ] 統一されたエラー検証パターン使用
- [ ] ステータスコードの意味が適切
- [ ] エラーメッセージの検証（必要に応じて）

```typescript
// ✅ 良い例
expect(data).toEqual({
  id: expect.any(String),
  name: testUser.name,
  createdAt: expect.any(String),
});

expect(sessions).toHaveLength(2);
expect(sessions).toContainEqual(expect.objectContaining({
  id: testSession.id,
}));

// ❌ 悪い例
expect(data).toHaveProperty('id');
expect(typeof data.id).toBe('string');
expect(data.name).toBe(testUser.name);

expect(Array.isArray(sessions)).toBe(true);
expect(sessions.length).toBe(2);
```

### 🛡️ カテゴリD: 品質保証

**D1. テスト独立性**
- [ ] テスト間で共有状態がない
- [ ] ユニークIDを使用してデータ競合を回避
- [ ] `beforeEach`/`afterEach`で適切にクリーンアップ
- [ ] テストの実行順序に依存していない

**D2. 擬陽性の回避**
- [ ] 条件分岐でテストがスキップされない
- [ ] `if (data.length > 0)`等の条件チェックがない
- [ ] 全ての検証パスが実行される
- [ ] エラーケースも適切にテストされている

**D3. パフォーマンス考慮**
- [ ] 不要なデータベース操作がない
- [ ] 必要最小限のクリーンアップのみ実行
- [ ] API呼び出し回数が最小化されている
- [ ] 実行時間が適切（個別テスト100ms以下目標）

```typescript
// ✅ 良い例
beforeEach(async () => {
  testUserId = `user-${Date.now()}-${Math.random()}`;
  await execSql(getConnectionString(), 'DELETE FROM user_sessions WHERE user_id = $1', [testUserId]);
});

// ❌ 悪い例
beforeEach(async () => {
  await fixtures.cleanupAllTables(); // 過剰なクリーンアップ
  await fixtures.setupBasicTestData(); // 毎回全データ再作成
});

if (data.length > 0) { // 条件分岐による擬陽性リスク
  expect(data[0]).toHaveProperty('id');
}
```

### 📝 カテゴリE: コード品質

**E1. コードスタイル**
- [ ] Lintエラーがない
- [ ] TypeScriptエラーがない
- [ ] 適切なインデント・スペース
- [ ] 不要なコメントがない

**E2. 可読性**
- [ ] テストの意図が明確
- [ ] 変数名が適切
- [ ] マジックナンバーがない
- [ ] 複雑すぎるテストロジックがない

**E3. 保守性**
- [ ] ハードコードされた値がない
- [ ] テストデータの変更が容易
- [ ] 新しい機能追加時の拡張が容易
- [ ] 既存テストへの影響が最小限

```typescript
// ✅ 良い例
const testUser = TestFixtures.TEST_USERS.STANDARD_USER;
const expectedUserCount = 3;

it('指定した数のユーザーを取得できる', async () => {
  const response = await api.getUsers();
  const users = await response.json();
  expect(users).toHaveLength(expectedUserCount);
});

// ❌ 悪い例
const uid = 'abc123'; // ハードコード
const magicNumber = 3; // 意味不明

it('test user stuff', async () => { // 意図不明
  // 複雑なテストロジック...
});
```

## ⚠️ よくある問題と対処法

### 問題1: 重複ヘルパー関数

**問題**:
```typescript
// 各テストファイルで同じような関数を定義
const getUser = async (uid: string) => { ... };
const createSession = async (data: any) => { ... };
```

**対処法**:
```typescript
// IntegrationTestApiに統合
const api = new IntegrationTestApi(app, getEnv());
await api.getUser(uid);
await api.createSession(gmId, sessionData);
```

### 問題2: 個別プロパティチェック

**問題**:
```typescript
expect(data).toHaveProperty('id');
expect(data).toHaveProperty('name');
expect(typeof data.id).toBe('string');
expect(typeof data.name).toBe('string');
```

**対処法**:
```typescript
expect(data).toEqual({
  id: expect.any(String),
  name: expect.any(String),
  // 他のプロパティも含めて完全検証
});
```

### 問題3: 条件分岐による擬陽性

**問題**:
```typescript
if (sessions.length > 0) {
  expect(sessions[0]).toHaveProperty('id');
}
```

**対処法**:
```typescript
expect(sessions).toHaveLength(expectedLength);
if (expectedLength > 0) {
  expect(sessions[0]).toEqual(expect.objectContaining({
    id: expect.any(String),
  }));
}
```

## 🎖️ レビュー品質レベル

### レベル1: 基本（必須）
- カテゴリA（基本構造）: 全項目✅
- カテゴリE（コード品質）: 全項目✅
- Lint/TypeScriptエラーなし

### レベル2: 標準（推奨）
- レベル1の要件 + 
- カテゴリB（推奨ツール使用）: 80%以上✅
- カテゴリC（検証パターン）: 80%以上✅

### レベル3: 優秀（理想）
- レベル2の要件 +
- カテゴリD（品質保証）: 全項目✅
- パフォーマンス最適化済み
- 将来の拡張性を考慮

## 📊 チェックリスト集計

**レビュー完了の判定基準**:
- レベル1: 必須項目 → 🔴 全て✅でないとReject
- レベル2: 推奨項目 → 🟡 80%以上✅でApprove可能
- レベル3: 理想項目 → 🟢 完全✅で優秀評価

**記録方法**:
```markdown
## チェックリスト結果

### カテゴリA: 基本構造 ✅ 4/4
### カテゴリB: 推奨ツール使用 ✅ 3/4 (75%)
### カテゴリC: 検証パターン ✅ 3/3
### カテゴリD: 品質保証 ⚠️ 2/3 (要改善: D2)
### カテゴリE: コード品質 ✅ 3/3

**総合評価**: レベル2 (標準) ✅
**判定**: Approve (D2の改善を推奨)
```

---

**関連ドキュメント**:
- [統合テスト記述ガイド](./README.md)
- [品質改善TODO](../../docs/03-development/sprints/sprint_003/backend-rearchitecting/integration-test-improvement-todo.md)