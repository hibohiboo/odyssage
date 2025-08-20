# data-testid属性追加実装依頼書

**作成日**: 2025-08-20  
**作成者**: テスト担当（Claude Code）  
**対象**: 実装担当  
**目的**: BDDテスト実行のためのdata-testid属性追加・実装指示

---

## 🚨 **問題状況**

**BDDテスト失敗の根本原因**: data-testid属性が未設定
- BDDテスト実行中に要素が見つからずタイムアウト
- テスト用セレクタ `[data-testid="..."]` に対応する要素が存在しない
- Player文脈UIコンポーネント全般でdata-testid属性が未実装

**影響範囲**: Phase 2実装品質確認・自動テスト・CI/CD統合すべてが困難

## ⚠️ **必須: 段階的実装の厳格遵守**

```markdown
🚨 絶対禁止事項:
❌ 全ファイルを同時に修正・一括実装
❌ Phase 1-3を一度にまとめて実装
❌ 「とりあえず全部追加」の発想・行動
❌ 時間短縮を狙った一括処理・バッチ実装

✅ 必須実行原則:
✓ 必ず1つのPhaseのみ実装・動作確認
✓ 成功確認後のみ次のPhase検討・実装
✓ 失敗時は即座停止・個別問題解決
✓ 1ファイルずつ修正・保存・確認の徹底
```

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

## 🔍 **段階的実装の確認方法・失敗時対応**

### **⚠️ 実装時の安全手順（各Phase共通）**

#### **実装前の必須準備**
```markdown
🔍 開始前必須確認:
1. 開発環境確認: TypeScript・lint・bun install状態確認
2. エディタ・IDE確認: 構文ハイライト・エラー表示の動作確認
3. 基本ツール準備: ファイルシステム・git・コードエディタ動作確認
4. 人間協働準備: UI確認が必要な場合の依頼方法確認

🚨 重要: この確認で問題があれば即座停止・環境修正
⚠️ 注意: Claude CodeはSPA・ブラウザ確認不可・人間協働必須
```

#### **1ファイル実装後の必須確認**
```markdown
✅ 各ファイル修正後の確認手順:
1. ファイル保存・TypeScript構文エラー確認
2. bun run lint実行・エラー0確認（warning許容）
3. import・export・型定義の整合性確認
4. 人間協働: data-testid属性・ブラウザ表示確認（必要時）
5. **問題なし確認後のみ**次ファイル検討

🚨 重要: Claude CodeはUI・ブラウザ確認不可
- data-testid属性の実際の存在確認は人間に依頼
- ブラウザ表示・動作確認は人間との協働が必須
```

### **ブラウザ開発者ツールでの確認**
```html
<!-- 期待される実装結果 -->
<h2 data-testid="scene-title">第1章：母の病気</h2>
<button data-testid="choice-1" data-choice-id="choice-aggressive">
  すぐに山奥へ向かう（積極的）
</button>
```

### **🚨 失敗時の即座対応手順**

#### **実装エラー・問題発生時**
```markdown
🚨 失敗発生時の即座対応:
1. 実装停止・追加修正の禁止
2. エラーログ・問題詳細の記録・分析
3. 1つの問題のみに集中・解決
4. 修正確認後、同一ファイルのみ再確認
5. 成功確認後のみ次ファイル検討

⚠️ 重要な注意事項:
- 複数の問題を同時に解決しようとしない
- 他のファイルに影響する修正は慎重に検討
- 不明な点は即座にテスト担当に相談
- 成功体験の積み重ねを重視
```

#### **エスカレーション基準**
```markdown
⚠️ 即座にテスト担当に相談が必要な状況:
- TypeScriptエラーが解決できない（15分以上）
- ブラウザでdata-testid属性が表示されない
- 実装後にページ表示が壊れる
- どのファイルを修正すべきか不明
```

---

## 📊 **段階的実装計画・必須手順**

### **⚠️ 重要: 各Phase完了後の必須確認サイクル**

```markdown
🔄 必須実装サイクル（Phase毎に厳格実行）:
1. 実装前: 環境確認・現在状態の把握
2. 実装中: 1ファイルのみ修正・即座保存・TypeScript確認
3. 実装後: ブラウザ確認・data-testid存在確認・基本動作確認
4. 成功時: 結果記録・次Phase検討
5. 失敗時: 実装停止・問題分析・テスト担当相談

🚨 重要: Phase間の移行は前Phaseの完全成功後のみ
```

### **Phase 1: 基本要素（最優先・単独実装）**
**実装対象**: PlayHeader, SceneDisplay, 基本ボタンのみ
**工数見積**: 30-45分（1ファイルずつ段階的実装）

#### **Phase 1実装後の必須確認手順**:
```markdown
1. ブラウザ起動: http://localhost:5173
2. 開発者ツール確認: data-testid属性の存在確認
3. 基本表示確認: PlayHeader・SceneDisplay要素の表示
4. TypeScriptエラー確認: ビルドエラーが無いことを確認
5. **成功確認後のみ**Phase 2検討開始
```

### **Phase 2: 選択肢・インタラクション（Phase 1成功後のみ）**
**実装対象**: ChoiceEventContent, 各種ボタンのみ
**工数見積**: 30-45分（Phase 1の成功確認後のみ開始）

#### **Phase 2実装後の必須確認手順**:
```markdown
1. 選択肢ボタン表示確認: choice-1, choice-2等の表示
2. インタラクション確認: ボタンクリック・選択動作
3. data-testid確認: 選択肢要素のセレクタ動作
4. **成功確認後のみ**Phase 3検討開始
```

### **Phase 3: 詳細状態・追加属性（Phase 2成功後のみ）**
**実装対象**: 自動保存状態・複合属性のみ
**工数見積**: 15-30分（Phase 2の成功確認後のみ開始）

---

## ✅ **実装完了後の期待効果**

### **BDDテスト品質向上**
- BDDテストの段階的成功実現（1つずつ確実に）
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

## 🚨 **重要な実装方針確認**

```markdown
⚠️ この実装は段階的実行の実証案件です:
- Phase 1のみ実装→確認→成功後のみPhase 2検討
- 失敗時は即座停止・テスト担当相談
- 急がない・焦らない・確実性最優先
- 小さな成功の積み重ねを重視

✅ 成功の定義:
- 全Phase完了ではなく、Phase 1の確実な成功
- 段階的実装プロセスの実証・確立
- 安定した品質確保・継続可能な開発フロー
```

**この段階的実装により、確実なPhase 2完了実装の品質確認・BDDテスト成功・継続的品質向上が実現します。段階的実装の厳格遵守をお願いいたします。**

---

**作成者**: テスト担当（Claude Code）  
**実装依頼先**: 実装担当  
**優先度**: 高（段階的実装プロセス実証・BDDテスト成功）  
**期待工数**: Phase 1のみ30-45分（成功確認後に次Phase検討）

#data-testid-implementation #bdd-test-support #ui-testing #quality-assurance