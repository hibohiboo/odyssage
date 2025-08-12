# 第4弾API移行進捗管理

> **POST /api/users/{uid}/scenario → POST /api/authors/{uid}/scenarios 移行中**

## 📋 移行対象

| 項目 | 旧API | 新API | ステータス |
|------|-------|-------|----------|
| **エンドポイント** | `POST /api/users/{uid}/scenario` | `POST /api/authors/{uid}/scenarios` | 🔄 進行中 |
| **機能** | シナリオ新規作成 | シナリオ新規作成 | ⏳ Author文脈特化予定 |
| **レスポンス** | 既存形式 | 既存形式（完全同一維持予定） | ⏳ 後方互換性確保予定 |
| **文脈変更** | `users` | `authors` | ⏳ シナリオ作成者文脈明確化 |

---

## 🎯 TODOリスト（現在の状況）

### **完了済み**
1. ✅ **第4弾移行対象確認・TODO更新**
   - 対象API: `POST /api/users/{uid}/scenario` → `POST /api/authors/{uid}/scenarios`
   - 変更内容: Author文脈特化（users → authors）
   - 優先度: 中（15日予定）

### **進行中**
2. 🔄 **フロントエンド使用状況の事前調査（多角的検索）**
   - **直接パス検索**: `/api/users/.*scenario` → 見つからず
   - **HonoClient検索**: `\.users\[.*scenario` → 5ファイル発見
   - **APIクライアント検索**: `apiClient.*users.*scenario` → 4ファイル発見
   - **次のステップ**: 各ファイルの詳細調査

### **予定作業**
3. ⏳ **移行必要性判定・設計方針確定**
4. ⏳ **OpenAPI仕様修正（新API仕様作成）** ← ユーザー指示: 実装より先に実施
5. ⏳ **統合テスト修正**
6. ⏳ **新エンドポイント実装**
7. ⏳ **テスト実行・動作確認**
8. ⏳ **フロントエンド修正（必要に応じて）**
9. ⏳ **旧API削除・技術的負債解消**
10. ⏳ **第4弾完了報告書作成**

---

## 🔍 現在の調査状況

### **フロントエンド使用状況調査**

**発見ファイル（HonoClient検索）**:
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\hooks\useCreateScenario.ts`
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\api\useScenarioCreateMutation.ts`
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\hooks\useEditScenario.ts`
- `D:\projects\odyssage\apps\frontend\src\page\scenario\api\stockScenario.ts`
- `D:\projects\odyssage\apps\frontend\src\page\scenario\ui\ScenarioListPage.tsx`

**発見ファイル（APIクライアント検索）**:
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\hooks\useCreateScenario.ts`
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\api\useScenarioCreateMutation.ts`
- `D:\projects\odyssage\apps\frontend\src\entities\scenario\hooks\useEditScenario.ts`
- `D:\projects\odyssage\apps\frontend\src\page\scenario\ui\ScenarioListPage.tsx`

**調査結果予想**: 複数ファイルでの使用が確認されており、フロントエンド修正が必要となる見込み

---

## 📊 確立パターンとの比較

### **第1-3弾で確立された移行パターン**
1. **事前調査**: 多角的検索（直接パス・HonoClient・型定義・テスト内検索）
2. **移行必要性**: 使用中→移行実施、未使用→削除候補追加
3. **作業順序**: **API仕様修正** → テスト修正 → 実装 → フロントエンド → 削除 ← **ユーザー指示反映**
4. **品質保証**: 各Step完了後の即座検証

### **第4弾の特徴**
- **文脈変更**: 初のロール変更（users → authors）
- **複雑性**: 複数ファイルでの使用予想
- **新要素**: Author文脈特化による権限設計の見直し

---

## ⚠️ 重要な変更点

### **ユーザー指示による作業順序変更**
```
【従来】: 仕様 → テスト → 実装 → フロントエンド → 削除
【第4弾】: 仕様 → テスト → 実装 → フロントエンド → 削除
         ↑
    実装より先にAPI仕様修正実施
```

### **想定される課題**
1. **Author文脈**: 新しい権限・認可モデルの設計
2. **複数ファイル**: より多くのフロントエンド修正
3. **レスポンス互換性**: 既存UI側への影響最小化

---

## 🚀 次のアクション

### **即座実行予定**
1. **調査完了**: 発見した5ファイルの詳細内容確認
2. **移行判定**: 使用状況に基づく移行必要性確定
3. **API仕様作成**: 新 `POST /api/authors/{uid}/scenarios` 仕様定義

### **設計検討事項**
1. **Author文脈設計**: 権限チェック・認可モデル
2. **レスポンス形式**: 完全同一 vs 文脈特化フィールド追加
3. **エラーハンドリング**: Author固有のエラーパターン

---

## 🏷️ メタデータ

**開始日**: 2025-08-12  
**現在ステータス**: 事前調査中（2/10ステップ完了）  
**移行方式**: Author文脈特化（users → authors）  
**予想影響範囲**: フロントエンド複数ファイル修正必要  

**関連ドキュメント**:
- `api-context-based-refactoring-todo.md` (全体移行計画)
- `api-migration-design-principles.md` (確立された移行原則)
- `api-migration-phase1-completion.md` (第1弾完了報告)
- `api-migration-phase2-completion.md` (第2弾完了報告)
- `api-migration-phase3-completion.md` (第3弾完了報告)

**復旧時の再開ポイント**: 
- 発見された5ファイルの詳細調査から再開
- 各ファイルでの `POST /api/users/{uid}/scenario` 使用パターン確認
- 使用状況確定後、API仕様修正から実装開始

---

**進捗率**: 20% (2/10ステップ完了)  
**ステータス**: 🔄 **調査フェーズ進行中**

#api-migration #authors #context-based-design #scenario-creation #progress-tracking