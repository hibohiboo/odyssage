# Sprint 5 セッション参加機能実装計画・修正予定ファイル一覧

**作成日**: 2025-08-23  
**作成者**: Sprint 5 実装担当（Claude Code）  
**対象**: セッション参加BDD機能 (session-joining.feature)  
**目的**: 段階的実装・テスト連携・品質保証計画

---

## 🎯 **実装対象・目標**

### **BDD対応範囲**
- **対象BDD**: `packages/bdd-e2e-test/e2e/features/player/session-joining.feature`
- **目標シナリオ**: セッション参加の基本フロー（1シナリオ）
- **最終目標**: 全ステップGreen状態・404エラー完全解消

### **テスト実行結果対応**
- **現在のブロッカー**: 404 Not Found at `/player/sessions/test-session-join`
- **テスト担当からの実装依頼**: docs/03-development/sprints/sprint_005/reviews/sprint_005_test_feedback_20250823.md

---

## 📋 **段階的実装計画・修正予定ファイル**

### **Phase 1: セッション詳細画面の基本実装** ✅ **完了**

#### **完了済みファイル**

**1. 新規作成ファイル**
```
D:\projects\odyssage\apps\frontend\src\page\player\ui\SessionDetailPage.tsx
```
- **実装内容**: Player文脈セッション詳細表示
- **BDD対応**: セッション基本情報表示・参加ボタン配置
- **data-testid設定**: session-title, session-description, join-session-button
- **完了判定**: URLアクセス時の404エラー解消

**2. 既存修正ファイル**
```
D:\projects\odyssage\apps\frontend\src\app\routes\index.tsx
```
- **修正箇所**: L9 (インポート追加), L157-161 (ルーティング追加)
- **追加内容**: 
  ```typescript
  // L9: インポート追加
  import { SessionDetailPage } from '@odyssage/frontend/page/player/ui/SessionDetailPage';
  
  // L157-161: ルーティング追加
  {
    path: 'sessions/:sessionId',
    element: <SessionDetailPage />,
    loader: sessionDetailLoader,
  },
  ```
- **目的**: `/player/sessions/:sessionId` ルーティング有効化

#### **Phase 1 完了判定基準**
- ✅ URLアクセスで404エラーが発生しない
- ✅ セッション基本情報が適切に表示される
- ✅ 参加ボタンが表示され、data-testid設定済み
- ⏳ **テスト担当によるBDD実行・確認待ち**

#### **🚨 Phase 1 テスト依頼タイミング**
**今すぐ実行**: セッション詳細画面の基本表示確認
```bash
# テスト担当による確認依頼
bun run bdd-test
# 期待結果: 404エラー解消・基本画面表示ステップ通過
```

---

### **Phase 2: 参加ボタン機能実装** ⏳ **Phase 1完了後開始**

#### **修正予定ファイル**

**1. 機能拡張ファイル**
```
D:\projects\odyssage\apps\frontend\src\page\player\ui\SessionDetailPage.tsx
```
- **修正箇所**: L31 handleJoinSession関数
- **現在の実装**:
  ```typescript
  const handleJoinSession = () => {
    // TODO: Phase 2で参加確認ダイアログを実装
    console.log('Join session clicked:', params.sessionId);
  };
  ```
- **Phase 2実装予定**:
  ```typescript
  const handleJoinSession = () => {
    setShowConfirmationDialog(true);
  };
  ```

**2. 新規作成ファイル**
```
D:\projects\odyssage\apps\frontend\src\page\player\ui/components/JoinConfirmationDialog.tsx
```
- **実装内容**: 参加確認ダイアログコンポーネント
- **必須要素**: 
  - モーダル形式表示（背景オーバーレイ）
  - 参加確認メッセージ
  - data-testid="confirmation-dialog" 設定
  - 確認・キャンセルボタン（Phase 3で実装）

#### **Phase 2 完了判定基準**
- 参加ボタンクリック時にダイアログが表示される
- ダイアログが適切にモーダル表示される
- BDDテストの参加確認ダイアログ表示ステップが通過

#### **🚨 Phase 2 テスト依頼タイミング**
**ダイアログ表示実装完了後**:
```bash
# テスト担当による確認依頼
bun run bdd-test
# 期待結果: 参加ボタンクリック→ダイアログ表示ステップ通過
```

---

### **Phase 3: 確認ダイアログボタン実装** ⏳ **Phase 2完了後開始**

#### **修正予定ファイル**

**1. ダイアログ機能拡張**
```
D:\projects\odyssage\apps\frontend\src\page\player\ui/components/JoinConfirmationDialog.tsx
```
- **追加実装**: 確認・キャンセルボタン機能
- **必須要素**:
  ```typescript
  // 確認ボタン（複数パターン対応）
  <button data-testid="confirm-join-button">参加する</button>
  
  // キャンセルボタン（複数パターン対応）
  <button data-testid="cancel-join-button">キャンセル</button>
  ```

**2. ボタン処理実装**
- **確認ボタン**: 参加処理実行（将来のAPI連携準備）
- **キャンセルボタン**: ダイアログ閉じる処理

