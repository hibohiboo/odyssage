# API クリーンアップ候補管理

> **フロントエンド未使用APIと将来的削除候補の管理**

## 📋 目的

このドキュメントでは、フロントエンドで未使用のAPIエンドポイントを記録し、将来のリファクタリング・クリーンアップ時の参考資料として管理します。

---

## 🗑️ 削除候補API一覧

### **高優先度（削除推奨）**

| API | 状況 | 発見日 | 備考 |
|-----|------|--------|------|
| `GET /api/scenario/{id}` | 旧API・削除済み | 2025-08-12 | 調査ミスで誤削除→フロントエンド新API対応で復旧<br/>第1弾移行完了（結果的に成功） |
| `GET /api/game-masters/{uid}/sessions` | 新API・未使用 | 2025-08-12 | フロントエンドで未使用<br/>代替API: `/api/sessions?gm_id={uid}` |

### **中優先度（要調査）**

| API | 状況 | 発見日 | 備考 |
|-----|------|--------|------|
| `GET /api/sessions/gm/{gm_id}` | 旧API・削除済み | 2025-08-12 | 第2弾移行で削除済み<br/>フロントエンドで元々未使用 |

### **低優先度（保留）**

| API | 状況 | 発見日 | 備考 |
|-----|------|--------|------|
| - | - | - | 今後の調査で追加 |

---

## 📊 詳細情報

### **GET /api/scenario/{id}** ✅ 調査ミス発覚・復旧完了

**⚠️ 調査ミス事例**: フロントエンドで実際に使用中のAPIを誤って削除 → フロントエンド側対応で解決

**基本情報**:
- **現在のステータス**: 削除済み（フロントエンド側で新API対応済み）
- **実際の使用状況**: `apps/frontend/src/entities/scenario/api/fetchScenrio.ts:16` で使用中だった
- **削除実施日**: 2025-08-12
- **問題発覚日**: 2025-08-12（削除後に発見）
- **復旧完了日**: 2025-08-12（フロントエンド置き換えで対応）

**調査ミス時の使用箇所**:
```typescript
// 調査ミス時（旧APIを使用中だった）
const response = await apiClient.api.scenario[':id'].$get({
  param: { id },
});
```

**復旧対応内容**:
```typescript
// 対応後（新APIに置き換え）
const response = await apiClient.api.scenarios[':id'].$get({
  param: { id },
});
```

**調査ミスの根本原因**:
1. **検索パターン不足**: `/api/scenario/` 文字列での検索のみ実施
2. **HonoClient理解不足**: APIクライアントがパス文字列を直接記述しない仕組みの見落とし
3. **検索範囲不足**: `.scenario[':id']` や `apiClient.api.scenario` パターンの検索漏れ

**実際に必要だった検索パターン**:
```bash
# 実施済み（不十分）
grep -r "/api/scenario/" apps/frontend/

# 必要だった検索（実施していない）
grep -r "\.scenario\[" apps/frontend/
grep -r "apiClient.*scenario" apps/frontend/
grep -r "api.*scenario.*get\|scenario.*api.*get" apps/frontend/
```

**復旧アプローチ**:
- ✅ **フロントエンド対応**: 旧API復旧ではなく新APIへの置き換えで解決
- ✅ **効率的解決**: バックエンド変更不要での迅速な問題解決
- ✅ **移行完了**: 結果的に意図した移行が完了

**教訓・重要性**:
- 🔍 **調査手法改善**: HonoClient対応の検索パターン必須
- ⚡ **復旧方針**: 後方復旧より前方修正の有効性
- 🎯 **最終目標達成**: 調査ミスがあっても移行目標は達成

### **GET /api/game-masters/{uid}/sessions** ⚠️ 削除検討

**基本情報**:
- **現在のステータス**: 実装済み・未使用
- **実装日**: 2025-08-12（第2弾移行で作成）
- **フロントエンド使用状況**: 未使用（作成時点で確認済み）
- **代替API**: `GET /api/sessions?gm_id={uid}` （フロントエンドで実際に使用中）

**発見経緯**:
- 第2弾API移行 (`/api/sessions/gm/{gm_id}` → `/api/game-masters/{uid}/sessions`) 作業中
- フロントエンド影響調査で新旧両APIとも未使用を発見
- 実際の使用API: クエリパラメータ形式 `GET /api/sessions?gm_id={uid}`

