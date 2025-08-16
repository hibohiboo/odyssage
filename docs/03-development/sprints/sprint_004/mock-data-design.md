# Player文脈モックデータ設計書

## 📅 設計概要

**作成日**: 2025-08-16  
**対象範囲**: Player文脈MVP モックデータ構造設計  
**データ戦略**: JSON静的データ + LocalStorage永続化  
**リアル体験**: 実際のTRPG体験を模擬する高品質データ

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
    count: "5-8シナリオ（多様なジャンル・難易度）";
    quality: "各シナリオ30-60分の体験時間";
    variety: ["fantasy", "scifi", "mystery", "horror", "adventure"];
  };
  
  sessions: {
    active_sessions: "各シナリオ2-3の進行中セッション";
    participation_states: ["参加可能", "参加中", "完了済み"];
    player_diversity: "多様なプレイヤー参加状況を模擬";
  };
  
  play_records: {
    sample_histories: "各プレイヤー3-5の完了セッション履歴";
    choice_patterns: "異なる選択パターンの記録";
    completion_variety: "複数結末到達の履歴";
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
  category: ScenarioCategory;
  
  // メタデータ
  difficulty: DifficultyLevel;
  estimatedPlayTime: number; // 分単位
  playerCount: {
    min: number;
    max: number;
    recommended: number;
  };
  
  // 物語構造
  scenes: Scene[];
  startingSceneId: string;
  endingSceneIds: string[];
  
  // 追加情報
  tags: string[];
  thumbnailUrl: string;
  backgroundImageUrl: string;
  author: {
    name: string;
    profile?: string;
  };
  
  // システム情報
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  version: string;
  isPublic: boolean;
  stats: {
    totalPlays: number;
    averageRating: number;
    completionRate: number;
  };
}

type ScenarioCategory = 
  | 'fantasy' 
  | 'scifi' 
  | 'mystery' 
  | 'horror' 
  | 'adventure' 
  | 'drama' 
  | 'comedy';

type DifficultyLevel = 
  | 'beginner'    // 初心者向け・明確な選択肢
  | 'intermediate' // 中級者向け・複雑な選択
  | 'advanced'    // 上級者向け・高度な判断が必要
  | 'expert';     // エキスパート向け・非常に複雑
```

### 2. Scene（シーン）データ構造

```typescript
interface Scene {
  // 基本情報
  id: string;
  title: string;
  content: string; // マークダウン形式の物語テキスト
  type: SceneType;
  
  // ビジュアル要素
  backgroundImageUrl?: string;
  mood: SceneMood;
  bgm?: {
    url: string;
    title: string;
    loop: boolean;
  };
  
  // ゲーム進行
  choices: Choice[];
  isStarting: boolean;
  isEnding: boolean;
  chapterIndex?: number;
  
  // システム情報
  estimatedReadTime: number; // 秒単位
  metadata: {
    location?: string;
    timeOfDay?: string;
    weather?: string;
    npcs?: string[];
  };
}

type SceneType = 
  | 'narrative'    // 物語進行
  | 'choice'       // 重要な選択
  | 'exploration'  // 探索・発見
  | 'confrontation' // 対立・戦闘
  | 'resolution'   // 解決・結末
  | 'transition';  // 場面転換

type SceneMood = 
  | 'peaceful' 
  | 'tense' 
  | 'mysterious' 
  | 'dramatic' 
  | 'action' 
  | 'melancholy' 
  | 'triumphant';
```

### 3. Choice（選択肢）データ構造

```typescript
interface Choice {
  // 基本情報
  id: string;
  text: string; // プレイヤーに表示される選択肢テキスト
  description?: string; // 選択肢の詳細説明・予想結果
  
  // 遷移情報
  nextSceneId: string;
  transitionText?: string; // 選択後の遷移テキスト
  
  // 選択特性
  difficulty: ChoiceDifficulty;
  consequences: ChoiceConsequence[];
  requirements?: ChoiceRequirement[];
  
  // メタデータ
  type: ChoiceType;
  weight: number; // 物語への影響度 (1-10)
  tags: string[];
  
  // システム情報
  isAvailable: boolean; // 常時利用可能かどうか
  conditions?: ChoiceCondition[];
}

type ChoiceDifficulty = 
  | 'easy'      // 明確で安全な選択
  | 'moderate'  // 適度なリスク・判断が必要
  | 'hard'      // 高いリスク・重要な判断
  | 'critical'; // 物語の核心に関わる重大な選択

type ChoiceConsequence = 
  | 'story_branch'  // 物語分岐
  | 'character_change' // キャラクター変化
  | 'item_gain'     // アイテム獲得
  | 'item_loss'     // アイテム喪失
  | 'relationship_change' // 関係性変化
  | 'ending_unlock'; // 結末解放

type ChoiceType = 
  | 'action'     // 行動選択
  | 'dialogue'   // 会話選択
  | 'moral'      // 道徳的判断
  | 'strategic'  // 戦略的判断
  | 'creative'   // 創造的解決
  | 'risk';      // リスク判断

