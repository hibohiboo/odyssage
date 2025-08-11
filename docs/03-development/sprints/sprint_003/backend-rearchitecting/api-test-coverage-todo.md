# API テストカバレッジ改善 TODOリスト

## 📊 現状分析結果

**テストカバレッジ**: 29.4% (5/17エンドポイント)  
**テスト済み**: GraphDB関連、Session管理の一部  
**テスト不足**: User管理、Scenario管理、Stock機能、Session一覧

### 🎯 改善目標
- **短期目標**: 核心機能のテストカバレッジ80%以上
- **中期目標**: 全エンドポイントのテストカバレッジ95%以上
- **品質目標**: 統合テスト重視（フルスタック責務分担に基づく）

---

## 🔴 **High Priority - 核心ビジネスロジック（優先実装）**

### User Management API Tests
- [x] **GET /api/users/{uid}** - ユーザー取得テスト **（✅ 完了 - 参考実装）**
  - [x] 正常系: 存在するユーザーの取得
  - [x] 異常系: 存在しないユーザーの404エラー
  - [x] 異常系: 空uidの404エラー
  - [x] セキュリティ: レスポンスヘッダー確認
  - ❌ ~~JWT認証必須~~ → 現在のAPI実装では認証不要（仕様確認要）
  - ❌ ~~バリデーションエラー~~ → userParamSchemaは単純string、400エラー発生せず

- [x] **PUT /api/users/{uid}** - ユーザー登録テスト **（✅ 完了 - 参考実装）**
  - [x] 正常系: 新規ユーザー登録（upsert動作確認）
  - [x] 正常系: 既存ユーザー情報更新
  - [x] 異常系: nameフィールド空文字列（minLength(1)検証）
  - [x] 異常系: nameフィールド未定義（必須フィールド検証）
  - [x] 異常系: 不正JSON形式
  - ❌ ~~セキュリティ: JWT認証必須~~ → 現在の実装では認証不要（仕様確認要）
  - ❌ ~~個別ヘッダーテスト~~ → GET側で十分、冗長性排除

### Scenario Management API Tests  
- [x] **GET /api/scenarios** - シナリオ一覧全取得テスト（実装完了・テスト通過確認済み）
  - [ ] 正常系: 全シナリオ一覧の取得
  - [ ] データ整合性: レスポンススキーマ準拠確認
  - [ ] パフォーマンス: 大量データでの応答時間
  - [ ] セキュリティ: 認証不要エンドポイントの確認

- [x] **GET /api/scenarios/public** - 公開シナリオ一覧取得テスト（実装完了・テスト通過確認済み）
  - [ ] 正常系: 公開設定シナリオのみ取得
  - [ ] データフィルタリング: privateシナリオ除外確認
  - [ ] レスポンス形式: スキーマ準拠確認

- [x] **GET /api/scenario/{id}** - シナリオ取得テスト（実装完了・テスト通過確認済み・OpenAPI修正済み）
  - [ ] 正常系: 指定IDシナリオ取得
  - [ ] 異常系: 存在しないシナリオの404エラー
  - [ ] バリデーション: idパラメータ検証

### User Scenario Management API Tests
- [x] **POST /api/users/{uid}/scenario** - シナリオ作成テスト（実装完了・テスト通過確認済み）
  - [ ] 正常系: 新規シナリオ作成成功
  - [ ] バリデーション: 必須フィールド検証（id, title, overview）
  - [ ] バリデーション: visibility enum値検証
  - [ ] データ整合性: PostgreSQL永続化確認
  - [ ] セキュリティ: JWT認証・ユーザー権限確認

- [ ] **GET /api/users/{uid}/scenario** - ユーザーシナリオ一覧取得テスト
  - [ ] 正常系: 指定ユーザーのシナリオ一覧
  - [ ] データフィルタリング: 該当ユーザーのシナリオのみ
  - [ ] レスポンス形式: スキーマ準拠確認

---

## 🟡 **Medium Priority - 機能完全性確保（次段階実装）**