**削除候補ファイル**:
- `apps/backend/src/route/gameMasters.ts` (全体)
- `apps/backend/src/route/index.ts:23` (ルート登録)
- `docs/redocly/openapi/paths/gameMasterSessions.yaml` (全体)
- `docs/redocly/openapi/api.yaml:35` (パス登録)
- `apps/backend/test/integrations/session-gm.spec.ts` (全体)

**削除による影響**:
- ✅ **フロントエンド**: 影響なし（未使用のため）
- ✅ **代替手段**: `GET /api/sessions?gm_id={uid}` で同等機能提供
- ✅ **バックエンドテスト**: 削除しても他機能への影響なし
- ⚠️ **移行作業**: 実装した移行作業が無価値化

**削除効果**:
- **コード削減**: 約150行
- **保守負荷軽減**: 未使用APIの維持コスト削除
- **API設計明確化**: 重複機能の排除

**削除見込み時期**: 未定（リファクタリング時に検討）

### **GET /api/sessions/gm/{gm_id}** ✅ 削除完了

**基本情報**:
- **現在のステータス**: 削除済み（第2弾移行完了）
- **削除実施日**: 2025-08-12
- **フロントエンド使用状況**: 元々未使用
- **代替API**: 理論上は `GET /api/game-masters/{uid}/sessions`、実際は `GET /api/sessions?gm_id={uid}`

**削除完了内容**:
- ✅ バックエンド実装削除: `apps/backend/src/route/session.ts`
- ✅ OpenAPI仕様削除: `docs/redocly/openapi/paths/sessionsByGm.yaml`
- ✅ 技術的負債解消: 約150行のコード削除

---

## 🔍 調査履歴

### **2025-08-12: Sprint 003 第1弾API移行調査** ❌ 調査ミス

**調査範囲**:
```bash
# フロントエンド全体での旧API使用状況調査
apps/frontend/**/*.{ts,tsx,js,jsx,vue}
```

**実施した検索（不十分）**:
```bash
grep -r "/api/scenario/" apps/frontend/  # ❌ 見つからず
grep -r "scenario.*api" apps/frontend/   # ❌ パターン不適切
```

**調査結果（誤り）**:
- `GET /api/scenario/{id}`: フロントエンドで未使用 → **❌ 誤判定・誤削除**
- 他のscenario関連API: `/api/graph-scenes/scenario/{scenarioId}` は別API・使用中

**調査ミス発覚・復旧完了（同日）**:
- **実際の使用箇所**: `apps/frontend/src/entities/scenario/api/fetchScenrio.ts:16`
- **使用形式**: `apiClient.api.scenario[':id'].$get()` （Honoクライアント形式）
- **復旧方法**: フロントエンド側で `scenarios[':id'].$get()` に置き換え
- **最終結果**: 意図した移行が完了（旧API→新API）

**調査者**: Claude (Sprint 003作業中)  
**調査方法**: Grep tool による全文検索（パターン不足）

### **2025-08-12: Sprint 003 第2弾API移行調査**

**調査範囲**:
```bash
# フロントエンド全体でのGMセッション関連API使用状況調査
apps/frontend/**/*.{ts,tsx,js,jsx}
```

**調査結果**:
- `GET /api/sessions/gm/{gm_id}`: フロントエンドで未使用 → 削除実施
- `GET /api/game-masters/{uid}/sessions`: フロントエンドで未使用 → 削除検討
- 実際の使用API: `GET /api/sessions?gm_id={uid}` (クエリパラメータ形式)

**重要発見**:
- **移行対象自体が不要**: 旧APIも新APIも使用されておらず、代替APIが存在
- **工数無駄の発覚**: 不要な移行作業による約150行の実装が無価値化

**調査者**: Claude (Sprint 003作業中)  
**調査方法**: Grep tool による複数パターン検索

---

## 📅 定期調査スケジュール

### **四半期レビュー**
- **頻度**: 3ヶ月毎
- **対象**: 全APIエンドポイントのフロントエンド使用状況
- **目的**: 新たな削除候補の発見・既存候補の再評価

### **リリース前確認**
- **タイミング**: メジャーリリース前
- **対象**: 削除候補APIの外部使用状況確認
- **目的**: 安全な削除タイミングの判断

### **年次大掃除**
- **頻度**: 年1回
- **対象**: 削除候補の実際の削除実施
- **目的**: APIエンドポイント数の整理・メンテナンス負荷軽減

---

## 🚨 削除前チェックリスト