interface ChoiceCondition {
  type: 'previous_choice' | 'item_possession' | 'flag_state';
  target: string;
  value: any;
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
  
  // 参加者情報
  participants: SessionParticipant[];
  gamemaster?: {
    id: string;
    name: string;
    avatar?: string;
  };
  
  // 進行状況
  startedAt: string; // ISO date
  lastActivityAt: string; // ISO date
  estimatedCompletionTime?: string; // ISO date
  progress: {
    scenesCompleted: number;
    totalScenes: number;
    percentage: number;
  };
  
  // セッション設定
  settings: {
    isPublic: boolean;
    allowSpectators: boolean;
    autoSave: boolean;
    playStyle: PlayStyle;
  };
  
  // システム情報
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

type SessionStatus = 
  | 'recruiting'  // 参加者募集中
  | 'active'      // 進行中
  | 'paused'      // 一時停止
  | 'completed'   // 完了
  | 'cancelled';  // キャンセル

type PlayStyle = 
  | 'narrative'   // 物語重視
  | 'exploration' // 探索重視
  | 'social'      // 対話重視
  | 'challenge';  // 挑戦重視

interface SessionParticipant {
  playerId: string;
  playerName: string;
  avatar?: string;
  role: 'player' | 'gm' | 'spectator';
  joinedAt: string; // ISO date
  lastSeenAt: string; // ISO date
  status: 'active' | 'away' | 'offline';
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
  
  // プレイ結果
  completionStatus: CompletionStatus;
  endingSceneId?: string;
  finalScore?: number;
  
  // プレイ履歴
  choiceHistory: PlayChoice[];
  sceneVisitHistory: SceneVisit[];
  
  // 時間情報
  startedAt: string; // ISO date
  completedAt?: string; // ISO date
  totalPlayTime: number; // 秒単位
  sessionBreaks: PlayBreak[];
  
  // 分析データ
  statistics: {
    totalChoices: number;
    uniqueScenesVisited: number;
    backtrackCount: number;
    difficultChoicesCount: number;
    averageDecisionTime: number; // 秒単位
  };
  
