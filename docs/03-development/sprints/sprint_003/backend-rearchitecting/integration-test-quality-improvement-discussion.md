# 統合テストコード品質改善議論書

**作成日**: 2025-08-12  
**対象**: apps/backend/test/integrations/  
**課題**: SonarJSによるコード重複指摘、テスト可読性の向上

## 🎯 議論の背景

### 問題の発見
- **SonarJS警告**: 統合テストでのコード重複が多数検出
- **可読性の課題**: `toHaveProperty` や `expect(typeof)` の過度な使用
- **型安全性の不足**: レスポンススキーマの型保証が不十分

### 現状分析結果
13個の統合テストファイルを調査し、以下の問題パターンを特定：

## 📊 問題パターンの分析

### 1. コード重複の問題

#### **共通関数の重複定義**
複数ファイルで同様のヘルパー関数が定義されている：

```typescript
// game-master-session.spec.ts
const createSession = async (uid: string, sessionData: any) =>
  app.request(`/api/game-masters/${uid}/sessions`, { /* ... */ });

// session-gm.spec.ts  
const getSessionsByGm = async (uid: string) =>
  app.request(`/api/game-masters/${uid}/sessions`, { /* ... */ });

// user-management.spec.ts
const getUser = async (uid: string) =>
  app.request(`/api/users/${uid}`, { /* ... */ });
```

**影響**: メンテナンス性の低下、一貫性の欠如

#### **テストセットアップの重複**
```typescript
// 複数ファイルで共通のパターン
const { getApp, getEnv, getConnectionString } = setupTestEnv({
  beforeSetup: async (connectionString) => {
    await execSql(connectionString, `INSERT INTO odyssage.users...`);
  },
});

beforeEach(async () => {
  app = getApp();
  await execSql(getConnectionString(), 'delete from odyssage.sessions');
});
```

### 2. テスト可読性の問題

#### **冗長なプロパティチェック**
```typescript
// ❌ 現在の実装：可読性が低い
expect(data).toHaveProperty('id');
expect(data).toHaveProperty('gmId', testGMId);
expect(data).toHaveProperty('scenarioId', testSession.scenarioId);
expect(data).toHaveProperty('title', testSession.title);
expect(data).toHaveProperty('status', '準備中');
expect(data).toHaveProperty('createdAt');

expect(typeof session.id).toBe('string');
expect(typeof session.title).toBe('string');
expect(typeof session.status).toBe('string');
expect(typeof session.scenarioId).toBe('string');
```

**問題点**:
- 実際のオブジェクト構造が見えにくい
- 期待値が散在している
- 型チェックとビジネスロジックが混在

#### **レスポンススキーマ検証の非効率性**
```typescript
// ❌ 現在：型安全性が不十分
const data = await res.json<any[]>(); // any型！
if (data.length > 0) {
  const session = data[0];
  expect(session).toHaveProperty('id');
  // 繰り返し...
}
```

## 🚀 改善提案

### 提案1: 共通テストユーティリティの作成

#### **APIクライアントヘルパーの統一**
```typescript
// test/integrations/helpers/api-helpers.ts
export class IntegrationTestApi {
  constructor(private app: any, private env: any) {}

  // ユーザー管理
  async getUser(uid: string) {
    return this.app.request(`/api/users/${uid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, this.env);
  }

  // GM セッション管理
  async createSession(gmId: string, sessionData: GameMasterSessionRequest) {
    return this.app.request(`/api/game-masters/${gmId}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-jwt-token',
      },
      body: JSON.stringify(sessionData),
    }, this.env);
  }

  async getGmSessions(gmId: string) {
    return this.app.request(`/api/game-masters/${gmId}/sessions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, this.env);
  }
}
```

#### **データベースフィクスチャーの統一**
```typescript
// test/integrations/helpers/fixtures.ts
export const TestFixtures = {
  // ユーザーフィクスチャー
  createTestUsers: (connectionString: string) => execSql(
    connectionString,
    `INSERT INTO odyssage.users (id, name) VALUES 
     ('test-gm-id', 'テストGM'),
     ('test-user-id', 'テストユーザー');`
  ),

  // シナリオフィクスチャー
  createTestScenarios: (connectionString: string) => execSql(
    connectionString,
    `INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) VALUES 
     ('${TEST_SCENARIO_ID}', 'テストシナリオ', 'test-gm-id', CURRENT_TIMESTAMP);`
  ),
};
```

### 提案2: 型安全なレスポンス検証

#### **専用のアサーションヘルパー**
```typescript
// test/integrations/helpers/assertions.ts
import { SessionResponse, GameMasterSessionRequest } from '@odyssage/schema';

