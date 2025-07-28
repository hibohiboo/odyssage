# シナリオ作成用データベーススキーマ設計

## 概要
シナリオ作成機能に特化したハイブリッドDB構成の設計書です。

## 設計方針
- **PostgreSQL**: シナリオメタデータ（既存テーブル活用）
- **Neo4j**: シナリオ構造・フロー（新規実装）
- **分離原則**: 作成時シナリオとゲームプレイ時は別管理（将来実装）

## PostgreSQL スキーマ（既存）

### scenariosテーブル
```sql
scenarios (
  id UUID PRIMARY KEY,              -- シナリオID
  title TEXT NOT NULL,              -- タイトル
  userId VARCHAR(64) REFERENCES users(id), -- 作成者ID
  overview TEXT DEFAULT '',         -- 概要
  visibility VARCHAR(10) DEFAULT 'private', -- 公開設定
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

**変更なし**: 既存テーブルをそのまま活用

## Neo4j スキーマ（新規）

### ノード設計

#### 1. Scenarioノード
```cypher
(:Scenario {
  id: string,        -- PostgreSQLのscenarios.idと同一
  title: string,
  overview: string,
  userId: string,
  visibility: string,
  createdAt: datetime,
  updatedAt: datetime
})
```

#### 2. Sceneノード
```cypher
(:Scene {
  id: string,        -- UUID
  title: string,     -- シーン名
  description: string, -- シーン説明
  order: integer,    -- シーン順序
  scenarioId: string, -- 親シナリオID
  createdAt: datetime,
  updatedAt: datetime
})
```

#### 3. Eventノード
```cypher
(:Event {
  id: string,        -- UUID
  title: string,     -- イベント名
  description: string, -- イベント説明
  order: integer,    -- イベント順序
  sceneId: string,   -- 親シーンID
  createdAt: datetime,
  updatedAt: datetime
})
```

#### 4. Messageノード
```cypher
(:Message {
  id: string,        -- UUID
  text: string,      -- メッセージテキスト
  order: integer,    -- メッセージ順序
  eventId: string,   -- 親イベントID
  createdAt: datetime,
  updatedAt: datetime
})
```

#### 5. Choiceノード
```cypher
(:Choice {
  id: string,        -- UUID
  text: string,      -- 選択肢テキスト
  order: integer,    -- 選択肢順序
  messageId: string, -- 親メッセージID
  targetEventId: string, -- 遷移先イベントID
  conditions: string,    -- 条件（JSON文字列、将来拡張用）
  createdAt: datetime,
  updatedAt: datetime
})
```

### リレーションシップ設計

#### 階層構造リレーションシップ
```cypher
(:Scenario)-[:HAS_SCENE]->(:Scene)
(:Scene)-[:HAS_EVENT]->(:Event)  
(:Event)-[:HAS_MESSAGE]->(:Message)
(:Message)-[:HAS_CHOICE]->(:Choice)
```

#### フロー構造リレーションシップ
```cypher
(:Choice)-[:LEADS_TO]->(:Event)
```

### インデックス設計（将来実装）
```cypher
-- Phase 2以降で実装予定
-- 基本検索用インデックス
-- 階層検索用インデックス  
-- 順序検索用インデックス
```

**注意**: パフォーマンス最適化は将来のPhase 2以降で実装。MVP段階では基本機能の動作確認を優先。

## データ作成フロー

### 1. シナリオ作成
```
1. PostgreSQL: scenariosテーブルにメタデータ挿入
2. Neo4j: Scenarioノード作成（同じIDを使用）
```

### 2. シーン追加
```
1. Neo4j: Sceneノード作成
2. Neo4j: Scenario-[:HAS_SCENE]->Scene リレーションシップ作成
```

### 3. イベント追加
```
1. Neo4j: Eventノード作成
2. Neo4j: Scene-[:HAS_EVENT]->Event リレーションシップ作成
```

### 4. メッセージ・選択肢追加
```
1. Neo4j: Messageノード作成
2. Neo4j: Event-[:HAS_MESSAGE]->Message リレーションシップ作成
3. Neo4j: Choiceノード作成
4. Neo4j: Message-[:HAS_CHOICE]->Choice リレーションシップ作成
5. Neo4j: Choice-[:LEADS_TO]->Event リレーションシップ作成
```

## データ整合性

### 同期戦略
- **シナリオメタデータ**: PostgreSQLがマスター
- **構造データ**: Neo4jがマスター
- **ID一致**: Scenarioノードは必ずPostgreSQLと同じIDを使用

### 削除戦略
```cypher
-- カスケード削除（Neo4j）
MATCH (s:Scenario {id: $scenarioId})
DETACH DELETE s
-- 関連するScene, Event, Message, Choiceも自動削除
```

## 制約事項

### 現在スコープ（Phase 1 - MVP）
- ✅ シナリオ作成・編集機能
- ✅ 基本的なフロー構造
- ✅ メタデータ管理
- ✅ 基本的なCRUD操作

### 将来スコープ（Phase 2以降）
- ❌ プレイヤー進行状況管理
- ❌ 作成時とプレイ時の分離
- ❌ 複雑な条件分岐
- ❌ 統計・分析機能
- ❌ パフォーマンス最適化（インデックス等）
- ❌ キャッシュ戦略

## 期待される利点

### PostgreSQL側
- 既存システムとの互換性維持
- 高速なメタデータ検索
- バックアップ・復旧の安定性

### Neo4j側
- 複雑なシナリオ構造の自然な表現
- フロー関係の効率的な検索
- 将来の分析機能への拡張性

## 実装順序

1. **Neo4jノード作成関数** - 各ノードのCRUD操作
2. **リレーションシップ管理関数** - 関係性の作成・削除
3. **ハイブリッドリポジトリ** - PostgreSQL + Neo4jの統合操作
4. **シナリオ作成サービス** - 上位レイヤーでの業務ロジック