  // メタデータ
  tags: string[]; // プレイスタイルのタグ
  notes?: string; // プレイヤーのメモ
  rating?: number; // 1-5の評価
}

type CompletionStatus = 
  | 'completed'     // 完了
  | 'in_progress'   // 進行中
  | 'abandoned'     // 途中放棄
  | 'failed';       // 失敗終了

interface PlayChoice {
  sceneId: string;
  choiceId: string;
  choiceText: string;
  selectedAt: string; // ISO date
  decisionTimeSeconds: number;
  alternativesConsidered?: string[]; // 検討した他の選択肢ID
}

interface SceneVisit {
  sceneId: string;
  visitedAt: string; // ISO date
  timeSpentSeconds: number;
  isFirstVisit: boolean;
}

interface PlayBreak {
  startedAt: string; // ISO date
  resumedAt: string; // ISO date
  durationSeconds: number;
  reason?: 'pause' | 'interruption' | 'deliberation';
}
```

## 🎮 サンプルデータ設計

### サンプルシナリオ一覧

```typescript
const sampleScenarios: Scenario[] = [
  {
    id: "fantasy-001",
    title: "失われた森の守護者",
    overview: "古い森で起きる不思議な現象を調査する冒険者の物語。森の奥に眠る古代の秘密と、それを守る謎の存在との出会いが待っている。あなたの選択が森の運命、そして世界の平衡を決めることになる。",
    category: "fantasy",
    difficulty: "beginner",
    estimatedPlayTime: 45,
    playerCount: { min: 1, max: 4, recommended: 2 },
    scenes: [], // 後述の詳細シーンデータ
    startingSceneId: "scene-forest-001",
    endingSceneIds: ["ending-harmony", "ending-sacrifice", "ending-corruption"],
    tags: ["森", "古代", "神秘", "選択の重み"],
    thumbnailUrl: "/images/scenarios/forest-guardian-thumb.jpg",
    backgroundImageUrl: "/images/scenarios/forest-guardian-bg.jpg",
    author: {
      name: "川上　雅史",
      profile: "TRPG歴15年のシナリオライター"
    },
    createdAt: "2025-08-10T09:00:00Z",
    updatedAt: "2025-08-15T14:30:00Z",
    version: "1.2.0",
    isPublic: true,
    stats: {
      totalPlays: 234,
      averageRating: 4.6,
      completionRate: 0.87
    }
  },
  
  {
    id: "scifi-001", 
    title: "火星植民地の陰謀",
    overview: "西暦2157年、火星第一植民地で起きた謎の事件の真相を追う。宇宙船の技術者として派遣されたあなたは、次第に植民地政府の暗部に巻き込まれていく。科学技術と人間性の狭間で下す決断が、人類の未来を左右する。",
    category: "scifi",
    difficulty: "intermediate",
    estimatedPlayTime: 75,
    playerCount: { min: 1, max: 3, recommended: 2 },
    scenes: [],
    startingSceneId: "scene-mars-001",
    endingSceneIds: ["ending-revelation", "ending-cover-up", "ending-rebellion"],
    tags: ["火星", "陰謀", "技術倫理", "宇宙植民"],
    thumbnailUrl: "/images/scenarios/mars-conspiracy-thumb.jpg",
    backgroundImageUrl: "/images/scenarios/mars-conspiracy-bg.jpg",
    author: {
      name: "田中　美紀",
      profile: "SF作家・TRPG愛好家"
    },
    createdAt: "2025-08-12T16:00:00Z",
    updatedAt: "2025-08-14T10:15:00Z",
    version: "1.0.0",
    isPublic: true,
    stats: {
      totalPlays: 89,
      averageRating: 4.3,
      completionRate: 0.72
    }
  },
  
  {
    id: "mystery-001",
    title: "古書店の消失事件",
    overview: "老舗古書店で起きた店主失踪事件を調査する探偵の物語。店内に残された謎めいた手がかりと、店主の過去に隠された秘密が徐々に明らかになる。真実に近づくほど、事件の闇は深まっていく。",
    category: "mystery",
    difficulty: "intermediate",
    estimatedPlayTime: 60,
    playerCount: { min: 1, max: 2, recommended: 1 },
    scenes: [],
    startingSceneId: "scene-bookstore-001",
    endingSceneIds: ["ending-truth", "ending-mystery", "ending-tragedy"],
    tags: ["推理", "古書", "失踪", "秘密"],
    thumbnailUrl: "/images/scenarios/bookstore-mystery-thumb.jpg",
    backgroundImageUrl: "/images/scenarios/bookstore-mystery-bg.jpg",
    author: {
      name: "佐藤　龍也",
      profile: "推理小説愛好家・TRPG GM歴10年"
    },
    createdAt: "2025-08-08T11:30:00Z",
    updatedAt: "2025-08-13T18:45:00Z",
    version: "1.1.0",
    isPublic: true,
    stats: {
      totalPlays: 156,
      averageRating: 4.5,
      completionRate: 0.81
    }
  },
  
  {
    id: "horror-001",
    title: "廃校舎の夜",
    overview: "取り壊し予定の古い校舎で一夜を過ごすことになった高校生たちの恐怖体験。学校の歴史に隠された忌まわしい過去が、現在の生徒たちを脅かす。恐怖と戦いながら、夜明けまで生き残ることができるか。",
    category: "horror",
    difficulty: "advanced",
    estimatedPlayTime: 90,
    playerCount: { min: 2, max: 5, recommended: 4 },
    scenes: [],
    startingSceneId: "scene-school-001",
    endingSceneIds: ["ending-survival", "ending-sacrifice", "ending-possession", "ending-revelation"],
    tags: ["ホラー", "学校", "過去の秘密", "サバイバル"],
    thumbnailUrl: "/images/scenarios/school-horror-thumb.jpg",
    backgroundImageUrl: "/images/scenarios/school-horror-bg.jpg",
    author: {
      name: "山田　恵子",
      profile: "ホラー映画監督・TRPG愛好家"
    },
    createdAt: "2025-08-05T20:00:00Z",
    updatedAt: "2025-08-11T22:30:00Z",
    version: "1.3.0",
    isPublic: true,
    stats: {
      totalPlays: 298,
      averageRating: 4.8,
      completionRate: 0.65
    }
  },
  
  {
    id: "adventure-001",
    title: "海賊船の財宝",
    overview: "沈没した海賊船に眠る伝説の財宝を求める冒険活劇。海底遺跡の探索から始まり、現代の財宝ハンターたちとの駆け引き、そして財宝に込められた海賊の意志との対面へ。冒険の果てに何を選択するか。",
    category: "adventure",
    difficulty: "beginner",
    estimatedPlayTime: 50,
    playerCount: { min: 1, max: 4, recommended: 3 },
    scenes: [],
    startingSceneId: "scene-port-001",
    endingSceneIds: ["ending-treasure", "ending-legacy", "ending-friendship"],
    tags: ["海賊", "財宝", "冒険", "友情"],
    thumbnailUrl: "/images/scenarios/pirate-treasure-thumb.jpg",
    backgroundImageUrl: "/images/scenarios/pirate-treasure-bg.jpg",
    author: {
      name: "鈴木　太郎",
      profile: "冒険小説作家・ダイビングインストラクター"
    },
    createdAt: "2025-08-07T13:15:00Z",
    updatedAt: "2025-08-12T09:20:00Z",
    version: "1.0.0",
    isPublic: true,
    stats: {
      totalPlays: 421,
      averageRating: 4.4,
      completionRate: 0.89
    }
  }
];
```

### 詳細シーンデータ例（「失われた森の守護者」）

```typescript
const forestGuardianScenes: Scene[] = [
  {
    id: "scene-forest-001",
    title: "森の入り口",
    content: `# 古い森への入り口

太陽が西に傾き始めた午後、あなたは **古リラの森** の入り口に立っている。

村人たちから聞いた話では、この森で最近奇妙な現象が起きているという。動物たちが突然森から消え、木々が異常な速度で成長している。そして夜になると、森の奥から謎の光が見えるのだと。

森の入り口には古い石の標識が立っており、時代で風化した文字がかろうじて読める：

> **「この森に入る者よ、自然への敬意を忘れるべからず」**

森は静寂に包まれているが、時折風に運ばれて来る音は、まるで森全体が息づいているかのようだ。

あなたはどうするか？`,
    type: "narrative",
    backgroundImageUrl: "/images/scenes/forest-entrance.jpg",
    mood: "mysterious",
    choices: [
      {
        id: "choice-forest-001-1",
        text: "すぐに森の奥へ向かう",
        description: "時間を無駄にせず、直接問題の核心に向かう",
        nextSceneId: "scene-forest-002-rush",
        difficulty: "easy",
        consequences: ["story_branch"],
        type: "action",
        weight: 3,
        tags: ["直情的", "行動力"],
        isAvailable: true
      },
      {
        id: "choice-forest-001-2", 
        text: "森の入り口付近を詳しく調査する",
        description: "慎重に手がかりを探してから進む",
        nextSceneId: "scene-forest-002-investigate",
        difficulty: "moderate",
        consequences: ["item_gain"],
        type: "strategic",
        weight: 5,
        tags: ["慎重", "調査"],
        isAvailable: true
      },
      {
        id: "choice-forest-001-3",
        text: "古い標識の文字をもっと詳しく読む",
        description: "古代文字に何かヒントが隠されているかもしれない",
        nextSceneId: "scene-forest-002-runes",
        difficulty: "hard",
        consequences: ["character_change"],
        type: "creative",
        weight: 7,
        tags: ["知識", "洞察"],
        isAvailable: true
      },
      {
        id: "choice-forest-001-4",
        text: "一度村に戻って、もっと詳しい情報を集める",
        description: "準備不足では危険かもしれない",
        nextSceneId: "scene-village-return",
        difficulty: "easy",
        consequences: ["story_branch"],
        type: "strategic",
        weight: 2,
        tags: ["慎重", "準備"],
        isAvailable: true
      }
    ],
    isStarting: true,
    isEnding: false,
    chapterIndex: 1,
    estimatedReadTime: 45,
    metadata: {
      location: "古リラの森・入り口",
      timeOfDay: "午後",
      weather: "晴れ",
      npcs: []
    }
  },
  
  {
    id: "scene-forest-002-investigate",
    title: "入り口の調査",
    content: `# 慎重な調査

森の入り口周辺を注意深く調べると、いくつかの興味深い発見がある。

**地面の観察**：
最近の動物の足跡が、森の奥へと続いている。しかし奇妙なことに、すべての足跡が同じ方向を向いている。まるで何かに呼ばれるように、森の奥の特定の場所に向かっているようだ。

**古い標識の詳細**：
石の標識の裏側に、新しい傷跡を発見する。爪のような鋭い跡が縦に走っており、まだ新しい。この傷跡は明らかに人間のものではない。

**森の音**：
耳を澄ませていると、森の奥から規則的な音が聞こえてくる。太鼓のようなリズムだが、それは鼓動に似ている。森の心臓の音のように。

**発見アイテム**：
調査中、古い標識の根元で **「森の案内書」** の断片を発見する。ページの多くは朽ちているが、「守護者との対話の方法」について記された部分が残っている。

これらの情報を得て、あなたは次の行動を決める。`,
    type: "exploration",
    backgroundImageUrl: "/images/scenes/forest-investigation.jpg", 
    mood: "tense",
    choices: [
      {
        id: "choice-forest-002-1",
        text: "動物の足跡を辿って森の奥へ進む",
        description: "動物たちが向かった方向に手がかりがありそうだ",
        nextSceneId: "scene-forest-003-trail",
        difficulty: "moderate",
        consequences: ["story_branch"],
        type: "action",
        weight: 5,
        tags: ["追跡", "直感"],
        isAvailable: true
      },
      {
        id: "choice-forest-002-2",
        text: "森の案内書の断片をもっと詳しく読む",
        description: "「守護者との対話の方法」が重要かもしれない",
        nextSceneId: "scene-forest-003-book",
        difficulty: "hard",
        consequences: ["character_change", "item_gain"],
        type: "creative",
        weight: 8,
        tags: ["知識", "理解"],
        isAvailable: true
      },
      {
        id: "choice-forest-002-3",
        text: "森の心臓の音の方向へ向かう",
        description: "音の源が現象の核心に関わっていそうだ",
        nextSceneId: "scene-forest-003-heartbeat",
        difficulty: "moderate",
        consequences: ["story_branch"],
        type: "action", 
        weight: 6,
        tags: ["直感", "勇気"],
        isAvailable: true
      }
    ],
    isStarting: false,
    isEnding: false,
    chapterIndex: 1,
    estimatedReadTime: 60,
    metadata: {
      location: "古リラの森・入り口付近",
      timeOfDay: "午後",
      weather: "晴れ",
      npcs: []
    }
  }
  
  // 他のシーンも同様に詳細に設計...
];
```

### サンプルセッションデータ

```typescript
const sampleSessions: Session[] = [
  {
    id: "session-forest-001",
    scenarioId: "fantasy-001",
    title: "失われた森の守護者 - セッション #1",
    status: "active",
    currentSceneId: "scene-forest-003-trail",
    playerCount: { current: 2, max: 4 },
    participants: [
      {
        playerId: "player-001",
        playerName: "山田太郎",
        avatar: "/images/avatars/player-001.jpg",
        role: "player",
        joinedAt: "2025-08-16T10:00:00Z",
        lastSeenAt: "2025-08-16T14:30:00Z",
        status: "active"
      },
      {
        playerId: "player-002", 
        playerName: "佐藤花子",
        avatar: "/images/avatars/player-002.jpg",
        role: "player",
        joinedAt: "2025-08-16T10:15:00Z",
        lastSeenAt: "2025-08-16T14:25:00Z",
        status: "active"
      }
    ],
    gamemaster: {
      id: "gm-001",
      name: "田中GM",
      avatar: "/images/avatars/gm-001.jpg"
    },
    startedAt: "2025-08-16T10:00:00Z",
    lastActivityAt: "2025-08-16T14:30:00Z",
    estimatedCompletionTime: "2025-08-16T16:00:00Z",
    progress: {
      scenesCompleted: 3,
      totalScenes: 15,
      percentage: 20
    },
    settings: {
      isPublic: true,
      allowSpectators: true,
      autoSave: true,
      playStyle: "narrative"
    },
    createdAt: "2025-08-16T09:45:00Z",
    updatedAt: "2025-08-16T14:30:00Z"
  },
  
  {
    id: "session-mars-001",
    scenarioId: "scifi-001", 
    title: "火星植民地の陰謀 - 深夜セッション",
    status: "recruiting",
    currentSceneId: "scene-mars-001",
    playerCount: { current: 1, max: 3 },
    participants: [
      {
        playerId: "player-003",
        playerName: "鈴木一郎",
        avatar: "/images/avatars/player-003.jpg",
        role: "player",
        joinedAt: "2025-08-16T13:00:00Z",
        lastSeenAt: "2025-08-16T14:15:00Z",
        status: "active"
      }
    ],
    startedAt: "2025-08-16T13:00:00Z",
    lastActivityAt: "2025-08-16T14:15:00Z",
    progress: {
      scenesCompleted: 0,
      totalScenes: 22,
      percentage: 0
    },
    settings: {
      isPublic: true,
      allowSpectators: false,
      autoSave: true,
      playStyle: "exploration"
    },
    createdAt: "2025-08-16T12:45:00Z",
    updatedAt: "2025-08-16T14:15:00Z"
  },
  
  {
    id: "session-mystery-001",
    scenarioId: "mystery-001",
    title: "古書店の消失事件 - ソロプレイ",
    status: "completed",
    currentSceneId: "ending-truth",
    playerCount: { current: 1, max: 1 },
    participants: [
      {
        playerId: "player-004",
        playerName: "高橋美咲",
        avatar: "/images/avatars/player-004.jpg",
        role: "player",
        joinedAt: "2025-08-15T19:00:00Z",
        lastSeenAt: "2025-08-15T21:45:00Z",
        status: "offline"
      }
    ],
    startedAt: "2025-08-15T19:00:00Z",
    lastActivityAt: "2025-08-15T21:45:00Z",
    progress: {
      scenesCompleted: 18,
      totalScenes: 18,
      percentage: 100
    },
    settings: {
      isPublic: false,
      allowSpectators: false,
      autoSave: true,
      playStyle: "narrative"
    },
    createdAt: "2025-08-15T18:45:00Z",
    updatedAt: "2025-08-15T21:45:00Z"
  }
];
```

### サンプルプレイ記録データ

```typescript
const samplePlayRecords: PlayRecord[] = [
  {
    id: "record-001",
    playerId: "player-004",
    sessionId: "session-mystery-001", 
    scenarioId: "mystery-001",
    completionStatus: "completed",
    endingSceneId: "ending-truth",
    finalScore: 85,
    choiceHistory: [
      {
        sceneId: "scene-bookstore-001",
        choiceId: "choice-investigate-desk",
        choiceText: "店主の机を詳しく調べる",
        selectedAt: "2025-08-15T19:15:00Z",
        decisionTimeSeconds: 23,
        alternativesConsidered: ["choice-check-customers", "choice-examine-books"]
      },
      {
        sceneId: "scene-bookstore-002",
        choiceId: "choice-follow-clue",
        choiceText: "手がかりを追って裏部屋へ",
        selectedAt: "2025-08-15T19:32:00Z",
        decisionTimeSeconds: 45,
        alternativesConsidered: ["choice-call-police"]
      },
      // ... 他の選択履歴
    ],
    sceneVisitHistory: [
      {
        sceneId: "scene-bookstore-001",
        visitedAt: "2025-08-15T19:05:00Z",
        timeSpentSeconds: 600,
        isFirstVisit: true
      },
      {
        sceneId: "scene-bookstore-002", 
        visitedAt: "2025-08-15T19:15:00Z",
        timeSpentSeconds: 1020,
        isFirstVisit: true
      },
      // ... 他の訪問履歴
    ],
    startedAt: "2025-08-15T19:00:00Z",
    completedAt: "2025-08-15T21:45:00Z",
    totalPlayTime: 9900, // 2時間45分
    sessionBreaks: [
      {
        startedAt: "2025-08-15T20:30:00Z",
        resumedAt: "2025-08-15T20:45:00Z",
        durationSeconds: 900,
        reason: "pause"
      }
    ],
    statistics: {
      totalChoices: 18,
      uniqueScenesVisited: 18,
      backtrackCount: 2,
      difficultChoicesCount: 5,
      averageDecisionTime: 34.5
    },
    tags: ["慎重派", "推理型", "完璧主義"],
    notes: "最初は慎重だったが、後半は直感的な選択が増えた。真相解明に集中できて楽しかった。",
    rating: 5
  },
  
  {
    id: "record-002",
    playerId: "player-001",
    sessionId: "session-forest-completed-001",
    scenarioId: "fantasy-001", 
    completionStatus: "completed",
    endingSceneId: "ending-harmony",
    finalScore: 92,
    choiceHistory: [
      {
        sceneId: "scene-forest-001",
        choiceId: "choice-forest-001-2",
        choiceText: "森の入り口付近を詳しく調査する",
        selectedAt: "2025-08-14T15:20:00Z",
        decisionTimeSeconds: 67,
        alternativesConsidered: ["choice-forest-001-1", "choice-forest-001-3"]
      },
      // ... 他の選択履歴
    ],
    sceneVisitHistory: [
      // ... 訪問履歴
    ],
    startedAt: "2025-08-14T15:00:00Z",
    completedAt: "2025-08-14T17:15:00Z",
    totalPlayTime: 8100, // 2時間15分
    sessionBreaks: [],
    statistics: {
      totalChoices: 15,
      uniqueScenesVisited: 16,
      backtrackCount: 1,
      difficultChoicesCount: 7,
      averageDecisionTime: 54.2
    },
    tags: ["探索型", "調和重視", "慎重派"],
    notes: "森の守護者との対話シーンが印象的だった。自然との調和を選択できて満足。",
    rating: 5
  }
];
```

## 💾 LocalStorage設計戦略

### データ永続化パターン

```typescript
interface LocalStorageSchema {
  // ユーザー関連
  "odyssage:player_profile": PlayerProfile;
  "odyssage:player_preferences": PlayerPreferences;
  
