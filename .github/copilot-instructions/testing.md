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

## 段階的なテスト実装
- 複数のエンドポイントや機能に対するテストは段階的に実装する
  - すべてのテストを一度に実装せず、最も基本的な機能から順に実装すること
  - トグルフラグを使用して、テスト対象を制御できるようにすること
  - 一つのテストが通ることを確認してから次のテストに進むこと

```typescript
// テスト対象のエンドポイントを制御するトグルフラグ
const ENDPOINTS_TO_TEST = {
  CREATE_SCENARIO: true,     // まず最初に実装するエンドポイント
  LIST_SCENARIOS: false,     // 基本機能が動作確認できた後で実装
  UPDATE_SCENARIO: false,    // 後で実装
};

// トグルフラグを使ってテストを段階的に有効化
if (ENDPOINTS_TO_TEST.CREATE_SCENARIO) {
  describe('POST /api/scenario-graphdb/scenarios', () => {
    // 最初のテストケース
  });
}
```

## データベース別のテスト手法

### RDBテスト（リレーショナルデータベース）
- RDBテストでは`setupTestEnv`ヘルパー関数を使用してテスト環境を設定する
- テストデータのセットアップには`execSql`を使用してテスト前にデータを投入する
- SQLでテストデータを事前に投入し、APIを通じてデータを操作・検証する
- テストファイルは`*.rdb.test.ts`の命名規約にのっとる

```typescript
// RDBテストの例
const { getApp, getEnv } = setupTestEnv({
  beforeSetup: async (connectionString) => {
    await execSql(
      connectionString,
      `INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');`
    );
  },
});
```

### GraphDBテスト（グラフデータベース）
- GraphDBテストでも`setupTestEnv`を使用するが、Neo4j用の環境変数を設定する
- Neo4jアダプタを使用してテストデータのクリーンアップを行う
- GraphDBテストでは多くの場合、APIを通じてテストデータを作成する
- テストファイルは`*.graphdb.test.ts`の命名規約にのっとる

```typescript
// GraphDBテストの例
const { getApp, getEnv } = setupTestEnv({
  env: {
    NEO4J_URL: neo4jUrl,
    NEO4J_USERNAME: neo4jUser,
    NEO4J_PASSWORD: neo4jPassword,
  },
});

// テストデータのクリーンアップ
async function cleanupTestData(scenarioId: string) {
  const neo4jAdapter = new Neo4jAdapter(neo4jUrl, neo4jUser, neo4jPassword);
  try {
    await neo4jAdapter.write(
      `MATCH (s:Scenario {id: $id}) DETACH DELETE s`,
      { id: scenarioId }
    );
  } finally {
    await neo4jAdapter.close();
  }
}
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

## Honoエンドポイントでのテスト手法

### Wranglerを使わないテスト手法
- バックエンドのテストでは、`unstable_dev`ではなく、Honoのエンドポイントを直接テストする
- テスト環境セットアップに`setupTestEnv`ヘルパー関数を使用する
- この方法により、Wranglerの実行環境に依存せずにエンドポイントの動作を検証できる

```typescript
// Honoエンドポイントを直接テストする例
describe('シナリオAPI テスト', () => {
  // テスト環境のセットアップ
  const { getApp, getEnv } = setupTestEnv({
    env: {
      // 必要な環境変数
    },
  });

  it('シナリオを作成できること', async () => {
    const app = getApp();
    const env = getEnv();

    // シナリオ作成リクエスト
    const response = await app.request('/api/scenario-graphdb/scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testScenario),
    }, env);

    // レスポンスの検証
    expect(response.status).toBe(201);
  });
});
```

### テストヘルパーの効果的な活用
- テスト用のデータ生成、検証、クリーンアップのための共通ヘルパー関数を作成する
- 環境変数の管理とテスト環境のセットアップを統一する
- テスト後に必ず状態をクリーンアップして、テスト間の干渉を防ぐ

```typescript
// クリーンアップヘルパー関数の例
async function cleanupTestData(id: string) {
  // RDBの場合
  await execSql(connectionString, `DELETE FROM table WHERE id = '${id}'`);
  
  // GraphDBの場合
  const neo4jAdapter = new Neo4jAdapter(/* 接続情報 */);
  try {
    await neo4jAdapter.write(`MATCH (n {id: $id}) DETACH DELETE n`, { id });
  } finally {
    await neo4jAdapter.close();
  }
}
```

## エラーハンドリングとテストの堅牢性
- テスト環境のセットアップやテスト実行時のエラーを適切に処理する
- リソース（データベース接続など）は確実にクローズする
- 条件付きテスト（スキップや特定環境でのみ実行など）には明確なコメントを記述する

```typescript
// エラーハンドリングの例
beforeEach(async () => {
  try {
    // リソースの初期化
    neo4jAdapter = new Neo4jAdapter(/* 接続情報 */);
  } catch (error) {
    console.error('テスト環境のセットアップに失敗:', error);
    throw error; // テスト失敗として扱う
  }
});

afterEach(async () => {
  // リソースの安全な解放
  if (neo4jAdapter) {
    await neo4jAdapter.close().catch(e => 
      console.warn('リソース解放時にエラーが発生:', e)
    );
  }
});
```
