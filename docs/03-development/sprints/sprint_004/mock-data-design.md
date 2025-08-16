# Player文脈モックデータ設計書（MVP版）

## 📅 設計概要

**作成日**: 2025-08-16  
**更新日**: 2025-08-16 (レビュー修正版)  
**対象範囲**: Player文脈MVP モックデータ構造設計  
**データ戦略**: JSON静的データ + LocalStorage永続化  
**MVP方針**: 最小限の機能で実装可能なデータ構造

## 🎯 モックデータ設計理念

### データ品質目標

```markdown
## 高品質モックデータの定義

1. **リアルさ**: 実際のTRPGセッションを忠実に再現
2. **多様性**: 異なるジャンル・プレイスタイルに対応
3. **体験価値**: プレイヤーが価値を感じる内容・展開
4. **技術適合**: フロントエンド実装に最適化された構造

## データ作成方針

- **物語品質**: 魅力的なストーリー・キャラクター設定
- **選択意義**: プレイヤーの選択に意味・重みがある
- **結末多様性**: 複数の結末ルートで再プレイ価値を提供
- **進行感**: セッション進行の実感・達成感の演出
```

### MVP範囲データ要件

```typescript
interface MockDataScope {
  scenarios: {
    count: '2シナリオ（MVP最小構成）';
    focus: ['失われた森の守護者', '薬草採取の旅'];
    quality: '各シナリオ30-45分の体験時間';
  };

  sessions: {
    active_sessions: '3セッション以下（MVP検証用）';
    participation_states: ['参加可能', '参加中', '完了済み'];
  };

  play_records: {
    sample_histories: '最小限の完了セッション履歴';
    choice_patterns: '基本的な選択パターンの記録';
  };
}
```

## 🏗️ 主要エンティティ設計

### 1. Scenario（シナリオ）データ構造

```typescript
interface Scenario {
  // 基本情報
  id: string;
  title: string;
  overview: string; // 200-300文字の魅力的な概要

  // メタデータ（MVP最小限）
  estimatedPlayTime: number; // 分単位
  playerCount: {
    min: number;
    max: number;
  };

  // 物語構造
  scenes: Scene[];
  startingSceneId: string;
  endingSceneIds: string[];

  // 追加情報（MVP最小限）
  tags: string[];
  thumbnailUrl: string;
  author: {
    name: string;
  };

  // システム情報
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  version: string;
  isPublic: boolean;
}

// MVP版では、カテゴリや難易度をenumで制限せず、柔軟性を確保
// 将来的に必要になった場合は、文字列型で管理することで拡張性を保つ
```

### 2. Scene（シーン）データ構造

```typescript
interface Scene {
  // 基本情報
  id: string;
  title: string;
  content: string; // マークダウン形式の物語テキスト
  type: SceneType;

  // ビジュアル要素（MVP最小限）
  backgroundImageUrl?: string;

  // Event概念の導入（TRPG的なイベント集合体として）
  events: Event[];

  // システム情報（MVP最小限）
  metadata: {
    location?: string;
    npcs?: string[];
  };

  // 従来の情報
  isStarting: boolean;
  isEnding: boolean;
}

type SceneType =
  | 'narrative' // 物語進行
  | 'interactive' // イベント主体のシーン
  | 'exploration' // 探索・発見
  | 'resolution'; // 解決・結末

// Event概念の導入でChoiceはEventの一種として扱う
```

### 3. Event（イベント）データ構造

