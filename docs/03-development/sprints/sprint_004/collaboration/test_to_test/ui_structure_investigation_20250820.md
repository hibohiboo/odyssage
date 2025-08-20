# Phase 2実装 UI構造調査結果

**作成日**: 2025-08-20  
**作成者**: テスト担当（Claude Code）  
**目的**: Phase 2実装の実際のUI構造把握・BDDテスト修正のための基礎調査

---

## 📋 調査対象・範囲

**調査対象**: Phase 2完了実装（Player文脈）
- PlaySessionPage.tsx
- PlaySessionContainer.tsx  
- PlaySessionViewコンポーネント群

**調査目的**: BDDテスト失敗原因（実装とテストの不整合）の特定・修正方針策定

---

## 🔍 ルーティング構造調査結果

**ファイル**: `apps/frontend/src/app/routes/index.tsx`

### Player文脈のルーティング
```typescript
{
  path: 'player',
  children: [
    {
      path: 'sessions',                    // /player/sessions
      element: <SessionListPage />,
      loader: sessionListLoader,
    },
    {
      path: 'session/:sessionId/play',     // /player/session/:sessionId/play
      element: <PlaySessionPage />,
    },
    {
      path: 'session/:sessionId/play/:sceneId', // /player/session/:sessionId/play/:sceneId
      element: <PlaySessionPage />,
    },
  ],
},
```

**確認事項:**
- ✅ BDDテストで期待したルーティング構造と一致
- ✅ `/player/session/test-session-001/play` は実装済み
- ✅ シーン指定ルーティング `/player/session/:sessionId/play/:sceneId` も対応

---

## 🖼️ UIコンポーネント構造調査結果

### PlaySessionViewの実装階層
```
PlaySessionView (メインコンポーネント)
├── LoadingView (loading状態)
├── ErrorView (error状態)  
├── NoDataView (データなし状態)
└── MainContent (メインコンテンツ)
    ├── PlayHeader (ヘッダー)
    │   ├── EventButton "終了"
    │   ├── sessionInfo.title表示
    │   ├── AutoSaveIndicator
    │   └── EventButton "⋯" (メニュー)
    ├── SceneDisplay (シーン表示)
    │   ├── 背景画像 (scene.backgroundImage)
    │   └── シーンタイトル (scene.title)
    └── EventDisplay (イベント表示)
        └── Event種別に応じたコンテンツ
```

### 重要なUI実装詳細

**PlayHeader実装:**
```typescript
// sessionInfo.titleを表示（実際の表示テキスト）
<h1 className="font-medium text-sm truncate max-w-[200px]">
  {sessionInfo.title}
</h1>
```

**SceneDisplay実装:**
```typescript
// シーンタイトル表示（実際の表示テキスト）
<h2 className="text-white text-lg font-semibold shadow-lg">
  {scene.title}
</h2>
```

---

## 🚨 **重大な発見：BDDテスト失敗の根本原因**

### 1. **data-testid属性が設定されていない**
```typescript
// BDDテストが期待:
await expect(this.page.locator('[data-testid="scene-background"]')).toBeVisible();

// 実際の実装:
<div className="aspect-video relative overflow-hidden">
  // data-testid属性なし
```

**影響**: 全てのdata-testid依存セレクタが要素を見つけられない

### 2. **表示テキストの不整合**
```typescript
// BDDテストが期待:
Locator: getByText('薬草採取の旅 - 初心者歓迎')

// 実際の実装:
{sessionInfo.title} // 実際の値は不明・LocalStorageデータ依存
```

**影響**: テキスト検索による要素特定が失敗

### 3. **選択肢ボタンの実装構造未確認**
```typescript
// BDDテストが期待:
this.page.locator('button[data-testid*="choice"]')

// 実際の実装:
ChoiceEventContent // 実装詳細未調査
```

**影響**: 選択肢操作テストが全て失敗

---

## 📊 調査結果サマリー

### ✅ 一致している実装要素
- ルーティング構造（/player/session/:sessionId/play）
- コンポーネント階層（PlaySessionView → MainContent構造）
- 基本的なUI レイアウト設計

### ❌ 不整合・未実装要素  
- **data-testid属性**: 全コンポーネントで未設定
- **表示テキスト**: sessionInfo・sceneデータの実際値不明
- **選択肢実装**: ChoiceEventContentの詳細構造未調査
- **LocalStorageデータ形式**: 期待データ形式との整合性不明

---

## 🎯 次期調査アクション（段階的実施）

### 【次の1つのタスクのみ】
- [ ] **ChoiceEventContent実装の詳細調査**
  - 選択肢ボタンの実際のHTML構造確認
  - CSS class・セレクタ・クリック可能要素の特定
  - BDDテストの期待セレクタとの整合性確認

### 【その後の段階的タスク】
1. LocalStorageデータ形式・sessionInfo/sceneデータ構造確認
2. data-testid属性追加の必要性検討・実装方針策定
3. BDDテストstep definitions修正方針の具体化

---

## 💡 **学習・改善指針**

### **段階的調査アプローチの重要性**
- ❌ **今回の反省**: 複数コンポーネントを一気に調査・複雑な問題を同時把握
- ✅ **改善方針**: 1コンポーネントずつ詳細調査・問題を段階的に整理

### **BDDテスト修正戦略**
1. **実装に合わせる**: data-testid依存からCSS class・テキストベース検索に修正
2. **段階的修正**: 1シナリオずつ実装確認・step definitions修正・Green化
3. **実装改善提案**: 必要に応じてdata-testid追加の提案実施

---

**この調査を基に、1つずつ段階的にBDDテスト修正を進めます。**

---

**作成者**: テスト担当（Claude Code）  
**調査ファイル**: routes/index.tsx, PlaySessionView関連コンポーネント  
**次期アクション**: ChoiceEventContent実装の詳細調査（1つのタスクのみ）

#ui-structure-investigation #phase2-implementation #bdd-test-debugging #step-by-step-approach