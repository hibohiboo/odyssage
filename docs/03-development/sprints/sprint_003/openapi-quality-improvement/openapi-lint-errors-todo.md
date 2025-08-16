# OpenAPI仕様品質改善TODO

## 📋 概要

OpenAPI仕様ファイルのlint結果で33個のエラーと7個の警告が検出されました。これらを修正してAPIドキュメントの品質を向上させます。

**実行コマンド**: `bun run lint` (redocly lint)  
**対象ファイル**: `docs/redocly/openapi/api.yaml` およびその関連ファイル

---

## 🚨 Critical Errors (修正必須)

### **1. 参照解決エラー (no-unresolved-refs)**
**件数**: 18件  
**優先度**: 🔥 最高

#### **問題**
```yaml
# 複数ファイルで発生
'401':
  $ref: '../components/schemas/response.yaml#/Unauthorized'
```

#### **原因**
- `response.yaml` 内に参照先のスキーマが存在しない
- 参照パスが正しくない

#### **修正タスク**
- [ ] `components/schemas/response.yaml` を確認・修正
- [ ] 必要なレスポンススキーマを定義
  - [ ] `Unauthorized`
  - [ ] `Forbidden` 
  - [ ] `NotFound`
  - [ ] `InternalServerError`
  - [ ] `BadRequestResponse`
  - [ ] `UnauthorizedResponse`
  - [ ] `InternalServerErrorResponse`

### **2. operationId重複エラー**
**件数**: 1件  
**優先度**: 🔥 最高

#### **問題**
```yaml
# userScenario.yaml:51
get:
  summary: ユーザーシナリオ一覧全取得
  # operationIdが重複している
```

#### **修正タスク**
- [ ] `userScenario.yaml` の `operationId` を一意の値に変更

### **3. パスパラメータ定義エラー**
**件数**: 4件  
**優先度**: 🔥 最高

#### **問題**
```yaml
# userScenarioStockItem.yaml
# パス: /api/users/{uid}/stocked-scenarios/{scenario_id}
parameters:
  - name: user_id  # 間違い: {uid}が必要
    in: path
```

#### **修正タスク**
- [ ] `userScenarioStockItem.yaml` のパラメータ修正
  - [ ] `user_id` → `uid` に変更
  - [ ] 不足している `scenario_id` パラメータを追加

### **4. セキュリティ定義エラー**
**件数**: 7件  
**優先度**: 🔥 最高

#### **問題**
```yaml
# 複数ファイルで security が未定義
get:
  summary: シナリオ詳細取得
  # security定義がない
```

#### **修正タスク**
- [ ] セキュリティスキームの統一
  - [ ] `BearerAuth` → `bearerAuth` に統一
  - [ ] 各操作にセキュリティ定義を追加
- [ ] 対象ファイル:
  - [ ] `scenarios-detail.yaml`
  - [ ] `sessions.yaml`
  - [ ] `session.yaml`
  - [ ] `gameMasterSessions.yaml`
  - [ ] `authorScenarios.yaml`

---

## ⚠️ Warnings (改善推奨)

### **1. 4XXレスポンス不足**
**件数**: 1件  
**優先度**: 🟡 中

#### **問題**
```yaml
# sessions.yaml
responses:
  '200':
    description: セッション一覧取得成功
  # 4XXレスポンスがない
```

#### **修正タスク**
- [ ] `sessions.yaml` に4XXレスポンスを追加

### **2. スキーマ不適合例**
**件数**: 6件  
**優先度**: 🟡 中

#### **問題**
```yaml
# gameMasterSessions.yaml
examples:
  success:
    value:
      - id: '550e8400-e29b-41d4-a716-446655440000'
        title: '失われた遺跡の謎'  # スキーマに存在しないプロパティ
```

#### **修正タスク**
- [ ] `gameMasterSessions.yaml` のexample修正
  - [ ] 必須プロパティを追加: `name`, `gm`, `gmId`, `players`, `maxPlayers`
  - [ ] 不要プロパティを削除: `title`

---

## 🛠️ 修正計画

