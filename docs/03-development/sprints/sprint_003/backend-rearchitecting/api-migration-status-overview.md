# API移行全体状況・現状把握

> Context-based Design移行の全体進捗・現状分析

## 📊 移行対象API一覧・進捗状況

### **移行マッピング表（計画vs現状）**

| 優先度 | 現在のエンドポイント | 新エンドポイント | 移行種別 | 実装状況 | OpenAPI状況 | テスト状況 |
|--------|---------------------|-----------------|----------|----------|-------------|-----------|
| **1** | `GET /api/scenario/{id}` | `GET /api/scenarios/{id}` | パス修正 | ✅ **完了** | ✅ 完了 | ✅ 完了 |
| **2** | `GET /api/sessions/gm/{gm_id}` | `GET /api/game-masters/{gm_id}/sessions` | 文脈特化 | ❌ **未実装** | ⚠️ 仕様のみ | ❌ 旧API準拠 |
| **3** | `POST /api/users/{uid}/scenario` | `POST /api/authors/{uid}/scenarios` | 文脈特化 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **4** | `PUT /api/users/{uid}/scenario/{id}` | `PUT /api/authors/{uid}/scenarios/{id}` | 文脈特化 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **5** | `PATCH /api/gm/{uid}/sessions/{id}` | `PATCH /api/game-masters/{uid}/sessions/{id}` | ロール統一 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **6** | `POST /api/sessions` | `POST /api/game-masters/{uid}/sessions` | 文脈特化 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **7** | `GET /api/users/{uid}/scenario` | `GET /api/scenarios?author={uid}` | 統合 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **8** | `GET /api/users/{uid}/stocked-scenarios` | `GET /api/scenarios/stocked?gm={uid}` | 統合 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **9** | `POST /api/users/{uid}/stocked-scenarios/{id}` | `POST /api/game-masters/{uid}/scenarios/{id}/actions/stock` | 文脈特化 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |
| **10** | `DELETE /api/users/{uid}/stocked-scenarios/{id}` | `DELETE /api/game-masters/{uid}/scenarios/{id}/actions/unstock` | 文脈特化 | ❌ 未実装 | ❌ 未対応 | ❌ 未対応 |

---

## 🎯 現在の焦点：第2弾移行

### **移行対象詳細**
```http
旧API: GET /api/sessions/gm/{gm_id}
新API: GET /api/game-masters/{gm_id}/sessions
```

### **現状分析**

#### **✅ 完了済み項目**
1. **OpenAPI仕様作成**: 
   - `docs/redocly/openapi/paths/gameMasterSessions.yaml` ✅
   - `docs/redocly/openapi/api.yaml` にパス追加済み ✅

#### **⚠️ 部分完了項目**
1. **OpenAPI旧仕様**: 
   - `docs/redocly/openapi/paths/sessionsByGm.yaml` に非推奨マーク追加済み ✅
   - しかし、実装に合わないスキーマ参照問題あり ⚠️

#### **❌ 未完了項目**
1. **バックエンド実装**: 
   - 新API `GET /api/game-masters/{gm_id}/sessions` 未実装 ❌
   - 旧API廃止警告未追加 ❌
   
2. **統合テスト**:
   - `apps/backend/test/integrations/session-gm.spec.ts` が旧API準拠 ❌
   - 新APIテスト未追加 ❌

3. **フロントエンド調査**: 未実施 ❌

---

## 🔍 発見された問題・課題

### **1. OpenAPI仕様不整合**

#### **問題**:
新API仕様 `gameMasterSessions.yaml` が実装と異なるスキーマを参照

```yaml
# 現在の仕様（問題あり）
schema:
  $ref: '../components/schemas/session.yaml#/SessionList'

# 実装のレスポンス形式
{
  id: string;
  title: string; 
  status: string;
  scenarioId: string;
  scenarioTitle: string;
  createdAt: string;
  updatedAt: string;
}[]
```

