# テスト構文分析: `it` vs `test` の使い分け検討

> プロジェクト内のテスト記述方法の統一性・一貫性分析

## 📋 分析概要

### 調査目的
- プロジェクト内での `it()` と `test()` の使用状況把握
- 使い分けの理由・パターンの特定
- テストコード統一化の検討・提案

### 分析対象
- **バックエンド**: `apps/backend/test/**/*.{spec,test}.ts`
- **フロントエンド**: `apps/frontend/**/*.test.*`
- **共通パッケージ**: `packages/**/*.test.*`
- **E2Eテスト**: `packages/bdd-e2e-test/**/*.test.*`

---

## 📊 使用状況統計

### **数量分析**
| 構文 | バックエンド | フロントエンド | パッケージ | 合計 | 割合 |
|------|-------------|---------------|------------|------|------|
| **`it()`** | 26件 (.spec) | 21件 (.test) | 0件 | **47件** | **70%** |
| **`test()`** | 10件 (.unit.test) | 9件 (.test) | 1件 | **20件** | **30%** |

### **ファイル種別での分布**

#### **バックエンド統合テスト (.spec.ts)**
```typescript
// 100% it() 使用
apps/backend/test/integrations/*.spec.ts:
├── session.spec.ts           → it() × 1
├── session-update.spec.ts    → it() × 3  
├── graph-scenario.spec.ts    → it() × 4
├── graph-scene.spec.ts       → it() × 11
└── graph-scene-batch.spec.ts → it() × 7
```

#### **バックエンドユニットテスト (.unit.test.ts)**  
```typescript
// 100% test() 使用
apps/backend/test/units/*.unit.test.ts:
└── graphScene.unit.test.ts   → test() × 10
```

#### **フロントエンドテスト (.test.ts/.tsx)**
```typescript  
// 混在パターン
apps/frontend/src/**/*.test.*:
├── useGraphScenesQuery.test.ts        → test() × 9
├── useOptimisticScenes.test.ts        → it() × 7
├── useGraphScenarioMutation.test.ts   → it() × 4
├── useScenarioWithGraphMutation.test.ts → it() × 5
├── SessionListPage.test.tsx           → it() × 2  
└── sessionListLoader.test.tsx         → it() × 2
```

---

## 🔍 使用パターン分析

### **パターン1: テスト種別による使い分け**

#### **統合テスト → `it()` 採用**
```typescript
// apps/backend/test/integrations/session.spec.ts
describe('セッション統合テスト', () => {
  it('セッションを作成して正しく取得できること', async () => {
    // 統合テストは「それが〜できること」という表現が自然
    const response = await app.request('/api/sessions', ...);
    expect(response.status).toBe(201);
  });
});
```

**理由分析**:
- **BDD（Behavior-Driven Development）スタイル**: 統合テストは「振る舞い」を検証
- **自然言語的表現**: "it should do something" の読みやすさ
- **ステークホルダー理解**: 非技術者でも意図が理解しやすい

#### **ユニットテスト → `test()` 採用**
```typescript
// apps/backend/test/units/graphScene.unit.test.ts  
describe('GraphScene Business Logic Unit Tests', () => {
  test('正常な場合: シーンリストを順序付きで取得', async () => {
    // ユニットテストは「機能のテスト」として明示的
    const result = await GraphSceneService.getScenesForScenario('scenario-1');
    expect(result).toEqual(expectedScenes);
  });
});
```

**理由分析**:
- **機能テスト重視**: 特定の関数・メソッドの動作確認
- **技術的表現**: 実装の詳細に焦点
- **開発者向け**: コードレビューでの理解しやすさ

### **パターン2: フレームワーク・ライブラリの影響**

#### **React Testing Library → `it()` 傾向**
```typescript
// apps/frontend/src/entities/scenario/api/useOptimisticScenes.test.ts
describe('useOptimisticScenes Hook Tests', () => {
  it('should initialize with provided scenes', () => {
    // React Hooksテストでは「〜すべき」が自然
    const { result } = renderHook(() => useOptimisticScenes(mockScenes));
    expect(result.current.scenes).toEqual(mockScenes);
  });
});
```

#### **ビジネスロジックテスト → `test()` 傾向**
```typescript
// apps/frontend/src/entities/scenario/api/useGraphScenesQuery.test.ts
describe('Hook初期化・設定', () => {
  test('scenarioIdが存在する場合、適切なキーでデータ取得を開始する', () => {
    // 具体的な動作検証では test() が明確
    renderHook(() => useGraphScenesQuery({ scenarioId }));
    expect(mockUseSWR).toHaveBeenCalledWith(expectedKey, ...);
  });
});
```

---

## 🤔 `it()` が採用される理由

### **1. BDD（振る舞い駆動開発）の標準**
```typescript
// BDD スタイル - 自然言語的
describe('User Authentication', () => {
  it('should redirect to login when user is not authenticated', () => {
    // "それは〜すべき" の表現が自然
  });
  
  it('should allow access when user has valid token', () => {
    // ビジネス要件を表現しやすい
  });
});
```

### **2. RSpec・Jasmine の伝統**
- **歴史的経緯**: RSpec（Ruby）が起源
- **JavaScript移植**: Jasmine → Mocha → Jest → Vitest
- **エコシステム**: 多くのJavaScriptテストフレームワークが踏襲

### **3. 可読性・表現力**
```typescript
// 自然言語として読みやすい
it('validates user input and returns error message', () => {});

// 対比：test()は機械的な印象
test('validates user input and returns error message', () => {});
```

