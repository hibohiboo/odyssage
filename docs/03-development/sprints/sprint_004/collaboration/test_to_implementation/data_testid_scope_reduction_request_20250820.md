# data-testid属性実装範囲縮小依頼書

**作成日**: 2025-08-20  
**作成者**: テスト担当（Claude Code）  
**対象**: 実装担当  
**目的**: 段階的BDDテスト実装に合わせたdata-testid属性の最適化

---

## 🎯 **依頼概要**

段階的BDDテスト実装方針に基づき、**現在不要なdata-testid属性の削除**をお願いします。

**現状**: 包括的実装（全シナリオ対応）  
**要求**: 最小限実装（第1シナリオのみ対応）  
**理由**: コード簡潔性・保守性向上・段階的開発方針の徹底

---

## 📋 **保持すべきdata-testid（Priority 1）**

### **第1シナリオ「プレイ画面の初期表示」に必要**

```typescript
// ✅ 保持必須 - 削除禁止
[data-testid="session-title"]         // セッションタイトル
[data-testid="scene-title"]           // シーンタイトル  
[data-testid="scene-background"]      // 背景画像コンテナ
[data-testid="continue-button"]       // 次へボタン
```

### **対象ファイル・実装箇所**
```
packages/ui/src/player/organisms/PlaySessionView/components/
├── PlayHeader.tsx                    → session-title のみ保持
├── SceneDisplay.tsx                  → scene-title, scene-background のみ保持  
└── EventContent/common/ContinueButton.tsx → continue-button のみ保持
```

---

## ❌ **削除対象data-testid一覧**

### **Phase 1削除対象**
```typescript
// ❌ 削除要求 - 第1シナリオで未使用
[data-testid="play-header"]           // ヘッダー全体
[data-testid="exit-session-button"]   // 終了ボタン
[data-testid="menu-button"]           // メニューボタン
[data-testid="scene-display"]         // シーン表示全体  
[data-testid="scene-image"]           // 背景画像（条件付き）
```

### **Phase 2削除対象（選択肢・インタラクション）**
```typescript
// ❌ 完全削除 - 将来シナリオで必要時に再実装
[data-testid="choice-container"]      // 選択肢コンテナ
[data-testid="choice-instruction"]    // 選択指示テキスト
[data-testid="choice-1"]              // 選択肢ボタン（動的生成含む）
[data-choice-id]                      // 選択肢ID属性
[data-testid="narrative-content"]     // ナラティブコンテンツ
```

### **Phase 3削除対象（状態管理・エラー）**
```typescript
// ❌ 完全削除 - 将来シナリオで必要時に再実装
[data-testid="loading"]               // ローディング全体
[data-testid="loading-spinner"]       // スピナー
[data-testid="loading-message"]       // ローディングメッセージ
[data-testid="error-container"]       // エラー表示全体
[data-testid="error-title"]           // エラータイトル
[data-testid="error-message"]         // エラーメッセージ
[data-testid="reload-button"]         // 再読み込みボタン
[data-testid="autosave-status"]       // 自動保存状態
[data-status]                         // 状態値属性
```

---

## 📁 **削除対象ファイル詳細**

### **完全削除対象ファイル**
```
packages/ui/src/player/organisms/PlaySessionView/components/
├── StateViews/LoadingView.tsx        → 全data-testid削除
├── StateViews/ErrorView.tsx          → 全data-testid削除
├── EventContent/ChoiceEventContent.tsx → 全data-testid削除
├── EventContent/NarrativeEventContent.tsx → 全data-testid削除
└── AutoSaveIndicator.tsx             → 全data-testid削除
```

### **部分削除対象ファイル**
```typescript
// PlayHeader.tsx - 3つ削除、1つ保持
❌ data-testid="play-header"
❌ data-testid="exit-session-button"  
❌ data-testid="menu-button"
✅ data-testid="session-title"        // 保持

// SceneDisplay.tsx - 2つ削除、2つ保持
❌ data-testid="scene-display"
❌ data-testid="scene-image"
✅ data-testid="scene-background"     // 保持
✅ data-testid="scene-title"          // 保持
```

