# Player文脈MVP実装優先順位・開発ロードマップ

## 📋 基本情報

**作成者**: リーダー  
**対象者**: 実装担当  
**作成日時**: 2025-08-17 午後  
**対象期間**: Sprint 4実装フェーズ（4-5週間予定）

## 🎯 実装戦略概要

### 段階的実装アプローチ
1. **基盤構築 → 基本画面 → Event処理 → 品質保証**: 確実な積み上げ式実装
2. **MVP制約厳守**: 除外機能の実装回避・確実性優先
3. **Event概念重視**: TRPG体験の核心となるEvent処理の完全実装
4. **継続的品質確認**: 各段階でのテスト・StoryBook品質確認

## 📅 詳細実装ロードマップ

### Phase 1: 基盤構築・環境整備（Week 1: 1-7日目）

#### 1.1 開発環境・基盤構築（1-3日目）
```typescript
// 実装優先度: 🔴 最高
✅ 必須実装項目
- packages/ui環境構築・StoryBook設定
- React Router v7基本設定・ルーティング
- Redux Toolkit + SWR状態管理基盤
- TypeScript厳格設定・型定義基盤
- CSS-in-JS設定・スタイリング基盤

🎯 成果物
- packages/ui/src/player/ フォルダ構造確立
- StoryBook動作確認・基本Story表示
- Redux Store基本設定・SWR設定
- Player文脈基本ルーティング（/player/sessions/*）
- 開発環境での動作確認完了

📊 品質基準
- StoryBook正常動作・Component表示確認
- TypeScript型チェック通過・厳格設定適用
- React Router v7宣言的ルーティング動作確認
```

#### 1.2 基本Component作成・StoryBook統合（4-7日目）
```typescript
// 実装優先度: 🔴 最高
✅ Atoms実装
- EventButton: Event処理用ボタン（続ける・選択・遷移）
- SessionCard: セッション情報表示カード
- LoadingSpinner: 読み込み状態表示
- ErrorMessage: エラー状態表示・復旧オプション
- NarrativeText: 物語テキスト表示Component

✅ Molecules実装  
- ChoiceList: 選択肢リスト表示
- SessionSummary: セッション概要情報
- PlayProgress: プレイ進行状況（簡素実装）

🎯 StoryBook統合
- 全Component必須Story作成
- 視覚的品質確認・Component仕様書
- Player文脈専用Component展示

📊 品質基準
- 全ComponentのStoryBook表示確認
- Component Props型安全性確認
- 視覚的デザイン品質・レスポンシブ対応確認
```

### Phase 2: 基本画面実装（Week 2: 8-14日目）

#### 2.1 session-list画面実装（8-10日目）
```typescript
// 実装優先度: 🟠 高
✅ 必須実装項目
- SessionListPage Component実装
- SessionListView Organism実装
- セッション一覧データフェッチング（SWR）
- セッション選択・詳細画面遷移
- 基本的なパフォーマンス要件

❌ 除外機能（MVP制約）
- フィルタリング・検索・ソート機能
- ジャンル・難易度情報表示
- 参加者数表示・複雑な状態表示

🎯 成果物
- /player/sessions ルート完全動作
- セッション一覧表示・カード型UI
- セッション選択→詳細画面遷移
- SWRキャッシュ・エラーハンドリング

📊 品質基準
- セッション一覧表示の確実な動作
- 基本的な読み込み・応答性確保
- エラー状態・読み込み状態の適切な表示
```

#### 2.2 session-detail画面実装（11-14日目）
```typescript
// 実装優先度: 🟠 高
✅ 必須実装項目
- SessionDetailPage Component実装
- SessionDetailView Organism実装
- セッション詳細情報表示・参加フロー
- プレイセッション画面遷移
- 基本的なセッション参加処理

❌ 除外機能（MVP制約）
- ジャンル・難易度詳細情報
- 参加者数・複雑な参加状態管理
- 高度な参加承認フロー

🎯 成果物
- /player/sessions/:id ルート完全動作
- セッション詳細表示・基本情報
- セッション参加→プレイ画面遷移
- セッション状態管理・LocalStorage連携

📊 品質基準
- セッション詳細表示の確実な動作
- 参加フローの自然な操作感
- プレイ画面への適切な状態引き継ぎ
```

### Phase 3: Event概念・プレイ体験実装（Week 3: 15-21日目）

#### 3.1 Event処理基盤実装（15-17日目）
```typescript
// 実装優先度: 🔴 最高（TRPG体験の核心）
✅ 必須実装項目
- Event処理Engine・useEventProcessor Hook
- EventProcessingState状態管理・Redux統合
- Event履歴管理・LocalStorage自動保存
- Event処理フロー・nextEventId遷移
- エラーハンドリング・復旧機能

✅ data-design.md整合性確保
- Event概念・EventType構造の正確な実装
- Scene.events・Scene.startingEventId管理
- PlayRecord.eventHistory適切な記録

🎯 成果物
- Event処理Core Logic完成
- Event状態管理・履歴保存確立
- Event実行・遷移フロー動作確認

📊 品質基準
- Event処理の確実な動作・エラーハンドリング
- data-design.mdとの完全整合性
- Event履歴の確実な保存・復旧
```