```typescript
interface Event {
  // 基本情報
  id: string;
  type: EventType;
  title?: string; // イベントの見出し（選択肢以外で使用）
  content?: string; // イベントの説明・テキスト

  // イベント固有データ（type によって使い分け）
  data: EventData;

  // システム情報
  order: number; // シーン内での実行順序
  isRequired: boolean; // 必須イベントかどうか
  tags: string[];
  nextEventId?: string; // 次のイベントID（通常イベント用）
}

type EventType =
  | 'choice' // 選択肢（従来のChoice）- MVP必須
  | 'narrative' // 物語進行（テキスト表示）- MVP必須
  | 'dialogue' // NPC会話 - MVP最小限実装
  | 'scene_transition' // シーン移動専用イベント - MVP必須
  | 'exploration' // 探索アクション - MVP最小限実装
  | 'item_acquire' // アイテム獲得 - 将来拡張
  | 'skill_use' // スキル使用 - 将来拡張
  | 'condition'; // 条件判定 - 将来拡張

// EventType別のデータ構造（MVP版）
type EventData =
  | ChoiceEventData // MVP必須
  | NarrativeEventData // MVP必須
  | DialogueEventData // MVP最小限
  | SceneTransitionEventData // MVP必須
  | ExplorationEventData // MVP最小限
  | ItemAcquireEventData // 将来拡張用（型のみ定義）
  | SkillUseEventData // 将来拡張用（型のみ定義）
  | ConditionEventData; // 将来拡張用（型のみ定義）

// 選択肢イベント（従来のChoiceを包含）
interface ChoiceEventData {
  choices: Choice[];
}

interface Choice {
  id: string;
  text: string; // プレイヤーに表示される選択肢テキスト
  description?: string; // 選択肢の詳細説明・予想結果
  options: {
    text: string;
    nextEventId: string; // 各選択肢が次のイベントを直接指定
  }[];
  transitionText?: string; // 選択後の遷移テキスト
  type: ChoiceActionType;
  isAvailable: boolean;
}

type ChoiceActionType =
  | 'action' // 行動選択
  | 'dialogue' // 会話選択
  | 'strategic' // 戦略的判断
  | 'creative'; // 創造的解決

// MVP必須 - 物語進行イベント
interface NarrativeEventData {
  narrativeText: string;
}

// MVP必須 - シーン移動専用イベント
interface SceneTransitionEventData {
  targetSceneId: string; // 移動先シーンID
  transitionText?: string; // 移動時の説明テキスト
}

// MVP最小限実装 - 簡略化されたイベントデータ
interface DialogueEventData {
  npcName: string;
  npcText: string;
  // MVP版では選択肢は別のChoiceEventで管理
}

interface ExplorationEventData {
  target: string; // 探索対象
  description: string;
  // MVP版では結果は単純なテキスト表示のみ
}

// 将来拡張用（型定義のみ、MVP実装対象外）
interface ItemAcquireEventData {
  itemName: string;
  itemDescription: string;
  acquisitionText: string;
}

interface SkillUseEventData {
  skillName: string;
  target: string;
  effect: string;
}

interface ConditionEventData {
  condition: string; // 条件の説明
  successPath: string; // 成功時のシーンID
  failurePath: string; // 失敗時のシーンID
}
```

### 4. Session（セッション）データ構造

```typescript
interface Session {
  // 基本情報
  id: string;
  scenarioId: string;
  title: string; // セッション名（シナリオタイトルベース）

  // セッション状態
  status: SessionStatus;
  currentSceneId: string;
  playerCount: {
    current: number;
    max: number;
  };

  // 参加者情報（MVP最小限）
  participants: SessionParticipant[];
  gamemaster?: {
    id: string;
    name: string;
  };

  // 進行状況（MVP最小限）
  startedAt: string; // ISO date
  lastActivityAt: string; // ISO date

  // セッション設定（MVP最小限）
  settings: {
    isPublic: boolean;
    autoSave: boolean;
  };

  // システム情報
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

type SessionStatus =
  | 'recruiting' // 参加者募集中
  | 'active' // 進行中
  | 'completed'; // 完了

interface SessionParticipant {
  playerId: string;
  playerName: string;
  role: 'player' | 'gm';
  joinedAt: string; // ISO date
  lastSeenAt: string; // ISO date
  status: 'active' | 'offline';
}
```

### 5. PlayRecord（プレイ記録）データ構造

```typescript
interface PlayRecord {
  // 基本情報
  id: string;
  playerId: string;
  sessionId: string;
  scenarioId: string;

  // プレイ結果（MVP最小限）
  completionStatus: CompletionStatus;
  endingSceneId?: string;

  // プレイ履歴（MVP最小限）
  choiceHistory: PlayChoice[];

  // 時間情報（MVP最小限）
  startedAt: string; // ISO date
  completedAt?: string; // ISO date
  totalPlayTime: number; // 秒単位

  // メタデータ（MVP最小限）
  notes?: string; // プレイヤーのメモ
  rating?: number; // 1-5の評価
}

type CompletionStatus =
  | 'completed' // 完了
  | 'in_progress'; // 進行中

interface PlayChoice {
  sceneId: string;
  choiceId: string;
  choiceText: string;
  selectedAt: string; // ISO date
}
```

## 🎮 サンプルデータ設計

### サンプルシナリオ一覧（MVP版）

```typescript
const sampleScenarios: Scenario[] = [
  {
    id: 'fantasy-001',
    title: '失われた森の守護者',
    overview:
      '古い森で起きる不思議な現象を調査する冒険者の物語。森の奥に眠る古代の秘密と、それを守る謎の存在との出会いが待っている。あなたの選択が森の運命、そして世界の平衡を決めることになる。',
    estimatedPlayTime: 45,
    playerCount: { min: 1, max: 4 },
    scenes: [], // 後述の詳細シーンデータ
    startingSceneId: 'scene-forest-001',
    endingSceneIds: ['ending-harmony', 'ending-sacrifice', 'ending-corruption'],
    tags: ['森', '古代', '神秘', '選択の重み'],
    thumbnailUrl: '/images/scenarios/forest-guardian-thumb.jpg',
    author: {
      name: '川上　雅史',
    },
    createdAt: '2025-08-10T09:00:00Z',
    updatedAt: '2025-08-15T14:30:00Z',
    version: '1.2.0',
    isPublic: true,
  },

  {
    id: 'adventure-001',
    title: '薬草採取の旅',
    overview:
      '病気の母を救うため、伝説の薬草を求めて危険な山奥へと向かう若者の物語。道中で出会う旅人たち、危険な魔物、そして薬草を守る精霊たち。あなたは本当に大切なものが何かを学ぶことになる。',
    estimatedPlayTime: 35,
    playerCount: { min: 1, max: 3 },
    scenes: [],
    startingSceneId: 'scene-village-001',
    endingSceneIds: ['ending-healing', 'ending-sacrifice', 'ending-wisdom'],
    tags: ['家族', '薬草', '冒険', '成長'],
    thumbnailUrl: '/images/scenarios/herb-journey-thumb.jpg',
    author: {
      name: '鈴木　太郎',
    },
    createdAt: '2025-08-07T13:15:00Z',
    updatedAt: '2025-08-12T09:20:00Z',
    version: '1.0.0',
    isPublic: true,
  },
];
```

