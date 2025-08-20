# data-testid属性追加実装依頼書

**作成日**: 2025-08-20  
**作成者**: テスト担当（Claude Code）  
**対象**: 実装担当  
**目的**: BDDテスト実行のためのdata-testid属性追加・実装指示

---

## 🚨 **問題状況**

**BDDテスト失敗の根本原因**: data-testid属性が未設定
- 12シナリオ中7つが失敗・要素が見つからずタイムアウト
- テスト用セレクタ `[data-testid="..."]` に対応する要素が存在しない
- Player文脈UIコンポーネント全般でdata-testid属性が未実装

**影響範囲**: Phase 2実装品質確認・自動テスト・CI/CD統合すべてが困難

---

## 🎯 **実装依頼内容**

### **追加が必要なdata-testid属性一覧**

#### **PlaySessionView関連（最優先）**

##### **メインレイアウト**
```typescript
// PlayHeader コンポーネント
<header data-testid="play-header">
  <button data-testid="exit-session-button">終了</button>
  <h1 data-testid="session-title">{sessionInfo.title}</h1>
  <button data-testid="menu-button">⋯</button>
</header>
```

##### **シーン表示**
```typescript  
// SceneDisplay コンポーネント
<div data-testid="scene-display">
  <div data-testid="scene-background">
    <img data-testid="scene-image" src={scene.backgroundImage} />
  </div>
  <h2 data-testid="scene-title">{scene.title}</h2>
</div>
```

##### **シーン説明・ナラティブ**
```typescript
// EventDisplay関連
<div data-testid="scene-description">
  {/* シーンの説明文 */}
</div>

<div data-testid="narrative-content">
  {/* ナラティブイベントの内容 */}  
</div>
```

#### **選択肢・インタラクション要素（重要）**

##### **選択肢ボタン**
```typescript
// ChoiceEventContent コンポーネント
<div data-testid="choice-container">
  {choices.map((choice, index) => (
    <button 
      key={choice.id}
      data-testid={`choice-${index + 1}`}  // choice-1, choice-2, choice-3
      data-choice-id={choice.id}           // 追加: choice-id属性
    >
      {choice.text}
    </button>
  ))}
</div>

<div data-testid="choice-instruction">選択してください</div>
```

##### **進行ボタン**
```typescript
// 各種進行ボタン
<button data-testid="continue-button">次へ</button>
<button data-testid="resume-button">続きから再開</button>
<button data-testid="retry-button">再試行</button>
```

#### **状態表示・フィードバック要素**

##### **ローディング・エラー状態**
```typescript
// LoadingView
<div data-testid="loading">
  <div data-testid="loading-spinner"></div>
  <p data-testid="loading-message">セッションを読み込み中...</p>
</div>

// ErrorView  
<div data-testid="error-container">
  <h2 data-testid="error-title">エラーが発生しました</h2>
  <p data-testid="error-message">{errorMessage}</p>
  <button data-testid="reload-button">再試行</button>
</div>
```

##### **自動保存・状態表示**
```typescript
// AutoSaveIndicator
<div data-testid="autosave-status" data-status={autoSaveStatus}>
  {/* 自動保存状態表示 */}
</div>
```

---

## 📁 **対象ファイル・実装箇所**

### **優先度1: 即座実装が必要**
```
packages/ui/src/player/organisms/PlaySessionView/
├── PlaySessionView.tsx                     # メインコンポーネント
├── components/PlayHeader.tsx               # ヘッダー・セッションタイトル
├── components/SceneDisplay.tsx             # シーン表示・背景・タイトル
├── components/EventDisplay.tsx             # イベント表示統合
└── components/StateViews/
    ├── MainContent.tsx                     # メインコンテンツ
    ├── LoadingView.tsx                     # ローディング状態
    └── ErrorView.tsx                       # エラー状態
```

### **優先度2: 選択肢・インタラクション**
```
packages/ui/src/player/organisms/PlaySessionView/components/EventContent/
├── ChoiceEventContent.tsx                  # 選択肢表示・ボタン
├── NarrativeEventContent.tsx               # ナラティブ表示
└── common/
    ├── ContinueButton.tsx                  # 継続ボタン
    └── EventContentBase.tsx                # 共通基盤
```

---

## 🛠️ **実装ガイドライン**

### **命名規則**
- **ケバブケース**: `scene-title`, `choice-container`, `continue-button`
- **階層構造**: `choice-1`, `choice-2`, `choice-3` (番号付け)
- **状態反映**: `data-status`, `data-choice-id` 等の追加属性活用

### **実装パターン**
```typescript
// 基本パターン
<element data-testid="要素名">

// 動的ID（選択肢等）
<element data-testid={`prefix-${index + 1}`}>

// 状態付き
<element data-testid="要素名" data-status={status}>

// 複合情報
<element 
  data-testid="choice-button"
  data-choice-id={choice.id}
  data-choice-index={index + 1}
>
```

### **TypeScript型定義**
```typescript
interface TestableProps {
  'data-testid'?: string;
  'data-choice-id'?: string;
  'data-status'?: string;
}
```

---

## 🔍 **実装後の確認方法**

### **ブラウザ開発者ツールでの確認**
```html
<!-- 期待される実装結果 -->
<h2 data-testid="scene-title">第1章：母の病気</h2>
<button data-testid="choice-1" data-choice-id="choice-aggressive">
  すぐに山奥へ向かう（積極的）
</button>
```

### **BDDテスト実行での確認**
```typescript
// テストが成功することを確認
await expect(this.page.locator('[data-testid="scene-title"]')).toBeVisible();
await this.page.locator('[data-testid="choice-1"]').click();
```

---

## 📊 **実装優先度・工数見積**

### **Phase 1: 基本要素（工数: 30-45分）**
- PlayHeader, SceneDisplay, 基本ボタン
- ローディング・エラー状態表示

### **Phase 2: 選択肢・インタラクション（工数: 30-45分）** 
- ChoiceEventContent, 各種ボタン
- イベント表示・ナラティブコンテンツ

### **Phase 3: 詳細状態・追加属性（工数: 15-30分）**
- 自動保存状態・複合属性
- セッション管理・ナビゲーション要素

---

## ✅ **実装完了後の期待効果**

### **BDDテスト品質向上**
- 12シナリオの段階的Green化実現
- Red→Green→Refactorサイクルの確立
- 自動テスト・CI/CD統合の安定化

### **開発効率向上**
- デバッグ効率・要素特定の高速化
- E2Eテスト・品質保証プロセスの自動化
- リグレッション防止・継続的品質改善

### **チーム協働強化**
- テスト担当との連携効率化
- 品質フィードバック・改善提案の具体化
- MVP品質基準の達成・維持

---

**この実装により、Phase 2完了実装の品質確認・BDDテスト成功・継続的品質向上が実現します。実装のご対応をお願いいたします。**

---

**作成者**: テスト担当（Claude Code）  
**実装依頼先**: 実装担当  
**優先度**: 高（BDDテスト成功のための必須要件）  
**期待工数**: 1-2時間（段階的実装推奨）

#data-testid-implementation #bdd-test-support #ui-testing #quality-assurance