#### 3.2 MVP必須Event実装（18-21日目）
```typescript
// 実装優先度: 🔴 最高
✅ choice Event完全実装
- ChoiceEventComponent・ChoiceOption実装
- 選択肢表示・プレイヤー選択・nextEventId遷移
- 選択状態管理・選択履歴保存
- 選択確認・無効化状態適切な処理

✅ narrative Event完全実装
- NarrativeEventComponent実装
- 物語テキスト表示・読み進め操作
- テキスト表示完了待ち・nextEventId遷移
- MVP制約：即座全文表示（タイプライター効果除外）

✅ scene_transition Event完全実装
- SceneTransitionEventComponent実装
- targetSceneId取得・シーン遷移・新シーン読み込み
- 遷移中状態表示・エラーハンドリング
- 自動遷移・確実な画面更新

🎯 成果物
- choice・narrative・scene_transition Event完全動作
- Event処理UI・インタラクション確立
- Event遷移フロー・TRPG体験実現

📊 品質基準
- 各EventTypeの確実な動作・適切なUI
- Event遷移の自然な流れ・没入感確保
- Event処理でのTRPG体験品質実現
```

### Phase 4: プレイセッション画面・最小限Event（Week 4: 22-28日目）

#### 4.1 play-session画面実装（22-24日目）
```typescript
// 実装優先度: 🟠 高
✅ 必須実装項目
- PlaySessionPage Component実装
- PlaySessionView・EventProcessingView Organism実装
- Event表示・処理・遷移の統合UI
- セッション状態復旧・新規セッション開始
- プレイ進行状況・Event履歴表示

✅ Event処理統合
- EventType判定・適切なComponent表示
- Event処理結果・次Event自動実行
- Event履歴・セッション状態確実な保存

🎯 成果物
- /player/sessions/:id/play ルート完全動作
- Event処理・プレイ体験統合UI
- セッション状態管理・復旧機能完成

📊 品質基準
- プレイセッション画面の確実な動作
- Event処理・TRPG体験の自然な流れ
- セッション状態・Event履歴の確実な管理
```

#### 4.2 MVP最小限Event実装（25-28日目）
```typescript
// 実装優先度: 🟡 中（簡素実装）
✅ dialogue Event簡素実装
- DialogueEventComponent実装
- NPC名・NPCテキスト基本表示
- 基本的な会話フロー・nextEventId遷移
- 複雑な会話システム除外（選択肢は別途choiceEventで管理）

✅ exploration Event簡素実装
- ExplorationEventComponent実装
- 探索対象・探索結果基本テキスト表示
- 基本的なアクションUI・nextEventId遷移
- 複雑なアイテム管理・判定システム除外

❌ Phase 2移行Event（実装禁止）
- item_acquire Event: アイテム獲得・管理
- skill_use Event: スキル使用・効果
- condition Event: 条件判定・分岐

🎯 成果物
- dialogue・exploration Event基本動作
- 全EventType対応・包括的Event処理
- MVP Event処理完全実装

📊 品質基準
- dialogue・exploration Eventの基本動作確認
- 全EventTypeでの一貫したTRPG体験
- MVP制約遵守・簡素実装の適切な境界
```

### Phase 5: 品質保証・統合確認（Week 5: 29-35日目）

#### 5.1 Component品質・StoryBook完成（29-31日目）
```typescript
// 実装優先度: 🟠 高
✅ StoryBook品質確認
- 全ComponentのStory完成・視覚的品質確認
- Event処理ComponentのStory・シナリオ確認
- レスポンシブ・アクセシビリティ基本確認
- Component仕様書・使用例整備

✅ Component Test完成
- Unit Test・Component Test網羅
- Event処理Hook・状態管理Test
- Component Props・インタラクションTest
- エラーハンドリング・Edge CaseTest

🎯 成果物
- packages/ui Component品質完成
- StoryBook・Component仕様書完成
- Unit Test・Component Test合格

📊 品質基準
- 全ComponentのStoryBook表示・品質確認
- Component Test網羅・Edge Case対応
- 視覚的品質・インタラクション品質確保
```

#### 5.2 E2Eテスト・統合確認（32-35日目）
```typescript
// 実装優先度: 🔴 最高（テスト担当との協働）
✅ E2Eテスト協働
- テスト担当との協働・BDD Feature実行
- Playwright + Cucumber統合テスト
- ユーザーシナリオ・TRPG体験フロー確認
- テスト指摘事項・課題修正

✅ 統合動作確認
- session-list → session-detail → play-sessionフロー
- Event処理・選択・遷移・履歴保存確認
- エラーハンドリング・復旧機能確認
- Chrome最新版での動作確認

🎯 成果物
- E2Eテスト合格・品質保証完了
- 統合動作確認・TRPG体験確認
- Player文脈MVP実装完成

📊 品質基準
- BDD Feature全テストケース合格
- ユーザーシナリオ・TRPG体験の確実な動作
- エラーハンドリング・復旧機能の確実な動作
```