## 🔮 将来機能の記録

### プレイヤーからGMへの選択肢提案機能（Phase 2以降）

**要件**: プレイヤーがシーンで提示された選択肢以外の行動を提案し、GMが承認・却下できる機能

**MVP範囲外とする理由**:

- リアルタイム通知システムが必要（WebSocket等）
- GM-Player間の複雑な相互作用が必要
- 動的なシーン・選択肢生成が必要
- MVP目標「2シナリオ、3セッション以下」に対して過度に複雑

**詳細仕様**: [future-player-choice-proposal-feature.md](future-player-choice-proposal-feature.md)

### Event概念とイベントリンク構造

**決定事項**: 選択肢2と3の併用によるハイブリッド構造

#### 通常イベント（narrative、dialogue、scene_transition等）

- `nextEventId`: 次のイベントへの直接リンク（1対1関係）
- シンプルな直線的進行を実現

#### choiceイベント（特別仕様）

- `options配列`: 各選択肢が`nextEventId`を持つ
- プレイヤーの選択によって分岐
- 複数の選択肢から1つを選択する機能

#### scene_transitionイベント（新規追加）

- choiceからシーン移動機能を分離
- 専用のシーン移動イベントとして独立
- シーン間遷移の明確化

### TRPGフロー設計例

```
narrative → choice (A→narrative, B→dialogue) → scene_transition
```

### Event概念のMVP簡略化

**MVP版での制限事項**:

- `dialogue`, `exploration`, `item_acquire`, `skill_use` イベントは最小限の実装
- MVP段階では主に `choice`、`narrative`、`scene_transition` イベントに集中
- 他のEventTypeは将来拡張として位置づけ

### 削除されたMVP外機能一覧

以下の機能はMVP範囲外として削除：

- ~~moodTag（完全削除）~~
- カテゴリ・難易度システム
- 詳細統計（プレイ記録の分析データ）
- BGM・ムード管理
- セッション進捗詳細（estimatedCompletionTime等）
- 選択肢の重み・結果システム
- スペクテーター機能
- プレイスタイル分類
- プレイヤー選択肢提案機能（独立文書化済み）

## 📈 Phase別データ準備計画（MVP版）

### Phase 1: MVP必須データ（今週完了目標）

```markdown
## 最優先データ（2シナリオ）

✅ **「失われた森の守護者」** - MVP版（基本機能のみ）
✅ **「薬草採取の旅」** - MVP版（基本機能のみ）

## 各シナリオ必須要素

- 8-10シーンの基本的な物語
- 2つ以上の結末ルート
- 1-2の進行中セッション
- 1つのサンプルプレイ記録

## データファイル構成

- scenario データJSON（2ファイル）
- session データJSON（1ファイル）
- play-record データJSON（1ファイル）
```

### MVP設計での実装制約事項

1. **データ数制限**: シナリオは2つのみ、セッションは3つ以下
2. **機能制限**: 基本的な選択と遷移のみ、高度な分岐や統計は除外
3. **UI制限**: シンプルな表示、複雑なビジュアル効果は後回し
4. **拡張性確保**: 将来機能追加時の設計変更コストを最小化

## 🔧 技術実装詳細（MVP版）

削除された実装詳細：

- データローダー設計
- バリデーション・型安全性
- データ検証スクリプト

**理由**: これらは実装段階で決定すべき詳細であり、設計段階では要件が不明確

## 📝 メタデータ

**作成者**: 設計担当Claude Code  
**承認者**: リーダー（承認待ち）  
**関連文書**:

- [player-context-requirements.md](player-context-requirements.md)
- [player-context-architecture.md](player-context-architecture.md)
- [player-ui-ux-design.md](player-ui-ux-design.md)
- [PROJECT_VISION.md](../../PROJECT_VISION.md)

**更新履歴**:

- 2025-08-16: 初版作成（設計担当）
- 2025-08-16: レビュー修正版（MVP化・実装詳細削除・将来機能記録）
- 2025-08-16: Event概念導入版（設計決定反映・選択肢提案機能分離）
- 2025-08-16: 緊急修正版（moodTag削除・イベントリンク構造確定・scene_transition追加）

#player-context #mock-data #json-design #trpg-scenarios #data-modeling #mvp-design
