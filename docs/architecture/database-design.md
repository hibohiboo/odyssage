# データベース設計アーキテクチャ

## 概要

OdyssageではPostgreSQL（RDB）とNeo4j（GraphDB）の2つのデータベースを使い分けています。
それぞれの特性を活かした適切な役割分担を行い、データの整合性と性能を両立させます。

## データベース役割分担

### PostgreSQL（RDB）の役割

#### 担当データ
- **ユーザー管理**: ユーザー基本情報、認証情報
- **シナリオメタデータ**: シナリオの基本情報、公開設定、権限管理
- **セッション管理**: ゲームセッション情報、進行状態
- **在庫管理**: シナリオストック、お気に入り機能

#### 設計理由
- **ACID特性**: 一貫性が重要なデータ（公開設定、権限等）
- **リレーショナル構造**: 正規化されたデータ構造が適している
- **既存実装**: 現在のアプリケーションロジックとの整合性

### Neo4j（GraphDB）の役割

#### 担当データ
- **シナリオ構造**: Scene、Event、Messageの階層関係
- **フロー管理**: シナリオの分岐・合流構造
- **関係性データ**: ノード間の複雑な関係性

#### 設計理由
- **グラフ構造**: 階層的・ネットワーク的な関係表現に最適
- **トラバーサル性能**: パス検索や関係性クエリの高速実行
- **柔軟性**: 動的な構造変更への対応

## データ同期戦略

### 基本方針
- **Single Source of Truth**: 各データは1つのDBで管理
- **参照データ**: 必要に応じて他方のDBから参照
- **ID統一**: 両DB間でUUIDを使用した一意性確保

### 同期パターン

#### 1. シナリオ作成フロー
```
1. RDB: Scenarioレコード作成（メタデータ）
2. GraphDB: Scenarioノード作成（構造データ）
3. 両者でUUIDを共有
```

#### 2. データ参照フロー
```
- メタデータ参照: RDB → GraphDB（ID参照）
- 構造データ参照: GraphDB → RDB（ID参照）
- 複合クエリ: アプリケーション層で結合
```

## スキーマ設計

### RDB Schema（PostgreSQL）
```sql
-- 既存のScenariosテーブル
CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  overview TEXT,
  author_id VARCHAR(255) NOT NULL,
  visibility VARCHAR(10) DEFAULT 'private',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### GraphDB Schema（Neo4j）
```cypher
-- シナリオノード（構造データのみ）
(:Scenario {
  id: string,        -- RDBと共通のUUID
  title: string,     -- 冗長だが検索・表示用
  overview: string   -- 冗長だが検索・表示用
})

-- 将来の階層構造
(:Scene)-[:BELONGS_TO]->(:Scenario)
(:Event)-[:BELONGS_TO]->(:Scene)
(:Message)-[:BELONGS_TO]->(:Event)
```

## 設計判断の記録

### 1. 公開設定をRDBで管理する理由
- **権限管理**: 認証・認可ロジックと密結合
- **一貫性**: ACIDトランザクションでの確実な制御
- **既存実装**: 現在のAPI設計との整合性

### 2. タイトル・概要の冗長化
- **検索性能**: GraphDB内での検索・表示性能向上
- **運用性**: RDB障害時でもGraphDB単体での動作可能
- **トレードオフ**: ストレージ使用量 vs パフォーマンス

### 3. ID統一戦略
- **UUID使用**: 両DB間での一意性確保
- **外部キー回避**: GraphDBは外部キー制約がないため参照整合性はアプリケーション側で管理

## API設計への影響

### エンドポイント分離
- `/api/scenarios`: RDB管理（メタデータ、権限）
- `/api/graph-scenarios`: GraphDB管理（構造データ）

### レスポンス設計
```typescript
// RDB由来のデータ
interface ScenarioMetadata {
  id: string;
  title: string;
  overview: string;
  authorId: string;
  visibility: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
}

// GraphDB由来のデータ
interface ScenarioStructure {
  id: string;
  title: string;      // 冗長データ
  overview: string;   // 冗長データ
  // 将来: scenes, events, messages
}
```

## 実装ガイドライン

### 1. データ作成
- 両DBでのトランザクション管理
- 失敗時のロールバック戦略
- エラーハンドリング

### 2. データ更新
- 冗長データの同期更新
- 整合性チェック
- 部分更新の考慮

### 3. データ削除
- 両DBでの連携削除
- 関連データのカスケード処理
- 論理削除 vs 物理削除の選択

## 今後の拡張計画

### Phase 1: 基本機能（現在）
- Scenarioノードの作成・取得

### Phase 2: 階層構造
- Scene、Event、Messageノードの追加
- 階層関係の定義

### Phase 3: 高度な機能
- 分岐・合流フローの実装
- パス検索・推奨ルート機能
- 構造分析・可視化機能

## 注意事項

### データ整合性
- 両DB間のデータ同期遅延への対応
- 整合性チェック機能の実装
- モニタリング・アラート設定

### パフォーマンス
- N+1問題の回避
- 適切なインデックス設計
- キャッシュ戦略の検討

### 運用
- バックアップ・復旧戦略
- データマイグレーション手順
- 開発環境でのデータ同期