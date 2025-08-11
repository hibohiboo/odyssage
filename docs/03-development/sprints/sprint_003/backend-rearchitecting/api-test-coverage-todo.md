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

- [ ] **PUT /api/users/{uid}** - ユーザー登録テスト
  - [ ] 正常系: 新規ユーザー登録
  - [ ] 正常系: 既存ユーザー情報更新
  - [ ] 異常系: nameフィールド不正値
  - [ ] セキュリティ: JWT認証必須の確認
  - [ ] バリデーション: requestBodyスキーマ検証

### Scenario Management API Tests  
- [ ] **GET /api/scenarios** - シナリオ一覧全取得テスト
  - [ ] 正常系: 全シナリオ一覧の取得
  - [ ] データ整合性: レスポンススキーマ準拠確認
  - [ ] パフォーマンス: 大量データでの応答時間
  - [ ] セキュリティ: 認証不要エンドポイントの確認

- [ ] **GET /api/scenarios/public** - 公開シナリオ一覧取得テスト
  - [ ] 正常系: 公開設定シナリオのみ取得
  - [ ] データフィルタリング: privateシナリオ除外確認
  - [ ] レスポンス形式: スキーマ準拠確認

- [ ] **GET /api/scenario/{id}** - シナリオ取得テスト
  - [ ] 正常系: 指定IDシナリオ取得
  - [ ] 異常系: 存在しないシナリオの404エラー
  - [ ] バリデーション: idパラメータ検証

### User Scenario Management API Tests
- [ ] **POST /api/users/{uid}/scenario** - シナリオ作成テスト
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