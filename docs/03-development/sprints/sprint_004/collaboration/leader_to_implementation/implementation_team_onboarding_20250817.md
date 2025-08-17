# 実装担当オンボーディング資料

## 📋 基本情報

**作成者**: リーダー  
**対象者**: 実装担当  
**作成日時**: 2025-08-17 午後  
**Sprint**: Sprint 4 - Player文脈MVP実装フェーズ

## 🎯 プロジェクト概要

### Player文脈MVP実装フェーズ開始

Sprint 4では、Player文脈MVPの実装を開始します。設計フェーズが完了し、全設計文書の整合性確認・POフィードバック反映が完了済みです。

#### 🚀 実装開始状況
- **設計完成度**: ✅ 実装開始可能レベル達成
- **整合性確認**: ✅ 全設計文書の矛盾・不整合解消完了
- **POフィードバック**: ✅ 全フィードバック反映完了
- **品質保証体制**: ✅ テスト担当・設計担当との協働体制確立

## 📚 必須参照文書

### 核心設計文書
1. **[requirements.md](../../02-architecture/player-context/requirements.md)** - MVP要件定義・核心価値
2. **[mvp-guidelines.md](../../02-architecture/player-context/mvp-guidelines.md)** - MVP制約・品質基準
3. **[architecture.md](../../02-architecture/player-context/architecture.md)** - 技術アーキテクチャ・実装方針
4. **[data-design.md](../../02-architecture/player-context/data-design.md)** - データ設計・Event概念

### 画面設計文書
1. **[session-list.md](../../02-architecture/player-context/screens/session-list.md)** - セッション一覧画面
2. **[session-detail.md](../../02-architecture/player-context/screens/session-detail.md)** - セッション詳細画面
3. **[play-session.md](../../02-architecture/player-context/screens/play-session.md)** - プレイセッション画面

### チーム協働文書
- **[test-responsibility-boundaries.md](../../06-teams/processes/test-responsibility-boundaries.md)** - テスト分担境界

## 🔧 技術方針・アーキテクチャ概要

### 統一技術スタック
```typescript
// フロントエンド技術スタック
- React 19+ (関数型コンポーネント・Hooks)
- React Router v7 (宣言的ルーティング)
- TypeScript (厳格な型安全性)
- Redux Toolkit + SWR + useState (状態管理)

// UI開発戦略
- packages/ui (共有Componentライブラリ)
- StoryBook (Component視覚化・品質保証)
- 文脈別AtomicDesign (player/, gm/, author/, shared/)

// 開発・テスト環境
- Chrome最新版 (MVP制約)
- Playwright + Cucumber (E2Eテスト)
- 段階的移行 (既存vercel v0コード分離)
```

### MVP制約・重要な実装制約

#### ✅ 実装対象機能
- **GM1-vs-Player1制約**: 1対1のシンプルなセッション構造
- **3つの主要画面**: session-list → session-detail → play-session
- **Event概念**: choice、narrative、scene_transition（必須）
- **基本的UI**: 確実な動作・標準的WebUIコンポーネント

#### ❌ 除外機能（Phase 2以降）
- **フィルタリング機能**: 検索・絞り込み・ソート
- **ジャンル・難易度表示**: セッション属性情報
- **参加者数表示**: 人数管理・表示
- **再プレイ機能**: 基本的には再プレイ不可
- **キーボード操作**: タッチ操作のみ
- **滑らかなシーン遷移**: 基本的な応答性のみ

## 📱 UI Component開発戦略

### packages/ui構造
```
packages/ui/
├── src/
│   ├── player/          # Player文脈Components
│   │   ├── atoms/       # 基本Component
│   │   ├── molecules/   # 複合Component
│   │   └── organisms/   # 画面要素Component
│   ├── shared/          # 文脈共通Components
│   └── stories/         # StoryBook Definitions
```

### Component開発指針
1. **人間可読性重視**: 既存vercel v0コード参考禁止
2. **AtomicDesign**: 体系的・再利用可能な構造
3. **StoryBook必須**: 全Component作成時にStory作成
4. **文脈別分離**: player文脈専用の体系的Component管理

## 🎮 Event概念・プレイ体験実装

### 重要：Event概念システム

Player文脈MVPの核心は「Event概念」によるTRPG体験の実現です。

#### Event概念の構造
```typescript
// MVP必須Event
type EventType =
  | 'choice'           // 選択肢 - 完全実装必須
  | 'narrative'        // 物語進行 - 完全実装必須  
  | 'scene_transition' // シーン遷移 - 完全実装必須

// MVP最小限Event
  | 'dialogue'         // NPC会話 - 簡素実装
  | 'exploration'      // 探索 - 簡素実装

// Phase 2移行Event
  | 'item_acquire'     // アイテム獲得
  | 'skill_use'        // スキル使用
  | 'condition';       // 条件判定
```

#### Event処理実装方針
1. **choice Event**: 選択肢表示・選択・nextEventId遷移の完全実装
2. **narrative Event**: 物語テキスト表示・読み進め・nextEventId遷移の完全実装
3. **scene_transition Event**: targetSceneId取得・シーン遷移・新シーン読み込みの完全実装
4. **dialogue/exploration Event**: 基本的なテキスト表示のみ（簡素実装）

#### 状態管理・データ永続化
```typescript
// Event処理状態管理
interface EventProcessingState {
  current_event: {
    scene_id: string;
    event_id: string;
    event_type: EventType;
    processing_status: 'loading' | 'displaying' | 'waiting_input' | 'transitioning';
  };
  event_history: {
    completed_events: PlayEvent[];
    current_session_events: PlayEvent[];
    save_frequency: 'every_event' | 'every_scene';
  };
  ui_state: {
    text_display_complete: boolean;
    choice_selection_enabled: boolean;
    transition_in_progress: boolean;
    error_state?: string;
  };
}

// LocalStorageでの状態保存
- Event毎の自動保存（確実な状態保存）
- セッション状態の適切な管理
- 復旧・エラーハンドリングの実装
```

