# 作業指示書：play-session.mdのPOレビューフィードバック反映作業

## 📋 基本情報

**指示者**: リーダー  
**作業者**: 設計担当  
**作成日時**: 2025-08-17 午後  
**優先度**: 高  
**期限**: 本日中

## 🎯 作業概要

play-session.mdに対するPOレビューフィードバックを反映し、data-design.mdのEvent概念との整合性確保とシーン中のイベント処理設計を追加してください。

## 📍 POレビューフィードバック内容

### Event概念の設計不足

**POレビュー指摘事項**:
```markdown
シーン中のイベントに関することが何も書かれていません。
docs\02-architecture\player-context\data-design.mdからのフィードバックが十分か確認してください
```

**問題の核心**:
- play-session.mdにEvent概念・イベント処理の設計が不足
- data-design.mdで詳細に定義されたEvent概念が画面設計に反映されていない
- シーン中のイベント（choice、narrative、dialogue、scene_transition等）の UI/UX設計が欠如

## 🔍 具体的な作業内容

### 1. data-design.mdのEvent概念確認（必須）

**参照内容**: data-design.md 131-238行のEvent概念

```typescript
// 確認すべきEvent概念
type EventType =
  | 'choice' // 選択肢（従来のChoice）- MVP必須
  | 'narrative' // 物語進行（テキスト表示）- MVP必須
  | 'dialogue' // NPC会話 - MVP最小限実装
  | 'scene_transition' // シーン移動専用イベント - MVP必須
  | 'exploration' // 探索アクション - MVP最小限実装
  | 'item_acquire' // アイテム獲得 - 将来拡張
  | 'skill_use' // スキル使用 - 将来拡張
  | 'condition'; // 条件判定 - 将来拡張
```

### 2. Event処理UI/UX設計の追加（必須）

**追加セクション**: シーン中のイベント処理設計

```markdown
## シーン中のイベント処理設計

### Event概念統合UI/UX

#### MVP必須Event処理
1. **choiceイベント**: 選択肢表示・プレイヤー選択・次イベント遷移
2. **narrativeイベント**: 物語テキスト表示・読み進め操作
3. **scene_transitionイベント**: シーン移動・読み込み・画面遷移

#### MVP最小限Event処理
1. **dialogueイベント**: NPC会話表示・基本的な会話フロー
2. **explorationイベント**: 探索アクション・結果表示

### EventType別UI仕様

#### choiceイベントUI
- **表示要素**: 選択肢リスト・説明文・選択ボタン
- **インタラクション**: タップ選択・確認・次イベント遷移
- **状態管理**: 選択済み状態・無効化状態

#### narrativeイベントUI
- **表示要素**: 物語テキスト・読み進めボタン
- **インタラクション**: テキスト表示完了待ち・次イベント遷移
- **演出**: テキスト表示アニメーション（MVP最小限）

#### scene_transitionイベントUI
- **表示要素**: 遷移メッセージ・読み込み状態
- **インタラクション**: 自動遷移・エラーハンドリング
- **フィードバック**: 遷移中の適切な状態表示
```

### 3. Event処理フロー設計の追加（必須）

**追加内容**: Event実行・遷移のフロー設計

```mermaid
## Event処理フローチャート
graph TB
    A[シーン開始] --> B{startingEventId確認}
    B --> C[Event実行]
    C --> D{EventType判定}
    
    D -->|choice| E[選択肢表示]
    D -->|narrative| F[物語テキスト表示]
    D -->|dialogue| G[NPC会話表示]
    D -->|scene_transition| H[シーン遷移実行]
    D -->|exploration| I[探索アクション表示]
    
    E --> J[プレイヤー選択待ち]
    F --> K[読み進め操作待ち]
    G --> K
    I --> K
    
    J --> L[nextEventId取得]
    K --> L
    H --> M[新シーン読み込み]
    
    L --> N{nextEventId存在?}
    N -->|Yes| C
    N -->|No| O[シーン完了]
    
    M --> A
    O --> P[セッション状態更新]
```

### 4. Event処理状態管理設計の追加（必須）

**追加内容**: Event実行・状態管理の設計

```typescript
interface EventProcessingState {
  // 現在のEvent状態
  current_event: {
    scene_id: string;
    event_id: string;
    event_type: EventType;
    processing_status: 'loading' | 'displaying' | 'waiting_input' | 'transitioning';
  };
  
  // Event履歴管理
  event_history: {
    completed_events: PlayEvent[];
    current_session_events: PlayEvent[];
    save_frequency: 'every_event' | 'every_scene';
  };
  
  // UI状態管理
  ui_state: {
    text_display_complete: boolean;
    choice_selection_enabled: boolean;
    transition_in_progress: boolean;
    error_state?: string;
  };
}
```