### User Scenario Stock API Tests
- [ ] **GET /api/users/{uid}/stocked-scenarios** - ストックシナリオ一覧取得テスト
  - [ ] 正常系: ユーザーストック一覧取得
  - [ ] データ関係性: user-scenario関係確認
  - [ ] セキュリティ: JWT認証必須確認

- [ ] **POST /api/users/{uid}/stocked-scenarios/{scenario_id}** - シナリオストック追加テスト
  - [ ] 正常系: シナリオストック追加成功
  - [ ] 重複防止: 既存ストックの重複追加防止
  - [ ] バリデーション: scenario_id存在確認
  - [ ] データ整合性: リレーション作成確認

- [ ] **DELETE /api/users/{uid}/stocked-scenarios/{scenario_id}** - シナリオストック削除テスト  
  - [ ] 正常系: ストック削除成功
  - [ ] 異常系: 存在しないストックの404エラー
  - [ ] データ整合性: リレーション削除確認

### Session Management Enhancement Tests
- [ ] **GET /api/sessions/gm/{gm_id}** - GM管理セッション一覧テスト
  - [ ] 正常系: 指定GMのセッション一覧取得
  - [ ] データフィルタリング: 該当GMセッションのみ
  - [ ] レスポンス形式: スキーマ準拠確認

- [ ] **GET /api/sessions** - セッション一覧取得テスト強化
  - [ ] 包括テスト: 全セッション取得確認
  - [ ] パフォーマンステスト: 大量セッションでの応答
  - [ ] データ整合性: PostgreSQL結合クエリ確認

---

## 🟢 **Low Priority - エッジケース・品質向上（将来実装）**

### Error Handling & Edge Cases
- [ ] **API共通エラーハンドリングテスト**
  - [ ] 400 Bad Request: バリデーションエラー統一
  - [ ] 401 Unauthorized: JWT認証失敗
  - [ ] 404 Not Found: リソース未存在
  - [ ] 500 Internal Server Error: サーバーエラー

- [ ] **CORS・セキュリティヘッダーテスト**
  - [ ] CORS設定: 許可オリジン確認
  - [ ] セキュリティヘッダー: 必須ヘッダー存在確認
  - [ ] JWT検証: トークン形式・有効期限確認

### Performance & Load Tests（⚠️ 実装対象外）
**重要**: パフォーマンステストは現在の優先順位対象外とする

- [ ] ~~**パフォーマンステスト**~~ （実装しない理由）
  - ❌ ~~レスポンス時間: 各エンドポイント応答速度~~ → Testcontainersローカル環境では本番と異なり効果薄
  - ❌ ~~データベース接続: 接続プール効率性~~ → 本番Cloudflare Workers環境で測定すべき
  - ❌ ~~並行アクセス: 複数リクエスト処理性能~~ → 実環境での負荷テストが必要

**代替案**: 
- 本番環境でのAPMツール導入（将来検討）
- Cloudflare Analytics活用
- 統合テストでは機能テストに集中

---

## 📋 実装計画・スケジュール

### Phase 1: High Priority（2-3週間）
- **Week 1**: User Management API Tests実装
- **Week 2**: Scenario Management API Tests実装  
- **Week 3**: User Scenario Management API Tests実装・検証

### Phase 2: Medium Priority（2週間）
- **Week 4**: Stock機能・Session一覧強化テスト
- **Week 5**: 統合テスト・品質確認

### Phase 3: Low Priority（1週間）  
- **Week 6**: エラーハンドリング・エッジケーステスト

---

## 📚 実装完了からの学習・知見（2025-08-11更新）

### ✅ GET /api/users/{uid} テスト実装完了から得た重要な知見

#### **実装時の重要な発見**

1. **バリデーションテスト注意点**:
   - `userParamSchema = v.object({ uid: v.string() })` → 単純string、制約なし
   - 空文字列でも400エラーにならず404エラー（実際動作確認必須）
   - **教訓**: 期待値は推測ではなく実動作で確認