### **基盤コンポーネント Props型定義削除**
```typescript
// packages/ui/src/player/atoms/ChoiceOption/ChoiceOption.tsx
❌ data-testid?: string                // Props型削除
❌ data-choice-id?: string             // Props型削除

// packages/ui/src/player/atoms/EventButton/EventButton.tsx  
❌ data-testid?: string                // Props型削除
```

---

## ⚠️ **重要な削除指針**

### **段階的実装方針**
- **今回削除**: 第1シナリオで不要な全属性
- **将来再実装**: 各シナリオ追加時に必要分のみ段階的追加
- **過剰実装回避**: 使用予定のない機能の事前実装を禁止

### **コード品質向上**
```typescript
削除により期待される効果:
✅ コード簡潔性向上（不要属性除去）
✅ 保守性向上（管理対象属性の最小化）
✅ テスト焦点明確化（必要最小限のセレクタのみ）
✅ 段階的開発方針の徹底（YAGNI原則遵守）
```

---

## 🔄 **実装手順**

### **Step 1: 完全削除ファイル対応**
1. LoadingView.tsx, ErrorView.tsx, AutoSaveIndicator.tsx
2. ChoiceEventContent.tsx, NarrativeEventContent.tsx
3. 全data-testid属性・関連Props・型定義を削除

### **Step 2: 部分削除ファイル対応**  
1. PlayHeader.tsx → session-title以外削除
2. SceneDisplay.tsx → scene-title, scene-background以外削除
3. ContinueButton.tsx → continue-button保持（変更なし）

### **Step 3: 基盤コンポーネント対応**
1. ChoiceOption.tsx → data-testid Props型削除
2. EventButton.tsx → data-testid Props型削除

### **Step 4: 品質確認**
1. ESLint実行・全エラー解消
2. TypeScriptコンパイル確認
3. 改行コードLF統一確認

---

## ✅ **完了確認事項**

### **削除完了確認**
- [ ] 削除対象data-testid属性の完全除去
- [ ] 不要Props型定義の削除
- [ ] 関連する変数・定数の削除
- [ ] ESLint 100%クリーン達成

### **保持確認**
- [ ] session-title属性の動作確認
- [ ] scene-title属性の動作確認  
- [ ] scene-background属性の動作確認
- [ ] continue-button属性の動作確認

### **品質確認**
- [ ] TypeScriptコンパイルエラーなし
- [ ] 改行コードLF統一
- [ ] 不要import・未使用変数なし

---

## 🎯 **期待効果**

### **immediate効果**
- **コード簡潔性**: 50%以上のdata-testid削除によるコード量削減
- **保守性向上**: 管理対象属性の明確化・責任範囲の限定
- **テスト効率化**: 必要最小限セレクタによる実行速度向上

### **長期効果**
- **段階的開発徹底**: YAGNI原則に基づく効率的開発体制確立
- **品質向上**: 各段階での集中的品質確保・バグ早期発見
- **協働効率化**: 実装⇔テスト担当間の明確な責任分界・迅速フィードバック

---

## 📞 **完了報告依頼**

削除作業完了後、以下の簡潔な報告をお願いします：

```markdown
## 削除作業完了報告

### 削除完了
- [ ] 対象ファイル数: X件
- [ ] 削除data-testid数: X個
- [ ] ESLintクリーン: 達成

### 保持確認  
- [ ] 必須4属性の動作確認完了
- [ ] TypeScriptコンパイル成功

### 次段階準備
- [ ] 第1シナリオBDDテスト実行準備完了
```

---

**この削除により、第1シナリオ「プレイ画面の初期表示」のBDDテスト実行準備が完了し、段階的実装方針が徹底されます。将来のシナリオ追加時には、必要な属性のみを段階的に追加していく効率的な開発体制が確立されます。**

---

**作成者**: テスト担当（Claude Code）  
**作成日**: 2025-08-20  
**対象**: 実装担当  
**次段階**: 削除完了後の第1シナリオBDDテスト実行

#data-testid-optimization #scope-reduction #gradual-implementation #code-quality