export const AssertionHelpers = {
  // ✅ 改善案：構造とビジネスロジックを明確に分離
  expectSessionResponse(actual: unknown, expected: Partial<SessionResponse>) {
    expect(actual).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        gmId: expected.gmId || expect.any(String),
        scenarioId: expected.scenarioId || expect.any(String),
        title: expected.title || expect.any(String),
        status: expected.status || expect.any(String),
        createdAt: expect.any(String),
        ...expected, // 明示的に指定された期待値を上書き
      })
    );
  },

  expectSessionArray(actual: unknown[], expectedLength?: number) {
    expect(Array.isArray(actual)).toBe(true);
    if (expectedLength !== undefined) {
      expect(actual.length).toBe(expectedLength);
    }
    
    // 各要素がセッションレスポンス形式であることを確認
    actual.forEach(session => {
      this.expectSessionResponse(session, {});
    });
  },

  expectValidDateString(dateString: string) {
    expect(typeof dateString).toBe('string');
    expect(new Date(dateString)).toBeInstanceOf(Date);
    expect(isNaN(new Date(dateString).getTime())).toBe(false);
  }
};
```

#### **使用例の比較**
```typescript
// ❌ 現在の実装
expect(data).toHaveProperty('id');
expect(data).toHaveProperty('gmId', testGMId);
expect(data).toHaveProperty('scenarioId', testSession.scenarioId);
expect(data).toHaveProperty('title', testSession.title);
expect(data).toHaveProperty('status', '準備中');
expect(data).toHaveProperty('createdAt');
expect(typeof data.id).toBe('string');
expect(typeof data.title).toBe('string');

// ✅ 改善後
AssertionHelpers.expectSessionResponse(data, {
  gmId: testGMId,
  scenarioId: testSession.scenarioId,
  title: testSession.title,
  status: '準備中',
});
```

### 提案3: テスト構造の改善

#### **テストケース分離の明確化**
```typescript
// ✅ 改善案：関心の分離を明確化
describe('POST /api/game-masters/{uid}/sessions', () => {
  describe('正常系', () => {
    it('新規セッションを正しく作成できる', async () => {
      const res = await api.createSession(testGMId, testSession);
      expect(res.status).toBe(201);
      
      const data = await res.json();
      AssertionHelpers.expectSessionResponse(data, {
        gmId: testGMId,
        ...testSession,
        status: '準備中',
      });
    });
  });

  describe('異常系', () => {
    it('必須フィールド不足で400エラー', async () => { /* ... */ });
    it('存在しないシナリオIDで400エラー', async () => { /* ... */ });
  });

  describe('認証・認可', () => {
    it('認証なしでもテスト環境ではバイパス', async () => { /* ... */ });
  });
});
```

## 🤔 議論すべき観点

### 観点1: テスト可読性 vs 実行効率
**質問**: `toHaveProperty`の個別チェック vs `toEqual`での一括チェック

**メリット・デメリット**:
```typescript
// パターンA: 個別チェック（現在）
// ✅ 失敗時のエラーメッセージが具体的
// ❌ 冗長、期待値が分散
expect(data).toHaveProperty('id');
expect(data).toHaveProperty('title', 'expected');

// パターンB: オブジェクトマッチング（提案）
// ✅ 期待値が一箇所に集約、読みやすい
// ❌ 失敗時のメッセージがやや抽象的
expect(data).toEqual(expect.objectContaining({
  id: expect.any(String),
  title: 'expected',
}));
```

### 観点2: 型安全性の程度
**質問**: テスト時の型チェックをどこまで厳密にするか？

**選択肢**:
1. **ランタイム検証重視**: `any`型を許容し、実行時チェックに依存
2. **TypeScript活用**: スキーマ型を最大限活用
3. **ハイブリッド**: 重要な部分のみ型安全、他は柔軟性重視

### 観点3: テストファイル間の依存関係
**質問**: 共通ヘルパーの粒度をどう設計するか？

**選択肢**:
1. **大きな共通クラス**: `IntegrationTestApi` に全API集約
2. **機能別分割**: `UserApi`, `SessionApi`, `ScenarioApi` など
3. **ユーティリティ関数**: 関数単位での小さな共通化

### 観点4: メンテナンス性 vs 学習コスト
**質問**: 新メンバーにとっての理解しやすさを優先するか？

**検討事項**:
- 抽象化レベルの適切性
- 既存テストの移行コスト
- 新規テスト作成時の効率性

## 🚦 推奨アプローチ

### フェーズ1: 重複コード解消（高優先度）
1. **共通APIクライアント作成**: `IntegrationTestApi`クラス
2. **フィクスチャー統一**: `TestFixtures`による標準化
3. **既存テストの段階的リファクタリング**: 影響範囲を限定

### フェーズ2: 可読性改善（中優先度）
1. **アサーションヘルパー導入**: `AssertionHelpers`
2. **レスポンススキーマ検証の型安全化**
3. **テスト構造の再編**: 正常系/異常系の明確な分離

### フェーズ3: 品質向上（低優先度）
1. **エラーメッセージの改善**: 失敗時の情報詳細化
2. **テストデータ管理**: より効率的なフィクスチャー管理
3. **パフォーマンス最適化**: テスト実行時間の短縮

## 📋 決定事項が必要な項目

1. **共通化の粒度**: どの程度まで抽象化するか？
2. **型安全性のレベル**: `any`型の許容範囲は？
3. **移行戦略**: 既存テストをいつ・どのように移行するか？
4. **コードレビュー基準**: 新しいテストのガイドライン

---

**このドキュメントを基に、チームでの議論と方針決定をお願いします。**