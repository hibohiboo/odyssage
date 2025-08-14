# プレイヤー文脈MVP決定：実装方針と計画

## 🎯 決定事項

### **最終方針決定**
> 「画面をプレイヤー文脈のパスを切れば、コード負債なんとかなりますかね。よし、では、MVPでプレイヤーのほうから作りますか」

### **この判断の優秀さ**
✅ **Context-First Architectureの実践**: ユーザー文脈でのクリーンな境界設定  
✅ **技術負債の回避**: 未使用機能への依存を完全排除  
✅ **既存資産の活用**: バックエンドのプレイヤー向け機能を最大限利用  
✅ **シンプルな開始**: 最も理解しやすい文脈から実装開始  

---

## 🏗️ プレイヤー文脈MVP のアーキテクチャ

### **明確な境界設定**
```mermaid
graph TB
    subgraph "Player Context MVP"
        PlayerRoutes[/player/* routes]
        PlayerComponents[Player専用コンポーネント]
        PlayerAPI[Player向けAPI のみ]
        PlayerData[プレイヤー関連データのみ]
    end
    
    subgraph "未使用（将来実装）"
        AuthorRoutes[/author/* routes]
        GMRoutes[/gm/* routes]
        AuthorAPI[Author/GM API]
    end
    
    PlayerRoutes --> PlayerComponents
    PlayerComponents --> PlayerAPI
    PlayerAPI --> PlayerData
    
    style PlayerRoutes fill:#e1f5fe
    style PlayerComponents fill:#e8f5e8
    style PlayerAPI fill:#fff3e0
    style PlayerData fill:#fce4ec
    
    style AuthorRoutes fill:#f5f5f5,stroke-dasharray: 5 5
    style GMRoutes fill:#f5f5f5,stroke-dasharray: 5 5
    style AuthorAPI fill:#f5f5f5,stroke-dasharray: 5 5
```

### **具体的な実装範囲**
```typescript
interface PlayerContextMVP {
  routes: {
    base: "/player";
    scenarios: "/player/scenarios";           // 利用可能シナリオ一覧
    play: "/player/scenarios/:id/play";       // シナリオプレイ
    history: "/player/history";               // 自分のプレイ履歴
    compare: "/player/history/compare";       // 選択・結末比較
  };
  
  components: {
    // プレイヤー専用コンポーネント
    scenario_browser: "PlayerScenarioBrowser";
    game_interface: "PlayerGameInterface";
    history_viewer: "PlayerHistoryViewer";
    choice_comparison: "PlayerChoiceComparison";
  };
  
  api_endpoints: {
    // 既存バックエンドから必要な部分のみ
    scenarios_public: "GET /api/scenarios/public";
    scenario_detail: "GET /api/scenarios/:id";
    // 新規追加（プレイヤー用）
    play_progress: "POST /api/player/progress";
    play_history: "GET /api/player/history";
  };
}
```

---

## 📁 フロントエンド構造設計

### **Context-First ディレクトリ構造**
```
apps/frontend/src/
├── app/
│   ├── router/
│   │   └── playerRoutes.tsx          # プレイヤー専用ルート
│   └── store/
│       └── playerStore.ts            # プレイヤー状態管理
├── contexts/
│   └── player/                       # プレイヤー文脈
│       ├── scenarios/                # シナリオ関連
│       │   ├── components/
│       │   │   ├── ScenarioBrowser.tsx
│       │   │   ├── ScenarioCard.tsx
│       │   │   └── ScenarioFilter.tsx
│       │   ├── hooks/
│       │   │   ├── useAvailableScenarios.ts
│       │   │   └── useScenarioDetail.ts
│       │   └── api/
│       │       └── scenarioApi.ts
│       ├── gameplay/                 # ゲームプレイ関連
│       │   ├── components/
│       │   │   ├── GameInterface.tsx
│       │   │   ├── ChoiceSelector.tsx
│       │   │   ├── StoryDisplay.tsx
│       │   │   └── ProgressIndicator.tsx
│       │   ├── hooks/
│       │   │   ├── useGameProgress.ts
│       │   │   ├── useScenarioFlow.ts
│       │   │   └── useLocalSave.ts
│       │   └── api/
│       │       └── progressApi.ts
│       └── history/                  # 履歴・比較関連
│           ├── components/
│           │   ├── HistoryViewer.tsx
│           │   ├── ComparisonTable.tsx
│           │   └── TagCollector.tsx
│           ├── hooks/
│           │   ├── usePlayHistory.ts
│           │   └── useChoiceComparison.ts
│           └── api/
│               └── historyApi.ts
└── shared/                          # 共通（プレイヤー文脈でも使用）
    ├── ui/                          # 汎用UIコンポーネント
    ├── hooks/                       # 汎用フック
    └── utils/                       # ユーティリティ
```