## 🏗️ 実装優先順位・開発ロードマップ

### Phase 1: 基盤構築（Week 1-2）
1. **packages/ui環境構築**: StoryBook・Component基盤整備
2. **session-list画面**: 一覧表示・パフォーマンス要件
3. **基本ルーティング**: React Router v7設定

### Phase 2: 詳細画面実装（Week 2-3）  
1. **session-detail画面**: セッション詳細・参加フロー
2. **基本Event処理**: Event概念の基盤実装
3. **状態管理基盤**: Redux Toolkit + SWR設定

### Phase 3: プレイ体験実装（Week 3-4）
1. **play-session画面**: Event処理UI・プレイ体験
2. **Event処理完成**: choice・narrative・scene_transition
3. **状態保存**: LocalStorage・Event履歴管理

### Phase 4: 品質保証・統合（Week 4-5）
1. **E2Eテスト**: テスト担当との協働
2. **Component品質**: StoryBook・視覚的品質確認
3. **統合動作確認**: 全体フロー・TRPG体験確認

## 🧪 テスト分担・品質保証

### 実装担当責任範囲
- **Unit Test**: Hook・Component・ユーティリティ関数のテスト
- **Component Test**: packages/ui ComponentのStoryBook・視覚テスト
- **統合動作確認**: 実装機能の基本動作確認

### テスト担当責任範囲
- **E2E Test**: Playwright + Cucumber BDDテスト
- **ユーザーシナリオテスト**: 実際のTRPG体験フロー
- **品質確認**: 完成機能の包括的品質保証

### 協働フロー
1. **実装完了**: Unit Test・Component Test完了後
2. **テスト連携**: テスト担当への動作確認依頼
3. **フィードバック**: テスト結果・課題のフィードバック受領
4. **改善実装**: テスト指摘事項の修正・改善

## 🚨 重要な実装制約・注意事項

### MVP制約徹底
1. **機能集中**: 除外機能の実装は絶対に行わない
2. **確実性優先**: 複雑な演出・アニメーションより確実な動作
3. **段階的改善**: Phase 2での機能拡張を前提とした拡張可能な設計

### 品質基準
1. **人間可読性**: 可読性・保守性重視のコード品質
2. **型安全性**: TypeScript厳格適用・型安全性確保
3. **Component品質**: StoryBook必須・視覚的品質確認

### Event処理実装での注意
1. **data-design.md準拠**: Event概念の正確な理解・実装
2. **MVP Event優先**: choice・narrative・scene_transitionの完全実装
3. **状態管理確実性**: Event毎の自動保存・確実な状態管理

## 🔄 協働体制・コミュニケーション

### 日常的コミュニケーション
- **実装進捗**: 日次での進捗・課題・質問の共有
- **技術相談**: 実装方針・技術選択での相談・確認
- **品質確認**: Component・機能完成時の品質確認依頼

### エスカレーション基準
以下の場合は即座にリーダーに相談：
- **技術的実現困難**: 設計の実装困難・技術制約
- **MVP制約判断**: 実装範囲・機能境界の判断困難
- **Event概念理解**: data-design.mdのEvent概念理解困難
- **品質基準**: 実装品質・Component品質の判断困難

### 設計担当との連携
- **設計相談**: 実装中の設計理解・詳細仕様確認
- **進化的設計**: 実装課題に基づく設計改善・調整
- **文書同期**: 実装実態に基づく設計文書更新

## 📋 実装開始チェックリスト

### 環境・基盤確認
- [ ] packages/ui・StoryBook環境動作確認
- [ ] React Router v7・Redux Toolkit設定確認  
- [ ] TypeScript・型定義環境確認

### 設計理解確認
- [ ] MVP要件・制約の理解確認
- [ ] Event概念・EventType分類の理解確認
- [ ] 3つの主要画面の設計理解確認
- [ ] UI Component戦略の理解確認

### 実装方針確認
- [ ] 実装優先順位・開発ロードマップの確認
- [ ] テスト分担・品質保証フローの確認
- [ ] 協働体制・コミュニケーション方針の確認

## 🎯 成功指標・達成目標

### MVP機能達成
- **3つの主要画面**: session-list・session-detail・play-sessionの動作
- **Event処理**: choice・narrative・scene_transitionの確実な動作
- **状態管理**: Event履歴・セッション状態の確実な保存・復旧

### 品質達成
- **TRPG体験**: 没入感・選択の重み・物語進行の確実な実現
- **Component品質**: packages/ui・StoryBookでの視覚的品質確認
- **型安全性**: TypeScript厳格適用での型安全性確保

### 協働効率
- **テスト協働**: テスト担当との効率的な協働・品質保証
- **設計連携**: 設計担当との進化的設計・継続改善
- **チーム貢献**: Player文脈MVP実現への着実な貢献

---

**リーダーからのメッセージ**:

Player文脈MVPの実装フェーズ開始おめでとうございます。

設計フェーズでは、POフィードバック反映・全設計文書の整合性確認が完了し、実装開始可能な状態が確立されています。特に「Event概念」は、TRPG体験の核心となる重要な設計です。

MVP制約を遵守しつつ、確実なEvent処理・TRPG体験の実現を期待しています。質問・相談はいつでもお声がけください。

**次ステップ**: 実装環境確認・packages/ui基盤構築開始

#implementation-onboarding #player-context-mvp #event-concept #packages-ui #collaboration-v2