#### **Phase 3 完了判定基準**
- 確認・キャンセルボタンが表示され、クリック可能
- 両方のボタンが期待通りの処理を実行
- **session-joining.feature 全シナリオGreen状態達成**

#### **🚨 Phase 3 テスト依頼タイミング**
**全ボタン実装完了後**:
```bash
# テスト担当による最終確認依頼
bun run bdd-test
# 期待結果: 全BDDステップ通過・Green状態達成
```

---

## 🤝 **テスト担当との協働プロセス**

### **テスト依頼・レビューのタイミング**

| Phase | 実装完了時点 | テスト依頼内容 | 期待結果 |
|-------|-------------|----------------|----------|
| **Phase 1** | 基本画面実装後 | 404エラー解消確認 | 基本画面表示ステップ通過 |
| **Phase 2** | ダイアログ表示実装後 | 参加ボタン機能確認 | ダイアログ表示ステップ通過 |
| **Phase 3** | ボタン機能実装後 | 全機能統合確認 | 全BDDシナリオGreen |

### **各Phase完了時の協働手順**
```markdown
1. 実装担当: Phase実装完了・コード品質確認（lint/TypeScript）
2. 実装担当: テスト担当へレビュー依頼・実装完了報告
3. テスト担当: BDDテスト実行・結果報告
4. Red時: 具体的問題点報告→実装担当が修正対応
5. Green時: 次Phaseへ進行許可→実装担当が次Phase開始
```

### **効果的協働のための約束事項**

#### **実装担当の責務**
- Phase完了時の即座テスト依頼
- data-testid属性の確実な設定
- TypeScript100%・lint100%品質維持
- BDD期待値に基づく実装

#### **テスト担当への依頼事項**
- 段階的テストフィードバック提供
- 具体的問題点・修正指示の明確化
- Green時の次Phase進行許可

---

## 🚨 **実装担当の責務範囲・制約事項**

### **✅ 実装担当責務範囲**
- フロントエンドUI実装（React/TypeScript）
- コンポーネント設計・状態管理
- data-testid属性設定・BDD連携準備
- コード品質保証（lint/TypeScript）

### **❌ 他担当領分（介入禁止）**

#### **テスト担当領分**
```
D:\projects\odyssage\apps\backend\test\integrations\helpers\TestFixtures.ts
```
- **理由**: テストデータ "test-session-join" の準備
- **実装担当方針**: テスト担当の対応完了を待機

#### **バックエンド担当領分**
- データベース設定・API実装
- テスト環境準備・サーバー設定
- テストセッションデータ管理

---

## 📊 **品質保証・完了基準**

### **各Phase品質基準**
```markdown
✅ 必須チェック項目（全Phase共通）:
- TypeScriptエラー0・lint100%クリーン
- data-testid属性の適切な設定
- BDD期待値との完全一致
- Player体験価値の最大化

✅ 最終完了基準（Phase 3完了時）:
- session-joining.feature 全ステップGreen
- 404エラー完全解消
- Player参加フローの使いやすさ確保
- 次シナリオ実装への基盤確立
```

### **継続的品質監視**
```bash
# 各Phase実装完了時に必須実行
cd apps/frontend && bun run lint
# 結果: エラー0件・警告0件確認
```

---

## 🎯 **現在の状況・次のアクション**

### **現在の進捗状況**
- ✅ **Phase 1**: 基本画面実装完了（2/2ファイル）
- ⏳ **テスト依頼**: Phase 1 BDD確認・404エラー解消確認待ち
- ⏳ **Phase 2**: Phase 1完了確認後開始予定

### **immediate Next Actions**
1. **テスト担当**: Phase 1 BDD実行・結果報告
2. **Phase 1 Green確認後**: Phase 2参加ダイアログ実装開始
3. **段階的進行**: 各Phase完了→テスト確認→次Phase方式継続

### **期待される最終成果**
- **Player文脈MVP**: セッション参加機能完成
- **BDD品質保証**: session-joining.feature 100%Green
- **技術基盤**: 次シナリオ実装への確実な基盤提供

---

## 💯 **成功の定義**

### **短期目標（Phase 1完了）**
セッション詳細画面404エラー解消・基本表示機能実現

### **中期目標（Phase 2完了）**
参加ボタン・確認ダイアログ表示機能実現

### **最終目標（Phase 3完了）**
**session-joining.feature全シナリオGreen状態・Player参加体験完成**

---

**最重要メッセージ**

Sprint 5成功は段階的実装・段階的テスト・段階的品質保証の徹底により実現されます。各Phase完了時のテスト担当との協働を重視し、確実にPlayer価値を積み重ねていきます。

---

**作成者**: Sprint 5 実装担当（Claude Code）  
**作成日**: 2025-08-23  
**更新予定**: 各Phase完了時・テスト結果受領時  
**継承価値**: 段階的実装・テスト協働・Player価値・BDD品質保証

#sprint5 #implementation-plan #session-joining #bdd #gradual-implementation #test-collaboration