### **ルーティング設計**
```typescript
// apps/frontend/src/app/router/playerRoutes.tsx
import { createBrowserRouter } from 'react-router';

export const playerRouter = createBrowserRouter([
  {
    path: '/player',
    children: [
      {
        path: '',
        element: <PlayerDashboard />,
      },
      {
        path: 'scenarios',
        children: [
          {
            path: '',
            element: <ScenarioBrowser />,
            loader: availableScenariosLoader,
          },
          {
            path: ':scenarioId/play',
            element: <GameInterface />,
            loader: scenarioDetailLoader,
          },
        ],
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            element: <HistoryViewer />,
            loader: playHistoryLoader,
          },
          {
            path: 'compare',
            element: <ChoiceComparison />,
          },
        ],
      },
    ],
  },
]);
```

---

## 🚀 段階的実装計画

### **Week 1: 基盤とシナリオ閲覧**
```markdown
Day 1-2: プロジェクト構造セットアップ
- プレイヤー文脈ディレクトリ作成
- ルーティング基盤実装
- 基本的な状態管理設定

Day 3-4: シナリオ閲覧機能
- 利用可能シナリオ一覧表示
- 既存 /api/scenarios/public との連携
- シナリオカード・フィルター機能

Day 5-7: シナリオ詳細・開始
- シナリオ詳細ページ
- プレイ開始インターフェース
- Neo4j からのシナリオ構造取得
```

### **Week 2: ゲームプレイ機能**
```markdown
Day 8-10: 基本ゲームインターフェース
- ストーリー表示コンポーネント
- 選択肢セレクター
- 進行状況表示

Day 11-14: 進行管理・保存
- LocalStorage での進行保存
- 分岐ロジックの実装
- Neo4j クエリとの連携最適化
```

### **Week 3: 履歴・比較機能**
```markdown
Day 15-17: プレイ履歴機能
- 完了したプレイの一覧
- プレイログの表示・読み返し
- タグ・結末の記録

Day 18-21: 選択比較機能
- 複数プレイでの選択差分表示
- 結末・タグの比較可視化
- お気に入り機能の追加
```

### **Week 4: 完成・最適化**
```markdown
Day 22-25: UI/UX 改善
- レスポンシブ対応
- ローディング状態の改善
- エラーハンドリング

Day 26-28: 自己テスト・体験評価
- 全機能の通しテスト
- プレイヤーとしての体験評価
- 改善点の洗い出し

Day 29-30: ドキュメント・次段階計画
- 技術ブログ記事執筆
- 学習成果の整理
- Phase 2 計画策定
```

---

## 💻 バックエンド連携戦略

### **既存API の活用**
```typescript
// 既存APIでプレイヤーが利用できる部分
interface ExistingPlayerAPIs {
  scenarios: {
    public_list: "GET /api/scenarios/public";
    detail: "GET /api/scenarios/:id";
    // Neo4jからの豊富な分岐構造取得
  };
  
  // 必要に応じて新規追加
  player_specific: {
    progress_save: "POST /api/player/progress";
    history_get: "GET /api/player/history";
    choice_analytics: "GET /api/player/analytics";
  };
}
```

### **Neo4j 活用ポイント**
```cypher
// プレイヤー用のシナリオ取得クエリ例
MATCH (scenario:Scenario {published: true})
MATCH (scenario)-[:HAS_SCENE]->(scenes:Scene)
MATCH (scenes)-[:HAS_CHOICE]->(choices:Choice)
RETURN scenario, 
       collect(scenes) as scene_structure,
       collect(choices) as available_choices
ORDER BY scenario.popularity DESC
```

---

## 🎮 プレイヤー体験設計

