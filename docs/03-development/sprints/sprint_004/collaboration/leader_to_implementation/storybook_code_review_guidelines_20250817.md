# StoryBook実装・コードレビュー指針

## 📋 基本情報

**作成者**: リーダー  
**対象者**: 実装担当  
**作成日時**: 2025-08-17 午後  
**適用開始**: 即座（Phase 1 StoryBook実装時）

## 🎯 StoryBook実装・レビューフロー

### 段階的実装・レビューサイクル
人間のコードレビューには限界があるため、以下の段階的アプローチで進行してください。

#### ✅ 推奨実装・レビューユニット
```typescript
// 1回のレビューユニット（適切な分量）
interface ReviewUnit {
  component: "1つのComponent実装";
  story: "対応する1つのStory作成";
  test: "基本的なComponent Test（任意）";
  
  // 人間がレビュー可能な適切な分量
  estimated_review_time: "15-30分程度";
  files_count: "2-4ファイル程度";
}
```

### 📱 StoryBook実装・レビューフロー

#### Phase 1での実装順序・レビュータイミング
```markdown
1️⃣ **EventButton Component + Story**
   - 実装完了 → 人間コードレビュー依頼
   - レビュー完了 → 次Component実装開始

2️⃣ **SessionCard Component + Story**  
   - 実装完了 → 人間コードレビュー依頼
   - レビュー完了 → 次Component実装開始

3️⃣ **ChoiceOption Component + Story**
   - 実装完了 → 人間コードレビュー依頼  
   - レビュー完了 → 次Component実装開始

4️⃣ **SessionListView Component + Story**
   - 実装完了 → 人間コードレビュー依頼
   - レビュー完了 → Phase 1基盤完了確認
```

## 🔍 コードレビュー依頼方法

### レビュー依頼タイミング
**⚠️ 重要**: 実装とStoryが**1つ完成したタイミング**で必ずレビュー依頼してください。

#### ❌ 避けるべきパターン
```markdown
❌ 複数Component実装後の一括レビュー依頼
❌ 大量ファイル変更の一括レビュー依頼  
❌ 実装完了後にStoryをまとめて作成・レビュー依頼
❌ レビューなしでの次Component実装開始
```

#### ✅ 推奨パターン  
```markdown
✅ 1 Component + 1 Story完成 → 即座レビュー依頼
✅ レビュー完了・修正反映 → 次Component実装開始
✅ 段階的品質確保・継続的フィードバック
✅ 人間が集中してレビュー可能な適切な分量
```

### レビュー依頼文書作成
**ファイル名形式**: `implementation_to_leader_component_review_request_[component-name]_20250817.md`

**依頼内容**:
```markdown
# Component実装レビュー依頼

## 実装Component情報
- **Component名**: EventButton
- **実装ファイル**: packages/ui/src/player/atoms/EventButton/
- **Story ファイル**: packages/ui/src/stories/player/EventButton.stories.tsx
- **型定義**: packages/ui/src/player/types/

## 確認要請事項
- TypeScript型安全性・型定義適切性
- Component Props設計・再利用性
- StoryBook Story品質・視覚的確認
- AtomicDesign配置・命名規則適切性
- MVP制約遵守・不要機能除外確認

## 実装方針・判断理由
[技術選択理由・実装方針の説明]

## 確認したい点・質問
[レビューで特に確認してほしい点]
```

## 🎨 StoryBook品質基準

### Component Story必須要素
```typescript
// Component Story基本構成
export default {
  title: 'Player/Atoms/EventButton',
  component: EventButton,
  parameters: {
    docs: {
      description: {
        component: 'Event処理用ボタンComponent。choice・narrative・continueに対応。'
      }
    }
  }
} as Meta;

// 必須Story パターン
export const Default: Story = { /* 基本表示 */ };
export const Disabled: Story = { /* 無効状態 */ };
export const Loading: Story = { /* 処理中状態 */ };
export const Choice: Story = { /* 選択肢用 */ };
export const Continue: Story = { /* 続ける用 */ };
```

### 視覚的品質確認事項
- **レスポンシブ対応**: モバイル・デスクトップでの適切な表示
- **状態表示**: hover・disabled・loading状態の適切な視覚フィードバック
- **MVP制約遵守**: 派手な演出・不要機能の除外確認
- **AtomicDesign適合**: Player文脈での適切なComponent粒度

## 🔧 実装技術基準

### TypeScript型安全性
```typescript
// 厳格な型定義・Props設計
interface EventButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  variant: 'choice' | 'continue' | 'narrative';
  children: React.ReactNode;
  ariaLabel?: string; // アクセシビリティ配慮
}

// 型安全性確保・undefined回避
const EventButton: React.FC<EventButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant,
  children,
  ariaLabel
}) => {
  // 実装...
};
```

### Component品質基準
- **再利用性**: Player文脈での汎用的活用可能性
- **保守性**: 可読性・命名規則・構造の適切性
- **拡張性**: Phase 2での機能拡張への配慮
- **MVP制約**: 不要機能・複雑演出の除外徹底

## 🚨 レビュー重点確認事項

### Event概念関連Component
```typescript
// Event処理Componentの重点確認
重点確認事項:
- data-design.md Event概念との整合性
- EventType別の適切なUI表現
- Event遷移・状態管理の適切な実装
- MVP必須・最小限・除外の適切な分類反映
```

### MVP制約遵守確認
```typescript
// MVP制約チェックリスト
❌ 実装禁止確認:
- フィルタリング・検索・ソート機能
- ジャンル・難易度情報表示
- タイプライター効果・派手演出
- item_acquire・skill_use・condition Event対応

✅ 必須実装確認:
- choice・narrative・scene_transition Event対応
- 基本的UI・確実な動作
- TypeScript型安全性・エラーハンドリング
```

## 📅 レビューサイクル・タイムライン

### 人間レビューの効率化
- **レビュー時間**: 1Component+Story = 15-30分程度
- **フィードバック**: レビュー完了後24時間以内
- **修正反映**: フィードバック受領後即座対応
- **次実装開始**: レビュー完了・修正反映後

### Phase 1での予想レビューサイクル
```markdown
Day 1-2: EventButton実装 → レビュー → 修正
Day 2-3: SessionCard実装 → レビュー → 修正  
Day 3-4: ChoiceOption実装 → レビュー → 修正
Day 4-5: SessionListView実装 → レビュー → 修正
Day 5-7: session-list/detail画面StoryBook → レビュー → 調整
```

## 🤝 協働・コミュニケーション

### レビュー依頼時の配慮
- **適切な分量**: 人間が集中してレビュー可能な分量
- **明確な依頼**: 確認要請事項・実装方針の明確な記載
- **技術判断尊重**: 実装担当の技術選択・判断の尊重
- **建設的フィードバック**: 品質向上・学習促進のフィードバック

### エスカレーション基準
以下の場合は即座リーダーエスカレーション：
- **技術実現困難**: Component実装・Story作成の技術的困難
- **MVP制約判断**: 実装範囲・機能境界の判断困難
- **レビュー内容**: レビューフィードバックの理解・対応困難
- **品質基準**: Component・Story品質基準の判断困難

---

**コードレビューの目的**:

段階的なコードレビューにより、品質確保・継続的改善・学習促進を実現し、高品質なPlayer文脈MVP Component基盤を構築します。

人間のレビュー能力を最大限活用するため、**1 Component + 1 Story完成毎の即座レビュー**を徹底してください。

**次ステップ**: EventButton Component実装開始・完成時の即座レビュー依頼

#storybook-implementation #code-review #component-quality #gradual-review #collaboration-v2