  // セッション管理
  "odyssage:active_sessions": Session[];
  "odyssage:session:{sessionId}": Session;
  
  // プレイ記録
  "odyssage:play_records": PlayRecord[];
  "odyssage:play_record:{recordId}": PlayRecord;
  
  // 一時データ
  "odyssage:current_play_state": CurrentPlayState;
  "odyssage:draft_choices": DraftChoice[];
  
  // 設定・キャッシュ
  "odyssage:app_settings": AppSettings;
  "odyssage:scenario_cache": CachedScenario[];
  "odyssage:last_sync": string; // ISO date
}

interface CurrentPlayState {
  sessionId: string;
  currentSceneId: string;
  draftChoiceId?: string;
  lastSavedAt: string; // ISO date
  autoSaveEnabled: boolean;
}

interface PlayerPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  preferredPlayStyle: PlayStyle;
}
```

### データ同期・バックアップ戦略

```markdown
## データ管理方針

### 自動保存パターン
1. **シーン遷移時**: 選択完了・次シーン移行時に自動保存
2. **定期保存**: 5分間隔でのバックアップ保存
3. **重要ポイント**: 重大な選択・チャプター終了時の確実保存
4. **セッション終了**: 完了・中断時の最終状態保存

### データ復旧戦略
1. **バージョン管理**: 過去3回分の自動保存を保持
2. **破損検知**: データ読み込み時の整合性チェック
3. **セーフモード**: 破損時の最小限データでの復旧
4. **エクスポート機能**: ユーザーによる手動データバックアップ