2. **テスト冗長性の除去**:
   - ❌ 「APIとDBデータ一致」テスト → 「正常系取得」テストと完全重複
   - beforeSetupで挿入したデータを両方で検証 → 不要な重複
   - **教訓**: 同一データソースでの検証重複を避ける

3. **可読性向上の効果**:
   - graph-scenario.spec.tsパターン適用: 137行 → 84行（39%削減）
   - 共通リクエスト関数 + beforeEach + 簡潔なテスト名
   - **教訓**: 既存の良いパターンを積極活用

4. **パフォーマンステスト不適切性**:
   - Testcontainersローカル環境 ≠ 本番Cloudflare Workers環境
   - 測定値に意味がなく、テスト実行時間のみ増加
   - **教訓**: 環境差異を考慮したテスト戦略

#### **確立された成功パターン**

```typescript
// ✅ 推奨テスト構造（参考実装: user-management.spec.ts）
describe('API名 統合テスト', () => {
  const testData = { ... };
  const { getApp, getEnv } = setupTestEnv({ beforeSetup: ... });
  let app: ReturnType<typeof getApp>;
  
  beforeEach(() => { app = getApp(); });
  
  /** 共通リクエスト関数 */
  const apiRequest = async (params) => app.request(...);
  
  it('正常系動作確認', async () => {
    const res = await apiRequest(validData);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedData); // 直接比較
  });
  
  it('異常系エラー確認', async () => {
    const res = await apiRequest(invalidData);  
    expect(res.status).toBe(404);
    expect(await res.text()).toBe('Not Found'); // エラー内容確認
  });
});
```

#### **避けるべきアンチパターン**

- ❌ 冗長なデータ整合性テスト（同一データソースでの重複検証）
- ❌ ローカル環境でのパフォーマンステスト
- ❌ 詳細すぎるコメント・プロパティ単位の個別検証
- ❌ バリデーションエラー期待値の推測（実際動作確認必須）
- ❌ `[正常系]`等の冗長なテスト名プレフィックス
- ❌ **個別エンドポイントでの不要なヘッダーテスト**（特殊要件なしなら既存で十分）

#### **PUT実装からの追加知見（2025-08-11）**

5. **レスポンスヘッダーテスト冗長性**:
   - **発見**: PUTエンドポイント用の個別ヘッダーテストは不要
   - **理由**: 特殊なヘッダー要件がなければGET側で十分
   - **対策**: エンドポイントごとの個別実装前に既存カバレッジ確認

6. **スキーマ変更への対応**:
   - **発見**: `userRequestSchema`が`v.minLength(1)`に強化済み
   - **効果**: 空文字列で適切な400エラーが返される
   - **教訓**: 実装中のスキーマ変更を常に反映してテストケース調整

7. **upsert動作の確認**:
   - **重要性**: 新規作成と更新の両方をテストで検証
   - **方法**: PUT後のGETでデータベース状態確認が効果的
   - **価値**: APIの実際の動作（新規/更新）を保証

#### **更新された次回実装への提言**

1. **バリデーション確認**: スキーマ定義を事前確認し、実際の動作を想定
2. **テスト冗長性チェック**: 既存テストとの重複検証を避ける  
3. **レスポンスヘッダー**: 特殊要件なしなら個別実装不要

### ✅ GET /api/scenario/{id} テスト実装完了（2025-08-11）

#### **OpenAPI First 開発の重要性確認**
- [x] **実装完了**: `scenario-detail.spec.ts` - 個別シナリオ詳細取得テスト
- [x] **実装不整合の発見と修正**: OpenAPI仕様 vs 実装の齟齬を特定・解決
- [x] **404エラーハンドリング実装**: 存在しないシナリオに対する適切なエラー処理追加

#### **重要な学習・開発プロセス改善**
1. **OpenAPI First の徹底**:
   - **問題**: 実装とOpenAPI仕様の不整合（パラメータ名:`uid`→`id`、認証要件、404エラーケース未定義）
   - **対策**: 実装変更前にOpenAPI仕様を先に修正するプロセス確立
   - **学習**: 仕様駆動開発の重要性を再確認・ドキュメント整合性確保