### **理想的なプレイヤージャーニー**
```markdown
1. シナリオ発見 (Discovery)
   - 「面白そうなファンタジーシナリオがある！」
   - ジャンル・難易度・プレイ時間での絞り込み
   - 他プレイヤーの評価・コメント閲覧

2. プレイ開始 (Engagement)  
   - 「キャラクター設定して冒険開始」
   - 直感的なゲーム画面
   - 選択の重みを感じる演出

3. 没入体験 (Immersion)
   - 「自分だけの物語が進行している」
   - 分岐による個別化体験
   - 泥臭いファンタジーの雰囲気

4. 比較・発見 (Reflection)
   - 「他の人はどんな選択をしたんだろう？」
   - 選択差分の可視化
   - 獲得タグ・結末の違い発見

5. 継続参加 (Retention)
   - 「次のシナリオも遊んでみたい」
   - プレイ履歴の蓄積
   - 新しいシナリオへの興味
```

### **特にこだわりたい機能**
```typescript
interface SpecialFeatures {
  choice_comparison: {
    // あなたが最も楽しみにしている機能
    visual_diff: "選択経路の視覚的差分表示";
    tag_analysis: "獲得タグの違い分析";
    outcome_matrix: "選択と結果の関係性可視化";
  };
  
  fantasy_atmosphere: {
    // 好みの雰囲気作り
    gritty_adventure: "泥臭い冒険者の描写";
    realistic_consequences: "現実的な選択の結果";
    tavern_stories: "酒場での噂話的な語り口";
  };
}
```

---

## 📈 成功指標とマイルストーン

### **技術学習面での成功指標**
```markdown
Week 1終了時:
✅ プレイヤー文脈での Context-First Architecture実装
✅ Neo4j クエリのフロントエンド統合
✅ React Router + 状態管理の実装

Week 2終了時:  
✅ 複雑な分岐ロジックの実装
✅ LocalStorage での進行管理
✅ リアルタイムUI更新の実装

Week 3終了時:
✅ データ可視化・比較機能の実装
✅ 複数データソースの統合表示
✅ ユーザビリティを考慮したUI設計

Week 4終了時:
✅ 完成したプレイヤー体験
✅ 技術ブログ記事の完成
✅ 学習成果の体系化
```

### **個人的楽しみ面での成功指標**
```markdown
Week 2終了時:
✅ 自分が楽しめるプレイ体験を1回以上実現
✅ ファンタジー泥臭冒険の雰囲気を実感

Week 3終了時:
✅ 選択・結末違いの比較を実際に体験
✅ 「また遊びたい」と思える完成度

Week 4終了時:  
✅ 5回以上の繰り返しプレイを楽しむ
✅ 他人にも試してもらいたい完成度
```

---

## 🔄 Phase 2 への進化計画

### **段階的な機能拡張**
```markdown
Phase 2 (2-3か月後):
- Author機能の段階的追加（シナリオ作成・編集）
- GM機能の実装（セッション管理）
- ユーザー認証の導入
- マルチプレイヤー機能

拡張戦略:
- プレイヤー文脈で得た知見をAuthor/GM文脈に適用
- 同じアーキテクチャパターンでの横展開
- データ構造・API設計の再利用
```

### **学習価値の継続**
```markdown
技術ブログテーマ:
1. "Context-First Architecture実践記録"
2. "Neo4jクエリ最適化：プレイヤー体験向上のため"  
3. "プレイヤー文脈から始める段階的システム構築"
4. "選択差分可視化アルゴリズムの設計と実装"
```

---

## 🚀 今すぐ開始すべきアクション

### **今日中に実行**
1. **プレイヤー文脈ディレクトリの作成**
2. **基本ルーティング設定**  
3. **最初のコンポーネント作成（ScenarioBrowser）**

### **今週中に完成**
1. **利用可能シナリオ一覧の表示**
2. **既存API との連携確認**
3. **基本的なゲーム画面のUI**

**まずはどこから始めますか？**

---

## 🏷️ メタデータ

**作成日**: 2025-08-14  
**決定事項**: プレイヤー文脈MVPでの開発開始  
**実装期間**: 4週間（1か月）  
**次フェーズ**: Author/GM文脈の段階的追加

**重要な方針**:
- ✅ Context-First Architecture実践
- ✅ 技術負債回避の境界設定  
- ✅ Neo4j学習価値の確保
- ✅ 個人的楽しみの早期実現

#player-context #mvp #context-first-architecture #implementation-plan