### **Phase 1: 最重要エラー修正 (3-5時間)**
1. **レスポンススキーマ定義作成**
   - `components/schemas/response.yaml` の修正・拡充
   - 不足しているエラーレスポンススキーマを追加

2. **パラメータ定義修正**
   - `userScenarioStockItem.yaml` のパスパラメータ修正
   - パス定義との整合性確保

3. **operationId重複解決**
   - `userScenario.yaml` のoperationId修正

### **Phase 2: セキュリティ定義統一 (2-3時間)**
1. **セキュリティスキーム統一**
   - `BearerAuth` → `bearerAuth` 統一
   - 各操作へのセキュリティ定義追加

### **Phase 3: 品質向上 (1-2時間)**
1. **レスポンス不足解消**
   - 4XXレスポンスの追加

2. **Example修正**
   - スキーマ適合の例を作成

---

## 📁 対象ファイル一覧

### **修正が必要なファイル**
- [ ] `components/schemas/response.yaml` (最重要)
- [ ] `paths/userScenario.yaml`
- [ ] `paths/userScenarioStockItem.yaml`
- [ ] `paths/userScenarioStocks.yaml`
- [ ] `paths/graphScenarios.yaml`
- [ ] `paths/graphScenes.yaml`
- [ ] `paths/graphScenesByScenario.yaml`
- [ ] `paths/graphScenesBatch.yaml`
- [ ] `paths/gameMasterSessions.yaml`
- [ ] `paths/scenarios-detail.yaml`
- [ ] `paths/sessions.yaml`
- [ ] `paths/session.yaml`
- [ ] `paths/authorScenarios.yaml`

### **セキュリティ定義が必要なファイル**
- [ ] `scenarios-detail.yaml`
- [ ] `sessions.yaml` (GET/POST)
- [ ] `session.yaml`
- [ ] `gameMasterSessions.yaml` (GET)
- [ ] `authorScenarios.yaml`

---

## 🎯 修正後の期待結果

### **品質指標**
- ❌ **現在**: 33 errors, 7 warnings
- ✅ **目標**: 0 errors, 0 warnings

### **改善される機能**
- ✅ **API ドキュメント生成**: エラーなしでの正常生成
- ✅ **コード生成**: クライアントSDKの正確な生成
- ✅ **型安全性**: TypeScriptでの正確な型定義
- ✅ **開発者体験**: 明確なAPIリファレンス

---

## 🔧 修正手順

### **Step 1: 環境確認**
```bash
cd docs/redocly
bun run lint  # 現在のエラー状況確認
```

### **Step 2: レスポンススキーマ修正**
```bash
# 最重要: response.yamlを修正
code components/schemas/response.yaml
```

### **Step 3: 段階的修正・確認**
```bash
# 修正後に都度確認
bun run lint
redocly preview  # プレビューで動作確認
```

### **Step 4: 完了確認**
```bash
bun run lint  # 0 errors, 0 warnings になることを確認
redocly build-docs openapi/api.yaml  # ビルド成功確認
```

---

## 📝 修正時の注意事項

### **破壊的変更の回避**
- 既存のAPI利用者に影響しない範囲での修正
- operationIdの変更は慎重に（クライアントコード生成に影響）

### **一貫性の確保**
- 似たような操作では同じレスポンス構造を使用
- セキュリティ要件の統一

### **テスト**
- 修正後は必ず `redocly preview` で動作確認
- 主要なAPIエンドポイントが正しく表示されることを確認

---

## 🏷️ メタデータ

**作成日**: 2025-08-14  
**優先度**: 🔥 高 (API品質に直接影響)  
**推定工数**: 6-10時間  
**担当者**: Backend API担当  

**関連イシュー**: OpenAPI仕様品質改善  
**マイルストーン**: Sprint 3 - API仕様安定化

**完了条件**:
- ✅ `redocly lint` でエラー0件、警告0件
- ✅ `redocly preview` で正常表示
- ✅ 主要APIエンドポイントが適切にドキュメント化

#openapi #api-documentation #quality-improvement #lint-errors #sprint-003