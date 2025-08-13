# GraphDB Testcontainer テスト実装詳細

## 実装完了日
2025-08-13

## 完了したテスト実装

## Backend統合テスト実装完了

### 1. apps/backend/test/integrations/graph-scene.spec.ts (12テスト)

#### 実装概要
- **統合テスト**: GraphDBシーンAPIの完全な統合テスト
- **useNeo4J**: Neo4j Testcontainerベースのテストヘルパー使用
- **全機能カバー**: CRUD操作とエラーハンドリングを網羅

#### テスト構成

**1. シーン作成テスト**
```typescript
describe('シーン作成', () => {
  it('GraphDBにシーンを作成できる', async () => {
    // 正常系テスト
  });

  it.each([
    { case: '必須フィールド不足で400エラー', data: {...} },
    { case: '不正なscenarioId形式で400エラー', data: {...} },
    { case: '負のorder値で400エラー', data: {...} },
  ])('$case', async ({ data }) => {
    // 異常系テスト（バリデーションエラー）
  });
});
```

**2. シーン一覧取得テスト**
```typescript
describe('シーン一覧取得', () => {
  it('正常に取得できる', async () => {
    // 正常系：レスポンス形式確認
  });

  it('不正なシナリオID形式で400エラー', async () => {
    // 異常系：バリデーションエラー
  });

  it('存在しないシナリオIDで空配列', async () => {
    // 異常系：存在しないリソース
  });
});
```

**3. シーン削除テスト**
```typescript
describe('シーン削除', () => {
  it('存在するシーンを削除できる', async () => {
    // 正常系：削除成功
  });

  it.each([
    { case: '不正なUUID形式で400エラー', sceneId: INVALID_UUID, expectedStatus: 400 },
    { case: '存在しないシーン削除で404エラー', sceneId: NON_EXISTENT_SCENE_ID, expectedStatus: 404 },
  ])('$case', async ({ sceneId, expectedStatus }) => {
    // 異常系：ステータスコードのみチェック
  });

  it('削除後に一覧から除外される', async () => {
    // 統合テスト：削除の副作用確認
  });
});
```

### 2. apps/backend/test/integrations/graph-scenario.spec.ts (4テスト)

#### 実装概要
- **基本CRUD**: GraphDBシナリオAPIの基本操作テスト
- **既存機能維持**: 元の4テストを新形式に変換
- **バリデーション**: タイトル検証ロジックのテスト

#### テスト構成
```typescript
it('GraphDBにシナリオを作成できる', async () => {
  // 正常系：新規作成
});

it('GraphDBシナリオを更新できる', async () => {
  // 正常系：既存データの更新
});

it('空タイトルでバリデーションエラー', async () => {
  // 異常系：必須項目チェック
});

it('長すぎるタイトルでバリデーションエラー', async () => {
  // 異常系：長さ制限チェック
});
```

### 3. apps/backend/test/integrations/graph-scene-batch.spec.ts (7テスト)

#### 実装概要
- **一括操作**: GraphDBシーン一括更新APIのテスト
- **大量データ**: 50件での性能・整合性テスト
- **統合確認**: バッチ更新と個別取得の一致性検証

#### テスト構成
```typescript
it('正常に一括更新できる', async () => {
  // 正常系：3件の一括更新
});

it('空配列で更新すると全削除される', async () => {
  // 特殊ケース：全削除操作
});

it('必須フィールド不足は400エラー', async () => {
  // 異常系：データ検証
});

it('不正なUUIDは400エラー', async () => {
  // 異常系：パラメータ検証
});

it('存在しないシナリオIDは404エラー', async () => {
  // 異常系：リソース存在確認
});

it('一括更新後に個別取得で一致する', async () => {
  // 統合テスト：API間の整合性
});

it('50件でも正常に更新でき順序も保持される', async () => {
  // 性能テスト：大量データ処理
});
```

#### 特殊な実装要件
```typescript
beforeEach(async () => {
  // シナリオ事前作成（バッチ更新の前提条件）
  const session = driver.session();
  await session.run(`MERGE (s:Scenario {id: $id}) SET ...`);
  session.close();
});
```

## it.eachリファクタリング方針

### 適用基準
- **同じアサーションパターン**: `expect(res.status).toBe(400)`のみ
- **シンプルな構造**: 複雑な条件分岐が不要
- **データドリブン**: テストケースがデータの違いのみ

### 適用しなかったケース
- **異なるアサーション**: レスポンスボディのチェックが必要
- **複雑なロジック**: if文による条件分岐が必要
- **副作用確認**: 他のAPIとの連携が必要

### リファクタリング結果
```typescript
// Before: 3つの個別テスト
it('必須フィールド不足で400エラー', async () => { ... });
it('不正なscenarioId形式で400エラー', async () => { ... });
it('負のorder値で400エラー', async () => { ... });

// After: 1つのit.eachテスト
it.each([
  { case: '必須フィールド不足で400エラー', data: {...} },
  { case: '不正なscenarioId形式で400エラー', data: {...} },
  { case: '負のorder値で400エラー', data: {...} },
])('$case', async ({ data }) => {
  const res = await putScene({ sceneId: VALID_SCENE_ID, data });
  expect(res.status).toBe(400);
});
```

## ヘルパー関数設計

### useNeo4J
```typescript
export const useNeo4J = async (
  callback: (neo4jConfig: {
    driver: Driver;
    app: typeof app;
    env: Record<string, string>;
  }) => Promise<void>,
) => {
  // Testcontainer起動・設定
  // コールバック実行
  // クリーンアップ
};
```

### API呼び出しヘルパー
```typescript
const putScene = ({ sceneId, data }: { sceneId: string; data: object }) =>
  app.request(`/api/graph-scenes/${sceneId}`, { method: 'PUT', ... }, env);

const getScenesByScenario = (scenarioId: string) =>
  app.request(`/api/graph-scenes/scenario/${scenarioId}`, { method: 'GET', ... }, env);

const deleteScene = (sceneId: string) =>
  app.request(`/api/graph-scenes/${sceneId}`, { method: 'DELETE', ... }, env);
```

## テストデータ設計

### 定数定義
```typescript
const VALID_SCENARIO_ID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_SCENE_ID = '660e8400-e29b-41d4-a716-446655440001';
const INVALID_UUID = 'invalid-uuid';
const NON_EXISTENT_SCENARIO_ID = '770e8400-e29b-41d4-a716-446655440000';
const NON_EXISTENT_SCENE_ID = '880e8400-e29b-41d4-a716-446655440002';
```

### セットアップ処理
```typescript
beforeEach(async () => {
  const session = driver.session();
  await session.run(`
    MERGE (s:Scenario {id: $id})
    SET s.title = $title, s.overview = $overview, ...
  `, { id: VALID_SCENARIO_ID, title: 'テスト', overview: 'テスト用' });
  session.close();
});
```

## 学んだベストプラクティス

### テスト設計
1. **役割分離**: 正常系・異常系・統合系で明確に分ける
2. **データドリブン**: 同じパターンは`it.each`で集約
3. **可読性重視**: 複雑なロジックは個別テストで維持

### Testcontainer使用
1. **`await using`**: 自動リソース管理で安全性確保
2. **環境変数設定**: プロセス環境とenvオブジェクトの両方更新
3. **シンプルなAPI**: コールバック形式で使いやすく

### エラー対応
1. **環境変数タイミング**: 実行時読み込みで動的対応
2. **デフォルトイメージ**: バージョン指定せずに互換性確保
3. **段階的実装**: 基本ケースから拡張して安全に進める