### プライバシー配慮
1. **ローカル完結**: 個人データの外部送信なし
2. **匿名化**: 統計データの個人情報除去
3. **選択的削除**: ユーザーによる部分データ削除
4. **完全削除**: アプリアンインストール時の全データ削除
```

## 🔧 技術実装詳細

### JSON ファイル構成

```bash
# 静的データファイル構成
src/data/
├── scenarios/
│   ├── index.json          # シナリオ一覧メタデータ
│   ├── fantasy-001.json    # 個別シナリオデータ
│   ├── scifi-001.json     
│   ├── mystery-001.json   
│   ├── horror-001.json    
│   └── adventure-001.json 
├── sessions/
│   ├── active-sessions.json     # アクティブセッション一覧
│   └── session-templates.json  # セッションテンプレート
├── sample-records/
│   └── play-records.json  # サンプルプレイ記録
└── metadata/
    ├── categories.json     # カテゴリ定義
    ├── difficulty-levels.json # 難易度定義
    └── tags.json          # タグ定義
```

### データローダー設計

```typescript
// shared/lib/data/staticDataLoader.ts
export class StaticDataLoader {
  private scenarioCache = new Map<string, Scenario>();
  private sessionCache = new Map<string, Session>();
  
  async loadScenarios(): Promise<Scenario[]> {
    if (this.scenarioCache.size === 0) {
      const scenarios = await this.fetchScenariosFromJSON();
      scenarios.forEach(scenario => {
        this.scenarioCache.set(scenario.id, scenario);
      });
    }
    
    return Array.from(this.scenarioCache.values());
  }
  