### **事前調査**
- [ ] フロントエンド使用状況の再確認
- [ ] バックエンドテストでの使用状況確認
- [ ] 外部クライアント利用状況の確認（ログ解析）
- [ ] 代替APIの正常動作確認

### **関連文書更新**
- [ ] OpenAPI仕様からの削除
- [ ] README・ドキュメントの更新
- [ ] 変更履歴・マイグレーションガイドの作成

### **技術的削除**
- [ ] バックエンド実装の削除
- [ ] 関連テストの削除・移行
- [ ] 監視・ログ設定の調整

### **事後確認**
- [ ] 削除後の動作確認（E2Eテスト等）
- [ ] エラー監視での異常検知確認
- [ ] ドキュメント更新の完了確認

---

## 🏷️ メタデータ

**作成日**: 2025-08-12  
**最終更新**: 2025-08-12  
**管理責任**: Backend Architecture Team  
**レビュー周期**: 四半期毎  

**関連ドキュメント**:
- `docs/02-architecture/api-design.md`
- `docs/03-development/sprints/sprint_003/backend-rearchitecting/`
- `docs/03-development/sprints/sprint_003/backend-rearchitecting/unused-api-cleanup-candidates.md`
- `docs/03-development/sprints/sprint_003/backend-rearchitecting/api-migration-phase2-completion.md`
- `docs/redocly/openapi/api.yaml`

**注目すべき発見**:
- **第2弾移行**: 移行対象API自体が未使用という重要な発見
- **プロセス改善**: 事前調査の重要性が明確化
- **工数効率**: 未使用API移行による無駄作業の回避必要性

**タグ**: #api-cleanup #maintenance #technical-debt #architecture

---

## 💡 改善提案

### **🚨 緊急改善（調査ミス再発防止）**

#### **必須検索パターン確立**
```bash
# 1. 直接文字列検索
grep -r "/api/{エンドポイント}/" apps/frontend/

# 2. HonoClient形式検索（重要）
grep -r "\.{エンドポイント}\[" apps/frontend/
grep -r "apiClient.*{エンドポイント}" apps/frontend/

# 3. 型定義・import検索
grep -r "from.*{エンドポイント}" apps/frontend/
grep -r "import.*{エンドポイント}" apps/frontend/

# 4. 動的・テンプレート検索
grep -r "\`.*{エンドポイント}.*\`" apps/frontend/
grep -r "\${.*{エンドポイント}" apps/frontend/
```

#### **調査チェックリスト必須化**
- [ ] 複数検索パターンでの確認
- [ ] HonoClient・APIクライアント形式の確認
- [ ] 型定義・import文の確認
- [ ] テストファイルでの使用確認
- [ ] 設定ファイル・環境変数での使用確認

#### **検証プロセス強化**
1. **削除前テスト**: フロントエンドビルド・E2E テストの事前実行
2. **段階的削除**: 仕様削除→テスト実行→実装削除の順序
3. **ロールバック準備**: 削除前の完全バックアップ・復旧手順確立

### **自動化検討事項**
1. **未使用API検出**: フロントエンドビルド時の未使用APIエンドポイント自動検出
2. **使用状況監視**: 本番環境でのAPIアクセスログ自動解析
3. **削除影響分析**: 削除前の影響範囲自動分析ツール
4. **🆕 HonoClient解析**: APIクライアント利用状況の自動解析ツール

### **プロセス改善**
1. **新API設計時**: 将来の削除容易性を考慮した設計ガイドライン策定
2. **定期レビュー**: Sprint計画時のAPI削除候補レビュー組み込み
3. **外部連携**: 外部クライアント向けの廃止予告・移行ガイダンス標準化
4. **🆕 調査手法**: HonoClient・APIクライアント特有の検索パターン標準化
5. **🆕 検証強化**: 削除前の必須テスト実行プロセス確立

### **教訓・知見**
1. **APIクライアント理解**: フレームワーク固有のAPI呼び出し形式の重要性
2. **検索パターン重要性**: 単一パターン検索の危険性
3. **削除影響深刻性**: 使用中API削除による機能完全停止リスク
4. **即座検証必要性**: 削除後の迅速な動作確認の重要性
5. **🆕 復旧方針選択**: 旧API復旧 vs フロントエンド置き換えの判断基準
   - **前方修正**: フロントエンド側で新APIに置き換え（推奨）
   - **後方復旧**: 旧API復旧（一時的対応）
   - **効率性**: 前方修正により移行目標も同時達成