2. **API実装品質向上**:
   - **発見**: `const [data] = await getScenariosByid(...)` でundefined時の404未実装
   - **修正**: 存在チェック追加 `if (!data) return c.text('Not Found', 404);`
   - **教訓**: 配列分割代入時のnull/undefined考慮が必須・エラーハンドリング見落とし防止

3. **テスト駆動での品質発見**:
   - テスト実装により実装不備を早期発見
   - 期待動作（404エラー）vs 実際動作（200/null）の齟齬検出
   - **重要**: テストは品質保証だけでなく仕様整合性の確認手段として有効

4. **正しい開発フロー確立**:
   - ❌ **従来**: 実装→テスト→仕様修正
   - ✅ **改善**: OpenAPI仕様修正→実装修正→テスト確認
   - **効果**: 仕様と実装の一貫性保証・後戻り作業削減

#### **改善された次回実装指針**

1. **OpenAPI First 徹底**: 実装前に必ずOpenAPI仕様確認・更新
2. **バリデーション確認**: スキーマ定義を事前確認し、実際の動作を想定
3. **テスト冗長性チェック**: 既存テストとの重複検証を避ける  
4. **レスポンスヘッダー**: 特殊要件なしなら個別実装不要
5. **エラーハンドリング**: null/undefined時の適切な404エラー処理
6. **パターン再利用**: 確立済みの高品質テストパターンの活用

---

## 🛠️ 実装ガイドライン

### テストファイル命名規則
```
apps/backend/test/integrations/
├── user-management.spec.ts        # User API統合テスト
├── scenario-public.spec.ts        # Scenario公開API統合テスト  
├── user-scenario.spec.ts          # User Scenario管理統合テスト
├── user-stock.spec.ts             # Stock機能統合テスト
└── session-list.spec.ts           # Session一覧強化テスト
```

### テスト構成パターン
```typescript
import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

describe('[エンドポイント名] 統合テスト', () => {
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストデータセットアップ
    },
  });

  it('[正常系] 適切なレスポンスが返されること', async () => {
    // テスト実装
  });

  it('[異常系] バリデーションエラーが適切に返されること', async () => {
    // エラーケーステスト
  });
});
```

### 使用ツール・依存関係
- **Vitest**: テストランナー・アサーション
- **Testcontainers**: PostgreSQL統合テスト環境
- **test-utils.ts**: 共通テストユーティリティ
- **Hono Test**: APIリクエスト・レスポンステスト

### 品質基準
- **正常系**: 各エンドポイントの基本動作確認必須
- **異常系**: バリデーションエラー・404エラーケース必須
- **セキュリティ**: JWT認証・権限チェック必須
- **データ整合性**: データベース操作結果確認必須

---

## 📊 進捗管理

### 完了基準
- [ ] **Phase 1完了**: High Priority 6エンドポイントテスト実装完了
- [ ] **Phase 2完了**: Medium Priority 5エンドポイントテスト実装完了  
- [ ] **全体完了**: テストカバレッジ95%以上・全CI/CD通過

### 成功指標  
- **テストカバレッジ向上**: 29.4% → 95%以上
- **CI/CD安定性**: 全テスト通過・安定実行
- **開発効率性**: APIリグレッション検出・品質保証

---

## 🏷️ メタデータ

**作成日**: 2025-08-11  
**関連Issue**: GitHub #111（バックエンドリアーキテクティング）  
**関連文書**: 
- `test-architecture-analysis.md` (テストアーキテクチャ分析)
- `backend-rearchitecting-todo.md` (全体TODOリスト)
- `docs/redocly/openapi/api.yaml` (OpenAPI仕様書)

**優先度**: 高（API品質保証・開発効率向上）  
**見積もり工数**: 6週間（High Priority 3週間 + Medium Priority 2週間 + Low Priority 1週間）

#api #testing #integration #backend #quality-assurance #sprint #issue111