  async loadScenario(id: string): Promise<Scenario | null> {
    if (!this.scenarioCache.has(id)) {
      try {
        const scenario = await import(`~/data/scenarios/${id}.json`);
        this.scenarioCache.set(id, scenario.default);
      } catch (error) {
        console.warn(`Scenario ${id} not found`);
        return null;
      }
    }
    
    return this.scenarioCache.get(id) || null;
  }
  
  private async fetchScenariosFromJSON(): Promise<Scenario[]> {
    const index = await import('~/data/scenarios/index.json');
    const scenarioPromises = index.scenarios.map(async (id: string) => {
      const scenarioData = await import(`~/data/scenarios/${id}.json`);
      return scenarioData.default as Scenario;
    });
    
    return Promise.all(scenarioPromises);
  }
}

// features/player/scenario-discovery/api/scenarioRepository.ts
export class LocalScenarioRepository implements ScenarioRepository {
  constructor(
    private dataLoader: StaticDataLoader,
    private storage: StorageAdapter<Scenario[]>
  ) {}
  
  async getAvailableScenarios(): Promise<Scenario[]> {
    // キャッシュ確認
    const cached = await this.storage.get('scenarios');
    if (cached && this.isCacheValid(cached)) {
      return cached;
    }
    
    // データローダーから取得
    const scenarios = await this.dataLoader.loadScenarios();
    
    // キャッシュに保存
    await this.storage.set('scenarios', scenarios);
    
    return scenarios;
  }
  
