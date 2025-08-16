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
    count: "2シナリオ（MVP最小構成）";
    focus: ["失われた森の守護者", "薬草採取の旅"];
    quality: "各シナリオ30-45分の体験時間";
  };
  
  sessions: {
    active_sessions: "3セッション以下（MVP検証用）";
    participation_states: ["参加可能", "参加中", "完了済み"];
  };
  
  play_records: {
    sample_histories: "最小限の完了セッション履歴";
    choice_patterns: "基本的な選択パターンの記録";
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
  
  // ゲーム進行
  choices: Choice[];
  isStarting: boolean;
  isEnding: boolean;
  
  // システム情報（MVP最小限）
  metadata: {
    location?: string;
    npcs?: string[];
  };
}

type SceneType = 
  | 'narrative'    // 物語進行
  | 'choice'       // 重要な選択
  | 'exploration'  // 探索・発見
  | 'resolution';  // 解決・結末

// MVP版では、moodやBGM管理を簡略化。必要に応じて後から追加可能
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
  
  // メタデータ（MVP最小限）
  type: ChoiceType;
  tags: string[];
  
  // システム情報
  isAvailable: boolean; // 常時利用可能かどうか
}

type ChoiceType = 
  | 'action'     // 行動選択
  | 'dialogue'   // 会話選択
  | 'strategic'  // 戦略的判断
  | 'creative';  // 創造的解決

// MVP版では、weight、requirements、consequences、difficultyは簡略化
// 必要に応じて後から追加可能
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
  | 'recruiting'  // 参加者募集中
  | 'active'      // 進行中
  | 'completed';  // 完了

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
  | 'completed'     // 完了
  | 'in_progress';  // 進行中

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
    id: "fantasy-001",
    title: "失われた森の守護者",
    overview: "古い森で起きる不思議な現象を調査する冒険者の物語。森の奥に眠る古代の秘密と、それを守る謎の存在との出会いが待っている。あなたの選択が森の運命、そして世界の平衡を決めることになる。",
    estimatedPlayTime: 45,
    playerCount: { min: 1, max: 4 },
    scenes: [], // 後述の詳細シーンデータ
    startingSceneId: "scene-forest-001",
    endingSceneIds: ["ending-harmony", "ending-sacrifice", "ending-corruption"],
    tags: ["森", "古代", "神秘", "選択の重み"],
    thumbnailUrl: "/images/scenarios/forest-guardian-thumb.jpg",
    author: {
      name: "川上　雅史"
    },
    createdAt: "2025-08-10T09:00:00Z",
    updatedAt: "2025-08-15T14:30:00Z",
    version: "1.2.0",
    isPublic: true
  },
  
  {
    id: "adventure-001", 
    title: "薬草採取の旅",
    overview: "病気の母を救うため、伝説の薬草を求めて危険な山奥へと向かう若者の物語。道中で出会う旅人たち、危険な魔物、そして薬草を守る精霊たち。あなたは本当に大切なものが何かを学ぶことになる。",
    estimatedPlayTime: 35,
    playerCount: { min: 1, max: 3 },
    scenes: [],
    startingSceneId: "scene-village-001",
    endingSceneIds: ["ending-healing", "ending-sacrifice", "ending-wisdom"],
    tags: ["家族", "薬草", "冒険", "成長"],
    thumbnailUrl: "/images/scenarios/herb-journey-thumb.jpg",
    author: {
      name: "鈴木　太郎"
    },
    createdAt: "2025-08-07T13:15:00Z",
    updatedAt: "2025-08-12T09:20:00Z",
    version: "1.0.0",
    isPublic: true
  }
];
```

## 🔮 将来機能の記録

### プレイヤーからGMへの選択肢提案機能
**要件**: プレイヤーがシーンで提示された選択肢以外の行動を提案し、GMが承認・却下できる機能
**設計方針**: 
- 各シーンに「その他の行動を提案」オプションを追加
- プレイヤーがフリーテキストで行動を記述
- GMに通知が送られ、承認・却下・修正提案が可能
- 承認された場合、新しい選択肢として追加またはカスタムシーンへ遷移

**データ構造案**:
```typescript
interface CustomChoiceProposal {
  id: string;
  sessionId: string;
  sceneId: string;
  playerId: string;
  proposedText: string;
  proposedDescription?: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  gmResponse?: {
    responseType: 'approve' | 'reject' | 'modify';
    feedback?: string;
    modifiedChoice?: Choice;
  };
  createdAt: string;
}
```

### 削除されたMVP外機能一覧
以下の機能はMVP範囲外として削除：
- カテゴリ・難易度システム
- 詳細統計（プレイ記録の分析データ）
- BGM・ムード管理
- セッション進捗詳細（estimatedCompletionTime等）
- 選択肢の重み・結果システム
- スペクテーター機能
- プレイスタイル分類

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

#player-context #mock-data #json-design #trpg-scenarios #data-modeling #mvp-design