### **4. 階層構造での意味の明確化**
```typescript
describe('User Registration Process', () => {
  describe('when email is invalid', () => {
    it('should show validation error', () => {});
    it('should not submit form', () => {});
    it('should highlight email field', () => {});
  });
});

// "Process when email is invalid, it should show validation error"
// = 自然な英語文章として読める
```

---

## 📋 現状の問題点・不整合

### **問題1: フロントエンドでの混在**
```typescript
// 同一プロジェクト内で統一性なし
useGraphScenesQuery.test.ts     → test() × 9
useOptimisticScenes.test.ts     → it() × 7
useGraphScenarioMutation.test.ts → it() × 4

// 理由不明な使い分け
```

### **問題2: 命名規則の不整合**
```
バックエンド:
├── *.spec.ts    → it() 使用
└── *.unit.test.ts → test() 使用

フロントエンド:
└── *.test.ts    → it() and test() 混在  // 不整合
```

### **問題3: チームでの認識ズレ**
- **作成者A**: BDD思想で `it()` を選択
- **作成者B**: 機能テスト重視で `test()` を選択
- **統一ルール不在**: 明文化されたガイドライン未整備

---

## 💡 統一化提案

### **🎯 推奨方針: `it()` への統一**

#### **根拠**
1. **業界標準**: JavaScriptエコシステムの主流
2. **表現力**: BDD思想による可読性向上
3. **一貫性**: 統合テストとの整合性確保
4. **将来性**: 新しいメンバーの学習コスト軽減

#### **統一ルール案**
```typescript
// ✅ 推奨: 全テストで it() 使用
describe('Component/Service/Function Name', () => {
  describe('具体的な状況・条件', () => {
    it('期待される動作・結果', () => {
      // テスト内容
    });
  });
});

// 📝 命名パターン
it('should + 動詞 + 期待結果', () => {});           // 基本形
it('動詞 + 目的語 + 条件/結果', () => {});            // 日本語
it('異常系: 条件 → 期待される例外/エラー', () => {}); // エラーケース
```

### **🔄 段階的移行計画**

#### **Phase 1: ガイドライン策定（1週間）**
```markdown
# テスト記述ガイドライン
## 基本方針
- 全テストケースで `it()` を使用
- `test()` は新規作成時に禁止
- 既存 `test()` は修正時に `it()` へ変更

## 命名規則
- 英語: "should + verb + expected result"
- 日本語: "動詞 + 目的語 + 期待する動作/結果"
- エラー系: "異常系: 条件 → 期待されるエラー"
```

#### **Phase 2: 段階的修正（2週間）**
```bash
# 修正対象ファイル
apps/frontend/src/entities/scenario/api/useGraphScenesQuery.test.ts
packages/bdd-e2e-test/e2e/playwright/signup.test.ts
apps/backend/test/units/graphScene.unit.test.ts

# 修正内容
- test() → it() への機械的置換
- テスト記述の統一（命名規則適用）
- describe() 階層の見直し
```

#### **Phase 3: 品質確保（1週間）**
```typescript
// ESLintルール追加案
{
  "rules": {
    "vitest/consistent-test-it": ["error", { "fn": "it" }],
    "vitest/prefer-lowercase-title": "error",
    "vitest/valid-title": ["error", { "mustMatch": "^(should |異常系:|正常系:)" }]
  }
}
```

---

## 📝 実装例: 修正前後

### **修正前（不整合）**
```typescript
// useGraphScenesQuery.test.ts
describe('Hook初期化・設定', () => {
  test('scenarioIdが存在する場合、適切なキーでデータ取得を開始する', () => {
    // test() 使用
  });
});

describe('APIデータ取得処理', () => {
  test('正常な場合：APIからシーンデータを取得し、JSONとして返す', async () => {
    // test() 使用
  });
});
```

### **修正後（統一）**
```typescript  
// useGraphScenesQuery.test.ts
describe('useGraphScenesQuery Hook', () => {
  describe('Hook初期化・設定', () => {
    it('should start data fetching with appropriate key when scenarioId exists', () => {
      // it() に統一 + 英語命名規則
    });
    
    it('should not execute data fetching when scenarioId is empty', () => {
      // 一貫した命名パターン
    });
  });
  
  describe('APIデータ取得処理', () => {
    it('should fetch scene data from API and return as JSON', async () => {
      // BDD思想での表現
    });
    
    it('異常系: API応答がng時エラーメッセージをthrowする', async () => {
      // 日本語での異常系表現
    });
  });
});
```

---

## 🎯 期待効果・メリット

### **開発体験向上**
- **一貫性**: チーム全体での統一的なテスト記述
- **可読性**: 自然言語的な表現による理解しやすさ
- **保守性**: 統一ルールによるメンテナンス効率化

### **品質向上**
- **BDD思想**: ビジネス要件とテストの整合性向上
- **レビュー効率**: 統一された書式による迅速なコードレビュー
- **ドキュメント性**: テストケースが仕様書としても機能

### **学習効率向上**
- **新人教育**: 業界標準に準拠した知識習得
- **技術移行**: 他プロジェクトでの応用可能性
- **エコシステム**: JavaScriptテスト文化への適合

---

## 🏷️ メタデータ

**作成日**: 2025-08-11  
**関連Issue**: #111（バックエンドリアーキテクティング）  
**関連文書**: [[test-architecture-analysis.md]]  
**ステータス**: 統一化提案  
**実装優先度**: Medium（リアーキテクティング作業と並行実施）

**統計データ**:
- **現状**: it() 70% vs test() 30%
- **提案**: it() 100% 統一
- **修正対象**: 20ケース → it() 変更
- **工数見積**: 4-5日（ガイドライン + 修正 + 品質確保）

#test #syntax #it #test #vitest #bdd #consistency #coding-standards