  private isCacheValid(scenarios: Scenario[]): boolean {
    // キャッシュの有効性チェック（例：24時間以内）
    const lastUpdate = localStorage.getItem('odyssage:scenarios_last_update');
    if (!lastUpdate) return false;
    
    const updateTime = new Date(lastUpdate);
    const now = new Date();
    const hoursDiff = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
  }
}
```

### バリデーション・型安全性

```typescript
// shared/lib/validation/dataValidation.ts
import { z } from 'zod';

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  overview: z.string().min(50).max(500),
  category: z.enum(['fantasy', 'scifi', 'mystery', 'horror', 'adventure', 'drama', 'comedy']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimatedPlayTime: z.number().positive(),
  playerCount: z.object({
    min: z.number().positive(),
    max: z.number().positive(), 
    recommended: z.number().positive()
  }),
  scenes: z.array(SceneSchema),
  startingSceneId: z.string(),
  endingSceneIds: z.array(z.string()),
  tags: z.array(z.string()),
  thumbnailUrl: z.string().url(),
  backgroundImageUrl: z.string().url(),
  author: z.object({
    name: z.string(),
    profile: z.string().optional()
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  version: z.string(),
  isPublic: z.boolean(),
  stats: z.object({
    totalPlays: z.number().nonnegative(),
    averageRating: z.number().min(0).max(5),
    completionRate: z.number().min(0).max(1)
  })
});

export const SceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().min(10),
  type: z.enum(['narrative', 'choice', 'exploration', 'confrontation', 'resolution', 'transition']),
  backgroundImageUrl: z.string().url().optional(),
  mood: z.enum(['peaceful', 'tense', 'mysterious', 'dramatic', 'action', 'melancholy', 'triumphant']),
  choices: z.array(ChoiceSchema),
  isStarting: z.boolean(),
  isEnding: z.boolean(),
  chapterIndex: z.number().optional(),
  estimatedReadTime: z.number().positive(),
  metadata: z.object({
    location: z.string().optional(),
    timeOfDay: z.string().optional(),
    weather: z.string().optional(),
    npcs: z.array(z.string()).optional()
  })
});

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string().min(1).max(200),
  description: z.string().optional(),
  nextSceneId: z.string(),
  transitionText: z.string().optional(),
  difficulty: z.enum(['easy', 'moderate', 'hard', 'critical']),
  consequences: z.array(z.enum(['story_branch', 'character_change', 'item_gain', 'item_loss', 'relationship_change', 'ending_unlock'])),
  requirements: z.array(z.any()).optional(),
  type: z.enum(['action', 'dialogue', 'moral', 'strategic', 'creative', 'risk']),
  weight: z.number().min(1).max(10),
  tags: z.array(z.string()),
  isAvailable: z.boolean(),
  conditions: z.array(z.any()).optional()
});

// データ検証ユーティリティ
export function validateScenario(data: unknown): Scenario {
  return ScenarioSchema.parse(data);
}

export function validateScenarios(data: unknown[]): Scenario[] {
  return data.map(item => validateScenario(item));
}
```

## 🧪 データ品質保証

### テストデータ設計原則

```markdown
## データ品質基準

