# Component実装レビュー依頼 - EventButton

## 📋 基本情報

**レビュー依頼者**: 実装担当  
**対象者**: リーダー  
**作成日時**: 2025-08-17 20:30  
**実装完了日**: 2025-08-17

## 🎯 実装Component情報

### Component詳細
- **Component名**: EventButton
- **実装ディレクトリ**: `packages/ui/src/player/atoms/EventButton/`
- **実装ファイル**: 
  - `EventButton.tsx` - メインComponent実装
  - `EventButton.stories.tsx` - StoryBook Story
  - `index.ts` - エクスポート定義

### 位置づけ・役割
- **AtomicDesign**: Atoms（基本UI要素）
- **Player文脈**: Event処理用基本ボタンComponent
- **用途**: choice・narrative・scene_transition Event処理での選択・進行操作

## 🔍 確認要請事項

### 1. TypeScript型安全性・型定義適切性
```typescript
export interface EventButtonProps {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'choice' | 'continue';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string; // アクセシビリティ配慮
}
```

### 2. Component Props設計・再利用性
- **variant設計**: Player文脈でのEvent処理用途に特化
  - `choice`: 選択肢ボタン（白背景・境界線・ホバー効果）
  - `continue`: 物語進行ボタン（緑背景・続行意味）
  - `primary/secondary`: 一般的な操作用
- **状態管理**: disabled・loading状態の適切な表現
- **アクセシビリティ**: aria-label対応・適切なタッチターゲットサイズ

### 3. StoryBook Story品質・視覚的確認
- **基本Story**: Default・Choice・Continue・Loading・Disabled
- **AllVariants Story**: 全バリエーション一覧表示
- **ドキュメント**: Component説明・用途明記
- **視覚的確認**: レスポンシブ・状態表示・ホバー効果

### 4. AtomicDesign配置・命名規則適切性
- **配置**: `packages/ui/src/player/atoms/` - Player文脈Atoms適切配置
- **命名**: EventButton - Event処理用途明確・一般的すぎない命名
- **構造**: useViewModel Hook分離・ロジック・UI分離

### 5. MVP制約遵守・不要機能除外確認
- **✅ MVP適合**: 基本的なボタン機能・確実な動作
- **❌ 除外済み**: 派手なアニメーション・複雑な演出効果
- **✅ Event対応**: choice・narrative・continue用途対応
- **❌ 除外済み**: item_acquire・skill_use・condition対応なし

## 🎨 実装方針・判断理由

### 1. variant設計の理由
Player文脈でのEvent処理における明確な用途分離：
- **choice**: TRPG選択肢の重要性表現（境界線・ホバー効果）
- **continue**: 物語進行の積極性表現（緑色・アクション促進）
- **primary/secondary**: 一般操作（参加・戻る等）

### 2. useViewModel Hook分離の理由
- **ロジック分離**: スタイル計算・状態判定をView層から分離
- **テスト容易性**: ロジック部分の単体テスト可能
- **可読性向上**: Component本体の簡潔性確保

### 3. アクセシビリティ配慮
- **aria-label**: スクリーンリーダー対応
- **min-h-[48px]**: タッチターゲット適切サイズ
- **touch-manipulation**: タッチ操作最適化

### 4. loading状態表現
- **視覚フィードバック**: スピナーアニメーション・「処理中...」表示
- **操作無効化**: disabled状態での誤操作防止
- **MVP制約遵守**: 基本的なアニメーション・過度な演出除外

## 🤔 確認したい点・質問

### 1. Event概念との整合性
- **data-design.md Event概念**: choice・narrative・scene_transition Event処理での適切な使用方法
- **Event処理フロー**: Event遷移・nextEventId取得での適切な統合方法

### 2. variant分類の妥当性
- **choice variant**: 選択肢用デザイン・視覚的重要性表現の適切性
- **continue variant**: 物語進行用デザイン・アクション促進効果の適切性
- **Player文脈特化**: 他文脈での再利用性 vs Player特化の適切なバランス

### 3. AtomicDesign配置
- **Atoms配置**: Molecules候補（ChoiceOption・ContinueButton）との適切な分離
- **再利用粒度**: Event処理以外でのPlayer文脈内再利用想定の適切性

### 4. Phase 2拡張性
- **Event拡張**: item_acquire・skill_use Event対応時のvariant追加容易性
- **UI改善**: より高度なアニメーション・エフェクト追加時の構造適応性

## 📊 技術的実装詳細

### Component構造
```typescript
// useViewModel Hook - ロジック分離
const useViewModel = ({ disabled, loading }) => {
  // スタイル計算・状態判定ロジック
  return { baseClasses, variantClasses, isDisabled };
};

// EventButton Component - UI表現
export function EventButton(props) {
  const { baseClasses, variantClasses, isDisabled } = useViewModel(props);
  // UI レンダリング
}
```

### CSS設計
- **Tailwind CSS**: ユーティリティクラス活用・保守性確保
- **レスポンシブ**: 基本的な画面サイズ対応
- **状態表現**: hover・disabled・loadingの適切な視覚フィードバック

## 🎯 期待する品質確認結果

### 技術品質
- **✅ TypeScript型安全性**: コンパイルエラー0・型定義適切性
- **✅ Component再利用性**: Player文脈での汎用的活用可能性
- **✅ アクセシビリティ**: 基本的な配慮・WCAG準拠の可能性

### MVP適合性
- **✅ Event概念整合**: choice・narrative・scene_transition Event処理適用可能性
- **✅ 制約遵守**: 不要機能除外・基本機能集中
- **✅ Phase 2拡張性**: 将来機能追加への適応可能性

### StoryBook品質
- **✅ 視覚的確認**: 全variant・全状態の適切な表示
- **✅ ドキュメント**: Component用途・使用方法の明確な説明
- **✅ インタラクション**: ホバー・クリック・状態変化の確認可能性

---

**レビュー完了後の次ステップ**: 
フィードバック反映・修正完了後、SessionCard Component実装開始

**Phase 1進捗**: EventButton完成・レビュー中 → SessionCard → ChoiceOption → SessionListView

#component-review-request #event-button #storybook-implementation #phase1-foundation