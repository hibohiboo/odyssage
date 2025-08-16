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
  startingEventId?: string; // シーンに入った時に最初に実行するイベントID

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

  // プレイ履歴（Event概念に対応）
  eventHistory: PlayEvent[]; // Event概念に対応した統一履歴管理

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

// Event概念に対応した統一履歴管理
interface PlayEvent {
  sceneId: string;
  eventId: string;
  eventType: EventType;
  actionTaken?: string; // choice選択時の選択内容
  executedAt: string; // ISO date
}

// 従来のPlayChoice - 将来機能として保持
interface PlayChoice {
  sceneId: string;
  choiceId: string;
  choiceText: string;
  selectedAt: string; // ISO date
}
```

## 🎮 サンプルデータ設計

### 「失われた森の守護者」詳細シーンデータ

#### シーン1: 森の入り口
```typescript
const forestScene001: Scene = {
  id: 'scene-forest-001',
  title: '森の入り口',
  content: `
古い森の入り口に立つと、深い緑の中から不思議な光がゆらめいているのが見える。
地元の村人たちは「最近、森で奇妙なことが起きている」と口々に語る。
動物たちが姿を消し、古い木々からは見たこともない青い光が漏れ出しているという。

足下には獣道が続いており、森の奥へと続いている。
空気は清涼で、どこか神聖さを感じさせる。
`,
  type: 'narrative',
  backgroundImageUrl: '/images/scenes/forest-entrance.jpg',
  events: [
    {
      id: 'event-001-intro',
      type: 'narrative',
      content: `村の長老があなたに語りかける。「森に異変が起きてから、もう一月が経つ。誰も森の奥まで行く勇気がない。どうか、森の真相を探ってくれないか？」`,
      data: {
        narrativeText: '長老の依頼を受け、あなたは森の調査を決意する。'
      },
      order: 1,
      isRequired: true,
      tags: ['story_intro'],
      nextEventId: 'event-001-choice'
    },
    {
      id: 'event-001-choice',
      type: 'choice',
      title: '森への進入方法',
      content: 'どのように森に入るかを決めなければならない。',
      data: {
        choices: [
          {
            id: 'choice-001-path',
            text: '獣道を慎重に歩く',
            description: '安全な道を選ぶが、時間がかかる可能性がある',
            options: [
              {
                text: '慎重に獣道を進む',
                nextEventId: 'event-002-careful'
              }
            ],
            transitionText: 'あなたは足音を立てないよう、慎重に獣道を歩き始めた。',
            type: 'strategic',
            isAvailable: true
          },
          {
            id: 'choice-001-direct',
            text: '直接森の奥へ向かう',
            description: '最短ルートだが、未知の危険が待ち受けているかもしれない',
            options: [
              {
                text: '迷わず森の奥へ',
                nextEventId: 'event-002-bold'
              }
            ],
            transitionText: 'あなたは勇敢に森の深部へと歩を進めた。',
            type: 'action',
            isAvailable: true
          },
          {
            id: 'choice-001-observe',
            text: 'まず周囲を観察する',
            description: '情報収集を優先して、慎重に状況を把握する',
            options: [
              {
                text: '森の異変を詳しく調べる',
                nextEventId: 'event-002-observe'
              }
            ],
            transitionText: 'あなたは森の入り口で立ち止まり、周囲の変化を注意深く観察した。',
            type: 'creative',
            isAvailable: true
          }
        ]
      },
      order: 2,
      isRequired: true,
      tags: ['major_choice']
    },
    {
      id: 'event-002-careful',
      type: 'narrative',
      content: '獣道を慎重に進むと、古い石碑を発見する。文字は読めないが、なぜか懐かしさを感じる。',
      data: {
        narrativeText: '石碑には古代の文字が刻まれており、森の守護者について記されているようだ。'
      },
      order: 3,
      isRequired: false,
      tags: ['careful_path'],
      nextEventId: 'event-003-stone-monument'
    },
    {
      id: 'event-002-bold',
      type: 'narrative',
      content: '森の奥に向かうと、突然青い光に包まれる。光の中から、透明な人影が現れた。',
      data: {
        narrativeText: '森の精霊が直接あなたの前に姿を現した。その表情は悲しげだ。'
      },
      order: 3,
      isRequired: false,
      tags: ['bold_path'],
      nextEventId: 'event-003-spirit-encounter'
    },
    {
      id: 'event-002-observe',
      type: 'exploration',
      content: '森の入り口周辺を詳しく調べてみる。',
      data: {
        target: '森の異変の痕跡',
        description: '木々の様子、動物の痕跡、光の発生源などを調査する。'
      },
      order: 3,
      isRequired: false,
      tags: ['observation'],
      nextEventId: 'event-003-investigation'
    },
    {
      id: 'event-003-stone-monument',
      type: 'dialogue',
      content: '石碑の前で古い記憶がよみがえる。',
      data: {
        npcName: '古の記憶',
        npcText: '「この森には古代から守護者が住んでいた。しかし、人間の欲望が森の平衡を崩してしまった...」'
      },
      order: 4,
      isRequired: false,
      tags: ['lore'],
      nextEventId: 'event-004-transition'
    },
    {
      id: 'event-003-spirit-encounter',
      type: 'dialogue',
      content: '森の精霊があなたに語りかける。',
      data: {
        npcName: '森の精霊',
        npcText: '「人間よ、なぜここに来た？この森は既に傷ついている。しかし、まだ希望はある...あなたが真の理解を示すなら。」'
      },
      order: 4,
      isRequired: false,
      tags: ['spirit_contact'],
      nextEventId: 'event-004-transition'
    },
    {
      id: 'event-003-investigation',
      type: 'narrative',
      content: '調査の結果、森の異変の原因は深部にある古い祠に関係していることが判明した。',
      data: {
        narrativeText: '手がかりを整理すると、全ての現象が森の中心部の祠から発生していることがわかる。'
      },
      order: 4,
      isRequired: false,
      tags: ['investigation_result'],
      nextEventId: 'event-004-transition'
    },
    {
      id: 'event-004-transition',
      type: 'scene_transition',
      content: '情報を得たあなたは、森の深部へと向かうことにした。',
      data: {
        targetSceneId: 'scene-forest-002',
        transitionText: '森の奥へと続く道は、ますます神秘的な光に満ちていく...'
      },
      order: 5,
      isRequired: true,
      tags: ['scene_change']
    }
  ],
  startingEventId: 'event-001-intro',
  metadata: {
    location: '古い森の入り口',
    npcs: ['村の長老', '森の精霊']
  },
  isStarting: true,
  isEnding: false
};
```

#### シーン2: 森の奥の祠
```typescript
const forestScene002: Scene = {
  id: 'scene-forest-002',
  title: '森の奥の祠',
  content: `
森の奥深くに、古い石造りの祠が佇んでいる。
祠の周りは青い光に包まれ、空気そのものが魔法に満ちているようだ。
祠の前には、人間の姿をした老人が座り込んでいる。
その表情は深い悲しみと諦めに満ちている。

祠の扉には古代の錠前がかかっており、
中から微かに歌声のようなものが聞こえてくる。
`,
  type: 'interactive',
  backgroundImageUrl: '/images/scenes/forest-shrine.jpg',
  events: [
    {
      id: 'event-005-shrine-arrival',
      type: 'narrative',
      content: '祠に近づくと、老人があなたに気づいて顔を上げる。',
      data: {
        narrativeText: '老人の瞳には深い知識と、同時に大きな後悔が宿っている。'
      },
      order: 1,
      isRequired: true,
      tags: ['arrival'],
      nextEventId: 'event-006-old-man-dialogue'
    },
    {
      id: 'event-006-old-man-dialogue',
      type: 'dialogue',
      content: '老人があなたに語りかける。',
      data: {
        npcName: '森の守護者',
        npcText: '「私は最後の森の守護者だ。長い間、この祠で森の力を守ってきた。しかし、私の力はもう限界に近い。森を救うには、新しい守護者が必要だ...」'
      },
      order: 2,
      isRequired: true,
      tags: ['guardian_reveal'],
      nextEventId: 'event-007-truth-choice'
    },
    {
      id: 'event-007-truth-choice',
      type: 'choice',
      title: '森の守護者としての選択',
      content: '森の守護者から重大な決断を迫られる。',
      data: {
        choices: [
          {
            id: 'choice-002-accept',
            text: '守護者の役割を受け入れる',
            description: '森を救うが、人間の世界を離れることになる',
            options: [
              {
                text: '森の新たな守護者となる',
                nextEventId: 'event-008-guardian-ending'
              }
            ],
            transitionText: 'あなたは森への責任を受け入れることを決意した。',
            type: 'strategic',
            isAvailable: true
          },
          {
            id: 'choice-002-alternative',
            text: '別の解決方法を探す',
            description: '森と人間の世界の両方を救う道を模索する',
            options: [
              {
                text: '調和の道を選ぶ',
                nextEventId: 'event-008-harmony-ending'
              }
            ],
            transitionText: 'あなたは新しい可能性を信じて、別の道を歩むことにした。',
            type: 'creative',
            isAvailable: true
          },
          {
            id: 'choice-002-refuse',
            text: '責任を負いかねる',
            description: '森を救えないが、自分の人生を保持する',
            options: [
              {
                text: '重荷を背負えない',
                nextEventId: 'event-008-departure-ending'
              }
            ],
            transitionText: 'あなたは重すぎる責任から逃れることを選んだ。',
            type: 'action',
            isAvailable: true
          }
        ]
      },
      order: 3,
      isRequired: true,
      tags: ['final_choice', 'life_changing']
    },
    {
      id: 'event-008-guardian-ending',
      type: 'scene_transition',
      content: 'あなたは森の新たな守護者として、永遠に森を守ることになった。',
      data: {
        targetSceneId: 'ending-sacrifice',
        transitionText: '森は救われたが、あなたは人間の世界を永遠に離れることになった...'
      },
      order: 4,
      isRequired: false,
      tags: ['sacrifice_ending']
    },
    {
      id: 'event-008-harmony-ending',
      type: 'scene_transition',
      content: 'あなたは森と人間の新しい関係を築く道を選んだ。',
      data: {
        targetSceneId: 'ending-harmony',
        transitionText: '森と人間の世界に新たな調和が生まれる可能性が開かれた...'
      },
      order: 4,
      isRequired: false,
      tags: ['harmony_ending']
    },
    {
      id: 'event-008-departure-ending',
      type: 'scene_transition',
      content: 'あなたは森を離れ、村に戻ることにした。',
      data: {
        targetSceneId: 'ending-corruption',
        transitionText: '森は徐々に力を失い、やがて枯れ果ててしまうだろう...'
      },
      order: 4,
      isRequired: false,
      tags: ['departure_ending']
    }
  ],
  startingEventId: 'event-005-shrine-arrival',
  metadata: {
    location: '森の奥の古い祠',
    npcs: ['森の守護者（老人）']
  },
  isStarting: false,
  isEnding: false
};
```

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
    scenes: [forestScene001, forestScene002], // 上記の詳細シーンデータ
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
    scenes: [], // 簡略化（MVP範囲）
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

### サンプルセッションデータ（MVP版）

```typescript
const sampleSessions: Session[] = [
  {
    id: 'session-001',
    scenarioId: 'fantasy-001',
    title: '失われた森の守護者 - 深夜セッション',
    status: 'active',
    currentSceneId: 'scene-forest-002',
    playerCount: {
      current: 3,
      max: 4
    },
    participants: [
      {
        playerId: 'player-001',
        playerName: '冒険者タクミ',
        role: 'player',
        joinedAt: '2025-08-16T20:30:00Z',
        lastSeenAt: '2025-08-16T22:15:00Z',
        status: 'active'
      },
      {
        playerId: 'player-002',
        playerName: '探索者サキ',
        role: 'player',
        joinedAt: '2025-08-16T20:35:00Z',
        lastSeenAt: '2025-08-16T22:14:00Z',
        status: 'active'
      },
      {
        playerId: 'player-003',
        playerName: '学者ヒロシ',
        role: 'player',
        joinedAt: '2025-08-16T20:45:00Z',
        lastSeenAt: '2025-08-16T22:10:00Z',
        status: 'active'
      }
    ],
    gamemaster: {
      id: 'gm-001',
      name: 'GMマスター川上'
    },
    startedAt: '2025-08-16T20:30:00Z',
    lastActivityAt: '2025-08-16T22:15:00Z',
    settings: {
      isPublic: false,
      autoSave: true
    },
    createdAt: '2025-08-16T20:00:00Z',
    updatedAt: '2025-08-16T22:15:00Z'
  },

  {
    id: 'session-002',
    scenarioId: 'adventure-001',
    title: '薬草採取の旅 - 初心者歓迎',
    status: 'recruiting',
    currentSceneId: 'scene-village-001',
    playerCount: {
      current: 1,
      max: 3
    },
    participants: [
      {
        playerId: 'player-004',
        playerName: '薬師見習いユイ',
        role: 'player',
        joinedAt: '2025-08-16T19:00:00Z',
        lastSeenAt: '2025-08-16T21:30:00Z',
        status: 'active'
      }
    ],
    gamemaster: {
      id: 'gm-002',
      name: 'GM鈴木'
    },
    startedAt: '2025-08-16T19:00:00Z',
    lastActivityAt: '2025-08-16T21:30:00Z',
    settings: {
      isPublic: true,
      autoSave: true
    },
    createdAt: '2025-08-16T18:30:00Z',
    updatedAt: '2025-08-16T21:30:00Z'
  },

  {
    id: 'session-003',
    scenarioId: 'fantasy-001',
    title: '失われた森の守護者 - 完結編',
    status: 'completed',
    currentSceneId: 'ending-harmony',
    playerCount: {
      current: 2,
      max: 4
    },
    participants: [
      {
        playerId: 'player-005',
        playerName: '賢者エリカ',
        role: 'player',
        joinedAt: '2025-08-15T19:00:00Z',
        lastSeenAt: '2025-08-15T21:45:00Z',
        status: 'offline'
      },
      {
        playerId: 'player-006',
        playerName: '戦士レン',
        role: 'player',
        joinedAt: '2025-08-15T19:10:00Z',
        lastSeenAt: '2025-08-15T21:45:00Z',
        status: 'offline'
      }
    ],
    gamemaster: {
      id: 'gm-003',
      name: 'GM田中'
    },
    startedAt: '2025-08-15T19:00:00Z',
    lastActivityAt: '2025-08-15T21:45:00Z',
    settings: {
      isPublic: true,
      autoSave: true
    },
    createdAt: '2025-08-15T18:30:00Z',
    updatedAt: '2025-08-15T21:45:00Z'
  }
];
```

### サンプルプレイ記録データ（Event概念対応）

```typescript
const samplePlayRecords: PlayRecord[] = [
  {
    id: 'record-001',
    playerId: 'player-005',
    sessionId: 'session-003',
    scenarioId: 'fantasy-001',
    completionStatus: 'completed',
    endingSceneId: 'ending-harmony',
    eventHistory: [
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-001-intro',
        eventType: 'narrative',
        executedAt: '2025-08-15T19:05:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-001-choice',
        eventType: 'choice',
        actionTaken: '周囲を観察する',
        executedAt: '2025-08-15T19:07:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-002-observe',
        eventType: 'exploration',
        executedAt: '2025-08-15T19:10:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-003-investigation',
        eventType: 'narrative',
        executedAt: '2025-08-15T19:15:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-004-transition',
        eventType: 'scene_transition',
        executedAt: '2025-08-15T19:20:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-005-shrine-arrival',
        eventType: 'narrative',
        executedAt: '2025-08-15T19:25:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-006-old-man-dialogue',
        eventType: 'dialogue',
        executedAt: '2025-08-15T19:30:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-007-truth-choice',
        eventType: 'choice',
        actionTaken: '別の解決方法を探す',
        executedAt: '2025-08-15T21:30:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-008-harmony-ending',
        eventType: 'scene_transition',
        executedAt: '2025-08-15T21:40:00Z'
      }
    ],
    startedAt: '2025-08-15T19:00:00Z',
    completedAt: '2025-08-15T21:45:00Z',
    totalPlayTime: 9900, // 2時間45分
    notes: '森と人間の調和エンディングを達成。探索重視のプレイスタイルが功を奏した。',
    rating: 5
  },

  {
    id: 'record-002',
    playerId: 'player-001',
    sessionId: 'session-001',
    scenarioId: 'fantasy-001',
    completionStatus: 'in_progress',
    eventHistory: [
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-001-intro',
        eventType: 'narrative',
        executedAt: '2025-08-16T20:35:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-001-choice',
        eventType: 'choice',
        actionTaken: '直接森の奥へ向かう',
        executedAt: '2025-08-16T20:40:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-002-bold',
        eventType: 'narrative',
        executedAt: '2025-08-16T20:45:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-003-spirit-encounter',
        eventType: 'dialogue',
        executedAt: '2025-08-16T20:50:00Z'
      },
      {
        sceneId: 'scene-forest-001',
        eventId: 'event-004-transition',
        eventType: 'scene_transition',
        executedAt: '2025-08-16T21:00:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-005-shrine-arrival',
        eventType: 'narrative',
        executedAt: '2025-08-16T21:10:00Z'
      },
      {
        sceneId: 'scene-forest-002',
        eventId: 'event-006-old-man-dialogue',
        eventType: 'dialogue',
        executedAt: '2025-08-16T21:20:00Z'
      }
    ],
    startedAt: '2025-08-16T20:30:00Z',
    totalPlayTime: 6300, // 1時間45分（進行中）
    notes: '勇敢なアプローチで精霊と早期接触。現在重要な選択を検討中。'
  },

  {
    id: 'record-003',
    playerId: 'player-004',
    sessionId: 'session-002',
    scenarioId: 'adventure-001',
    completionStatus: 'in_progress',
    eventHistory: [
      {
        sceneId: 'scene-village-001',
        eventId: 'event-village-intro',
        eventType: 'narrative',
        executedAt: '2025-08-16T19:05:00Z'
      },
      {
        sceneId: 'scene-village-001',
        eventId: 'event-mother-dialogue',
        eventType: 'dialogue',
        executedAt: '2025-08-16T19:10:00Z'
      }
    ],
    startedAt: '2025-08-16T19:00:00Z',
    totalPlayTime: 9000, // 2時間30分（進行中）
    notes: '薬師見習いとして丁寧な物語進行。じっくりと世界観を理解中。'
  }
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
- 2025-08-16: Event概念対応版（Scene.startingEventId追加・PlayRecord.eventHistory対応・PlayEvent構造追加）
- 2025-08-16: **サンプルデータ拡充版**（「失われた森の守護者」詳細シーン・セッション・プレイ記録サンプル追加）

#player-context #mock-data #json-design #trpg-scenarios #data-modeling #mvp-design