### 物語品質
✅ **魅力的な導入**: 各シナリオ冒頭で興味を引く
✅ **明確な選択肢**: プレイヤーが理解しやすい選択の提示
✅ **意味ある結果**: 選択に応じた適切な結果・展開
✅ **複数エンディング**: 再プレイ価値のある複数の結末

### データ整合性
✅ **ID一意性**: 全エンティティのID重複なし
✅ **参照整合性**: sceneId, choiceIdの参照先存在
✅ **循環参照回避**: 無限ループのない遷移設計
✅ **必須データ**: すべての必須フィールドに有効値

### 技術品質
✅ **JSON妥当性**: 正しいJSON文法・構造
✅ **型安全性**: TypeScript型定義との完全一致
✅ **パフォーマンス**: 適切なデータサイズ・構造
✅ **拡張性**: 将来機能への対応可能性
```

### データ検証スクリプト

```typescript
// scripts/validateMockData.ts
import { validateScenarios } from '~/shared/lib/validation/dataValidation';
import * as scenarios from '~/data/scenarios/index.json';

async function validateAllMockData() {
  console.log('🔍 Mock data validation starting...');
  
  try {
    // シナリオデータ検証
    const scenarioData = await loadAllScenarios();
    const validatedScenarios = validateScenarios(scenarioData);
    console.log(`✅ Scenarios validated: ${validatedScenarios.length} items`);
    
    // データ整合性チェック
    validateDataIntegrity(validatedScenarios);
    console.log('✅ Data integrity check passed');
    
    // 物語品質チェック
    validateStoryQuality(validatedScenarios);
    console.log('✅ Story quality check passed');
    
    console.log('🎉 All mock data validation completed successfully!');
    
  } catch (error) {
    console.error('❌ Mock data validation failed:', error);
    process.exit(1);
  }
}

function validateDataIntegrity(scenarios: Scenario[]) {
  scenarios.forEach(scenario => {
    // 開始シーンの存在確認
    const startingScene = scenario.scenes.find(s => s.id === scenario.startingSceneId);
    if (!startingScene) {
      throw new Error(`Starting scene ${scenario.startingSceneId} not found in scenario ${scenario.id}`);
    }
    
    // 選択肢の遷移先確認
    scenario.scenes.forEach(scene => {
      scene.choices.forEach(choice => {
        const targetScene = scenario.scenes.find(s => s.id === choice.nextSceneId);
        if (!targetScene) {
          throw new Error(`Choice ${choice.id} points to non-existent scene ${choice.nextSceneId}`);
        }
      });
    });
    
    // 結末シーンの存在確認
    scenario.endingSceneIds.forEach(endingId => {
      const endingScene = scenario.scenes.find(s => s.id === endingId);
      if (!endingScene || !endingScene.isEnding) {
        throw new Error(`Ending scene ${endingId} not found or not marked as ending`);
      }
    });
  });
}

function validateStoryQuality(scenarios: Scenario[]) {
  scenarios.forEach(scenario => {
    // 最小シーン数チェック
    if (scenario.scenes.length < 5) {
      throw new Error(`Scenario ${scenario.id} has too few scenes (${scenario.scenes.length})`);
    }
    
    // 最小選択肢数チェック
    const choiceScenes = scenario.scenes.filter(s => s.choices.length > 0);
    if (choiceScenes.length < 3) {
      throw new Error(`Scenario ${scenario.id} has too few choice points (${choiceScenes.length})`);
    }
    
    // 複数エンディングチェック
    if (scenario.endingSceneIds.length < 2) {
      throw new Error(`Scenario ${scenario.id} should have multiple endings`);
    }
  });
}

// スクリプト実行
if (require.main === module) {
  validateAllMockData();
}
```

## 📈 Phase別データ準備計画

### Phase 1: MVP必須データ（今週完了目標）

```markdown
## 最優先データ（3シナリオ）
✅ **「失われた森の守護者」** - Fantasy/Beginner（完成）
✅ **「火星植民地の陰謀」** - SciFi/Intermediate（80%完成）
✅ **「古書店の消失事件」** - Mystery/Intermediate（60%完成）

## 各シナリオ必須要素
- 10-15シーンの完整な物語
- 3つ以上の結末ルート
- 2-3の進行中セッション
- 1-2のサンプルプレイ記録

## データファイル構成
- scenario データJSON（3ファイル）
- session データJSON（1ファイル） 
- play-record データJSON（1ファイル）
```

### Phase 2: 体験向上データ（来週目標）

```markdown
## 追加シナリオ（2シナリオ）
✅ **「廃校舎の夜」** - Horror/Advanced
✅ **「海賊船の財宝」** - Adventure/Beginner

## 追加要素
- より詳細なメタデータ
- 豊富なサンプルプレイ記録
- 多様な進行状況のセッション
- プレイヤープロファイル・統計データ
```

### Phase 3: 最終仕上げ（第3週目標）

```markdown
## 完成度向上
✅ 全シナリオの物語品質向上
✅ より自然なプレイ記録データ
✅ 実際のプレイテストに基づく調整
✅ パフォーマンス最適化対応
```

---

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

#player-context #mock-data #json-design #trpg-scenarios #data-modeling #mvp-design