### 5. MVPでのEvent処理制約の明記（必須）

**追加内容**: MVP制約下でのEvent処理方針

```markdown
## MVP制約下でのEvent処理

### 実装必須Event
- **choice**: 選択肢表示・選択・遷移（完全実装）
- **narrative**: テキスト表示・読み進め（完全実装）
- **scene_transition**: シーン遷移・読み込み（完全実装）

### 最小限実装Event
- **dialogue**: 基本的なNPC会話表示（簡素実装）
- **exploration**: 基本的な探索結果表示（簡素実装）

### Phase 2移行Event
- **item_acquire**: アイテム獲得・管理
- **skill_use**: スキル使用・効果
- **condition**: 条件判定・分岐

### MVP実装制約
- **演出最小限**: 派手なアニメーション・エフェクト除外
- **基本的UI**: 標準的なWebUIコンポーネント活用
- **確実な動作**: 複雑な演出より確実な動作優先
```

## 📊 制約・前提条件

### data-design.md整合性（必須遵守）
- **Event概念**: data-design.mdで定義されたEvent構造の完全反映
- **EventType**: MVP必須・最小限・将来拡張の分類遵守
- **データ構造**: Event、Scene、PlayRecordの整合性確保

### MVP制約
- **実装現実性**: 複雑なEvent処理の段階的実装
- **UI簡素化**: 基本的なEvent表示・操作に集中
- **確実な動作**: Event処理の確実性・安定性優先

## 📋 期待成果物

### 1. 修正されたplay-session.md
**追加箇所**:
- シーン中のイベント処理設計
- Event概念統合UI/UX仕様
- Event処理フロー設計
- Event処理状態管理設計
- MVPでのEvent処理制約

### 2. フィードバック反映報告書
**ファイル名**: `designer_to_leader_play_session_po_feedback_report_20250817.md`

**内容**:
- POフィードバック反映の詳細
- data-design.mdとの整合性確保
- Event処理設計の追加内容
- 実装フェーズへの影響評価

### 3. 更新履歴の適切な記録
- POレビューフィードバック反映の記録
- Event概念統合設計の追加記録
- data-design.md整合性確保の記録

## 🔄 作業プロセス

### Step 1: data-design.md Event概念確認（30分）
- Event概念・EventType・データ構造の詳細確認
- MVP必須・最小限・将来拡張の分類理解
- 既存設計との整合性確認

### Step 2: Event処理UI/UX設計（60分）
- EventType別UI仕様設計
- Event処理フロー設計
- Event処理状態管理設計
- MVP制約下での実装方針策定

### Step 3: play-session.md修正（40分）
- Event処理設計セクション追加
- 既存設計との統合・整合性確保
- MVP制約・実装指針の明記

### Step 4: 報告書作成・整合性確認（20分）
- 追加内容の詳細記録
- data-design.mdとの整合性確認
- 実装フェーズへの影響評価

## 🚨 注意事項・特記事項

### 重要な考慮点
1. **data-design.md完全準拠**: Event概念の正確な理解・反映
2. **MVP制約遵守**: 複雑なEvent処理の段階的実装
3. **実装現実性**: Event処理UIの実装可能性確保
4. **プレイ体験**: Event処理でのTRPG体験品質維持

### エスカレーション基準
以下の場合は即座にリーダーに相談：
- data-design.mdのEvent概念理解に重大な疑問が生じた場合
- Event処理UI設計で技術的実現困難が想定される場合
- MVP制約とTRPG体験品質の両立が困難な場合

### 品質確認ポイント
- **Event概念整合性**: data-design.mdとの完全一致
- **実装可能性**: Event処理UIの技術的実現性
- **プレイ体験**: Event処理でのTRPG体験の自然さ

## 📚 参考資料

### 主要参照文書
- [POレビュー記録](../reviews/play-session.review.md)
- [Player文脈データ設計](../02-architecture/player-context/data-design.md) - Event概念（131-238行）
- [Player文脈MVP要件定義](../02-architecture/player-context/requirements.md)

### Event概念参考
- data-design.mdのEvent概念・EventType定義
- Scene.events・Scene.startingEventId構造
- PlayRecord.eventHistory・PlayEvent構造

---

**リーダーからのメッセージ**:
POのフィードバックは、data-design.mdで詳細設計されたEvent概念が画面設計に反映されていない重要な指摘です。

Event概念は、TRPG体験の核心となるシーン中の物語進行・選択肢・会話等を統一的に管理する重要な設計です。play-session.mdにEvent処理UI/UX設計を追加し、data-design.mdとの完全な整合性を確保してください。

**作業完了後の次ステップ**: 全設計文書のPOフィードバック反映完了、最終整合性確認

#work-instruction #play-session #po-feedback #event-concept #data-design-integration #collaboration-v2