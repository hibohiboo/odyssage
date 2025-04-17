# Copilot テスト指示書

## テスト駆動開発の流れ
- 実装はテスト駆動開発で実施する
  - プロンプトに記載された要件からテストリストを作成すること
  - テストリストを元にテストコードを記述すること
  - テストが通るようにプロダクトコードを記述すること
  - 必ずリファクタリングを実装するか確認すること
  - リファクタリング後はCyclomatic complexityが7以下になるようにすること
  - プロダクトコードとテストコードは一度にすべて記載しないこと
  - テストリストの1ケースずつ実装を進めること

## テスト記述のルール
- テストケースは日本語で記載すること
- テスト時に必要な場合は適切なタイムアウトを設定する
  ```typescript
  // 時間がかかるテストなのでタイムアウトを延長 （デフォルトは5秒）
  setDefaultTimeout(60 * 1000);
  ```

## 認証が必要なAPIのテスト
- 認証ミドルウェアのテスト: `authorizeMiddleware`を使用するエンドポイントをテストする場合は、リクエストヘッダーに`Authorization`を含めることが必須です。

```typescript
// テスト時の認証ヘッダー例
const headerWithAuth = {
  'Content-Type': 'application/json',
  Authorization: `Bearer test`,  // テスト環境ではこの形式で認証をパスできる
};

// リクエスト送信時にヘッダーを指定
const response = await app.request(
  `/api/gm/${testUserId}/sessions/${testSessionId}`,
  {
    method: 'PATCH',
    headers: headerWithAuth,  // 認証ヘッダーを含める
    body: JSON.stringify(updateData),
  },
  env,
);
```

## テストにおける命名規則の統一
- テストコードでは、APIの実際の動作を正確に反映した命名規則を使用します
- テストデータ作成時とレスポンス検証時で同じ命名規則を使用します

```typescript
// テストデータ作成（キャメルケース）
const testData = { gmId: 'user-123', title: 'テスト' };

// API呼び出し
const response = await app.request('/api/sessions', {
  method: 'POST',
  body: JSON.stringify(testData)
});

// レスポンス検証（同じくキャメルケース）
const result = await response.json();
expect(result.gmId).toBe(testData.gmId); // 同じ命名規則で検証
```