#### **解決方針**:
設計原則「レスポンス形式維持」に従い、新APIスキーマを実装準拠に修正

### **2. バックエンド実装未対応**

#### **問題**:
- 新APIエンドポイント `GET /api/game-masters/{gm_id}/sessions` が未実装
- `apps/backend/src/route/index.ts` に `game-masters` ルート定義なし

#### **解決方針**:
1. 新ルート作成または既存ルート拡張
2. 既存ロジック（`getSessionsByGmId`）の流用
3. レスポンス形式完全維持

### **3. テスト環境の課題**

#### **問題**:
既存テスト `session-gm.spec.ts` が旧APIパス `sessions/gm/{gm_id}` に依存

#### **解決方針**:
1. テスト先行修正：新APIパスに更新
2. 既存ロジック・期待値は完全維持

---

## 📅 第2弾移行の修正計画

### **Phase 1: OpenAPI仕様修正**
- [ ] **スキーマ整合性修正**: 実装準拠のスキーマ定義
- [ ] **仕様確認**: 新旧API仕様の整合性確認

### **Phase 2: テスト先行修正**  
- [ ] **統合テスト更新**: `session-gm.spec.ts` の新APIパス対応
- [ ] **期待値維持**: レスポンス形式・テストロジック維持

### **Phase 3: バックエンド実装**
- [ ] **新エンドポイント実装**: `GET /api/game-masters/{gm_id}/sessions`
- [ ] **旧エンドポイント廃止警告**: ヘッダー・ログ追加
- [ ] **ロジック流用**: 既存 `getSessionsByGmId` 完全流用

### **Phase 4: 検証・完了**
- [ ] **テスト実行**: 新API動作確認
- [ ] **フロントエンド調査**: 使用状況確認
- [ ] **技術的負債削除**: 旧API削除

---

## 🎯 第1弾移行の成功パターン適用

### **確立された設計原則**
1. **パス変更のみ**: レスポンス形式完全維持
2. **ロジック流用**: 既存実装の完全流用  
3. **技術的負債削除**: 移行完了後即座削除

### **確立された作業順序**
```
設計・仕様 → テスト修正 → 実装修正 → 検証・完了
```

### **第1弾で削除された技術的負債**
- 旧API実装・テスト・仕様で約200行削除
- 重複コードによる保守負荷解消
- 開発者の認知負荷軽減

---

## 🚨 注意事項・制約

### **必須遵守事項**
1. **レスポンス形式変更禁止**: 既存形式の完全維持
2. **テスト先行**: 実装前のテスト修正必須
3. **段階的検証**: 各Phase完了後の動作確認

### **リスク要因**
1. **テスト環境**: Docker/Testcontainers環境問題の継続
2. **フロントエンド影響**: 使用状況未確認による潜在的影響
3. **ロール名変更**: `gm` → `game-masters` による大幅変更

---

## 📈 全体移行進捗

### **数値指標**
- **完了済み**: 1/10 API (10%)
- **進行中**: 1/10 API (10%) - 第2弾
- **未着手**: 8/10 API (80%)

### **予想残工数**
- **第2弾**: 3-4日（ロール名変更のため）
- **第3-10弾**: 各2-3日（パターン確立により効率化）
- **全体**: 約4-5週間

---

## 🏷️ メタデータ

**作成日**: 2025-08-12  
**現在フェーズ**: 第2弾移行（sessions/gm → game-masters/sessions）  
**関連文書**: 
- `api-migration-phase1-completion.md` (第1弾完了報告)
- `api-migration-design-principles.md` (設計原則確立)
- `api-context-based-refactoring-todo.md` (全体計画)

**ステータス**: 第2弾移行準備・現状把握完了  
**次のアクション**: OpenAPI仕様修正 → テスト修正 → 実装修正

#api-migration #status-overview #progress-tracking #backend-refactoring #context-based-design