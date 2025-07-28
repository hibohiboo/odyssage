# Odyssage ハイブリッドデータベーススキーマ設計

## 概要
OdyssageはPostgreSQL（RDB）とNeo4j（グラフDB）のハイブリッド構成を採用し、それぞれの強みを活かしたデータ管理を行います。

## データ分散戦略

### PostgreSQL（RDB）- メタデータ管理
**役割**: 基本的なCRUD操作、ユーザー管理、シナリオメタデータ

#### 既存テーブル
```sql
-- ユーザー管理
users (id, name)

-- シナリオメタデータ（既存）
scenarios (id, title, userId, createdAt, updatedAt, overview, visibility)

-- シナリオストック機能
scenario_stock (userId, scenarioId, stockedAt)

-- セッション管理
sessions (id, gmId, scenarioId, title, status, createdAt, updatedAt)
```

#### 新規追加テーブル
```sql
-- プレイヤー進行状況（高頻度アクセス）
player_progress (
  id UUID PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  scenario_id UUID REFERENCES scenarios(id),
  current_event_id VARCHAR(255), -- Neo4jのEvent IDを参照
  is_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP DEFAULT NOW(),
  last_played_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 選択履歴（分析用）
choice_history (
  id UUID PRIMARY KEY,
  progress_id UUID REFERENCES player_progress(id),
  from_event_id VARCHAR(255),
  to_event_id VARCHAR(255),
  choice_text TEXT,
  chosen_at TIMESTAMP DEFAULT NOW()
);

-- 訪問イベント履歴（高速検索用）
visited_events (
  progress_id UUID REFERENCES player_progress(id),
  event_id VARCHAR(255),
  visited_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (progress_id, event_id)
);
```

### Neo4j（グラフDB）- 構造・関係性管理
**役割**: シナリオフロー、複雑な分岐構造、選択肢ナビゲーション

#### ノード設計
```cypher
// シナリオノード（PostgreSQLと同期）
(:Scenario {
  id: string,        // PostgreSQLのscenarios.idと同じ
  title: string,
  overview: string,
  userId: string,
  visibility: string,
  createdAt: datetime,
  updatedAt: datetime
})

// シーンノード（順序管理）
(:Scene {
  id: string,
  title: string,
  description: string,
  order: integer,
  scenarioId: string,
  createdAt: datetime,
  updatedAt: datetime
})

// イベントノード（分岐点）
(:Event {
  id: string,
  title: string,
  description: string,
  order: integer,
  sceneId: string,
  createdAt: datetime,
  updatedAt: datetime
})

// メッセージノード（テキスト表示）
(:Message {
  id: string,
  text: string,
  order: integer,
  eventId: string,
  createdAt: datetime,
  updatedAt: datetime
})

// 選択肢ノード（プレイヤーアクション）
(:Choice {
  id: string,
  text: string,
  order: integer,
  messageId: string,
  targetEventId: string,
  conditions: string,    // JSON文字列（条件設定）
  createdAt: datetime,
  updatedAt: datetime
})
```

#### リレーションシップ設計
```cypher
// 階層構造
(:Scenario)-[:HAS_SCENE]->(:Scene)
(:Scene)-[:HAS_EVENT]->(:Event)
(:Event)-[:HAS_MESSAGE]->(:Message)
(:Message)-[:HAS_CHOICE]->(:Choice)

// フロー構造（重要：分岐・合流）
(:Choice)-[:LEADS_TO]->(:Event)
(:Event)-[:NEXT]->(:Event)        // 直線的な進行
(:Event)-[:BRANCHES_TO]->(:Event) // 条件分岐
(:Event)-[:CONVERGES_TO]->(:Event) // 合流点

// 順序関係
(:Scene)-[:FOLLOWS]->(:Scene)
(:Event)-[:FOLLOWS]->(:Event)
(:Message)-[:FOLLOWS]->(:Message)
```

## データ同期戦略

### 1. シナリオ作成時
```
1. PostgreSQL: scenariosテーブルにメタデータ挿入
2. Neo4j: Scenarioノード作成（同じID使用）
3. Neo4j: Scene/Event/Message/Choiceノード作成
4. Neo4j: リレーションシップ構築
```

### 2. ゲームプレイ時
```
1. Neo4j: 現在位置から利用可能な選択肢を取得
2. PostgreSQL: player_progressで現在位置を更新
3. PostgreSQL: choice_historyに選択履歴を記録
4. PostgreSQL: visited_eventsに訪問履歴を記録
```

### 3. 統計・分析時
```
1. PostgreSQL: 基本統計（完了率、プレイ時間）
2. Neo4j: 経路分析（人気ルート、到達困難イベント）
3. 両DB結合: 総合的な分析レポート
```

## パフォーマンス最適化

### PostgreSQL最適化
- `player_progress.user_id, scenario_id`でインデックス
- `choice_history.progress_id`でインデックス
- `visited_events.progress_id, event_id`で複合インデックス

### Neo4j最適化
- `id`プロパティでインデックス（全ノード）
- `scenarioId`でインデックス（Scene, Event）
- `order`でインデックス（順序検索用）

## 整合性保証

### 参照整合性
- PostgreSQL内: 外部キー制約
- Neo4j内: アプリケーションレベルでの整合性チェック
- DB間: イベント駆動での同期（将来的）

### データ一貫性
- シナリオメタデータ: PostgreSQLがマスター
- フロー構造: Neo4jがマスター
- プレイヤー状態: PostgreSQLがマスター

## 利点

### RDB（PostgreSQL）
- ✅ ACID特性による確実なトランザクション
- ✅ 高速な単純クエリ（ユーザー認証、進行状況）
- ✅ 既存のORM・ツールチェーン活用
- ✅ バックアップ・復旧の簡易性

### グラフDB（Neo4j）
- ✅ 複雑な分岐構造の自然な表現
- ✅ 経路探索・推薦アルゴリズムの効率性
- ✅ 関係性分析の強力なクエリ能力
- ✅ 可視化ツールとの親和性

## 実装優先度

### Phase 1（現在）
- [ ] Neo4jスキーマノード・リレーションシップ定義
- [ ] PostgreSQLプレイヤー進行状況テーブル追加
- [ ] 基本的なCRUD操作実装

### Phase 2（次回）
- [ ] ハイブリッドリポジトリ実装
- [ ] データ同期機能実装
- [ ] パフォーマンス最適化

### Phase 3（将来）
- [ ] イベント駆動での自動同期
- [ ] 高度な分析クエリ実装
- [ ] キャッシュ戦略の実装