## 🚨 重要な実装制約・優先順位

### MVP制約厳守（実装禁止機能）
```typescript
❌ 絶対実装禁止
- フィルタリング・検索・ソート機能
- ジャンル・難易度情報表示
- 参加者数表示・複雑な参加状態管理
- 再プレイ機能（基本的には再プレイ不可）
- キーボード操作（タッチ操作のみ）
- 滑らかなシーン遷移・高度なアニメーション
- item_acquire・skill_use・condition Event
- タイプライター効果・派手な演出効果
```

### 実装優先度分類
```typescript
🔴 最高優先度（実装必須・品質重視）
- Event概念実装（choice・narrative・scene_transition）
- Event処理基盤・状態管理・履歴保存
- packages/ui基盤・StoryBook統合
- data-design.md整合性確保

🟠 高優先度（確実な実装）
- 3つの主要画面（session-list・session-detail・play-session）
- Redux Toolkit + SWR状態管理
- Component品質・StoryBook品質確認
- E2Eテスト協働・統合確認

🟡 中優先度（簡素実装）
- dialogue・exploration Event（基本テキスト表示のみ）
- プレイ進行状況表示（基本的な情報のみ）
- エラーハンドリング・復旧機能（基本レベル）

🔵 低優先度（余力がある場合）
- 視覚的演出・UI改善（基本レベル）
- パフォーマンス最適化（基本レベル）
- アクセシビリティ対応（基本レベル）
```

## 📊 実装進捗・品質確認指標

### 週次進捗確認ポイント
```typescript
Week 1完了基準
✅ packages/ui環境構築・StoryBook動作確認
✅ 基本Component作成・Story表示確認
✅ Redux Toolkit + SWR基盤動作確認
✅ TypeScript厳格設定・型チェック通過

Week 2完了基準
✅ session-list・session-detail画面基本動作
✅ セッション一覧表示・詳細表示・遷移確認
✅ SWRデータフェッチング・エラーハンドリング
✅ セッション状態管理・LocalStorage連携

Week 3完了基準
✅ Event処理基盤・useEventProcessor動作確認
✅ choice・narrative・scene_transition Event完全実装
✅ Event履歴・状態保存・復旧機能確認
✅ data-design.mdとの整合性確保

Week 4完了基準
✅ play-session画面・Event処理統合UI
✅ dialogue・exploration Event簡素実装
✅ プレイセッション・Event処理完全動作
✅ セッション状態・Event履歴確実な管理

Week 5完了基準
✅ Component品質・StoryBook完成
✅ E2Eテスト合格・テスト担当協働完了
✅ 統合動作確認・TRPG体験確認
✅ Player文脈MVP実装完成・品質保証完了
```

### 品質基準・成功指標
```typescript
技術品質基準
✅ TypeScript厳格適用・型安全性100%
✅ Component Test網羅・Edge Case対応
✅ StoryBook全Component表示・視覚品質確認
✅ E2Eテスト100%合格・BDD Feature対応

TRPG体験品質基準
✅ Event処理・選択・遷移の自然な流れ
✅ 没入感確保・選択の重み表現
✅ 物語進行・Event遷移の滑らかさ
✅ 確実な状態保存・復旧・継続プレイ

MVP達成基準
✅ 3つの主要画面完全動作
✅ Event概念完全実装（必須・最小限）
✅ GM1-vs-Player1制約完全適用
✅ 除外機能完全回避・MVP制約遵守
```

## 🔄 協働・コミュニケーション体制

### 日次コミュニケーション
- **進捗報告**: 実装完了・課題・質問の共有
- **技術相談**: 実装方針・Component設計の相談
- **品質確認**: Component・Event処理の品質確認依頼

### 週次マイルストーン確認
- **Week完了確認**: 週次基準の達成確認・品質評価
- **次週計画**: 実装優先度・課題対応の調整
- **協働調整**: テスト担当・設計担当との連携調整

### エスカレーション基準
- **技術実現困難**: 設計・MVP制約との技術的矛盾
- **Event概念理解**: data-design.mdの実装困難
- **品質基準判断**: Component・TRPG体験品質の判断困難
- **スケジュール課題**: 実装遅延・品質リスクの発生

---

**実装成功への期待**:

Player文脈MVPの実装フェーズでは、「Event概念によるTRPG体験の実現」が最も重要な成功要因です。

段階的な実装アプローチにより、確実な基盤構築→Event処理実装→品質保証の流れで、MVP制約を遵守しつつ高品質なTRPG体験を実現してください。

**次ステップ**: Phase 1基盤構築開始・packages/ui環境整備

#implementation-roadmap #event-concept-priority #mvp-constraints #quality-assurance #collaboration-v2