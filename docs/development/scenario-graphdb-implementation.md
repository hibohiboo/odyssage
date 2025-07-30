# シナリオ詳細をGraphDBに保存する機能の実装

## プロジェクト概要

シナリオ詳細をNeo4jグラフデータベースに保存する機能を実装する。
まずはシナリオのみを保存する基本機能を作成し、後で階層構造（Scene、Event、Message）を追加できる拡張性を確保する。

## アーキテクチャ分析

### 現在のシステム構成
- **フロントエンド**: React + TypeScript (Vite)
- **バックエンド**: Hono.js + Cloudflare Workers
- **データベース**: 
  - PostgreSQL (通常のCRUD操作)
  - Neo4j (グラフ構造・関係性データ)

### 既存のAPIパターン
- OpenAPI仕様書ベースのAPI設計 (`docs/redocly/openapi/`)
- Hono.jsでのルーティング (`apps/backend/src/route/`)
- Valibotでのリクエスト検証
- Neo4j接続は基本実装済み (`/graph-scenarios`エンドポイント)

## データモデル設計

### Neo4jシナリオノード構造
```cypher
(:Scenario {
  id: string,          // UUID
  title: string,       // シナリオタイトル
  overview: string,    // シナリオ概要
  authorId: string,    // 作成者ID
  visibility: string,  // 'public' | 'private'
  createdAt: datetime, // 作成日時
  updatedAt: datetime  // 更新日時
})
```

### 設計判断理由
1. **シンプルな開始**: まずはScenarioノードのみで基本機能を構築
2. **拡張性確保**: 後でScene、Event、Messageの階層構造を追加可能
3. **既存APIとの整合性**: PostgreSQLのScenarioテーブルとデータ構造を統一

## 実装計画

### TODO LIST

- [x] 既存のコードベース構造を調査（フロントエンド、バックエンド、DB接続）
- [x] 既存のAPIエンドポイントパターンを確認  
- [x] Neo4jのシナリオデータモデルを設計
- [ ] バックエンドAPIエンドポイント実装
  - [ ] スキーマ定義追加 (`@odyssage/schema`)
  - [ ] `POST /api/graph-scenarios` エンドポイント実装
  - [ ] 既存の`GET /api/graph-scenarios`改善
  - [ ] OpenAPI仕様書更新
- [ ] フロントエンド画面からAPIを呼び出す機能実装
  - [ ] シナリオ作成フォーム画面作成
  - [ ] APIクライアント統合
  - [ ] エラーハンドリング実装
- [ ] 動作テスト
  - [ ] Neo4jデータベース起動確認
  - [ ] API統合テスト
  - [ ] フロントエンド動作確認

## 実装ガイドライン

### 1. スキーマ設計
- Valibotを使用したリクエスト/レスポンス検証
- TypeScript型定義との整合性確保

### 2. Neo4j操作
- 既存の動的importパターンに従う（Vitest対応）
- 適切なエラーハンドリング実装
- セッション管理（作成・クローズ）

### 3. フロントエンド統合
- 既存のAPIクライアントパターンに従う
- React hooksでの状態管理
- エラー状態の適切な表示

### 4. テスト戦略
- Neo4jローカル環境での統合テスト
- APIエンドポイントの動作検証
- フロントエンドのユーザーフロー確認

### 5. 品質保証手順
1. **テスト実行**: `bun run test [ファイル名]`
2. **Lintチェック**: `bun run lint`
3. **型チェック**: `bunx tsc --noEmit`
4. **リファクタリング**: 重複コード削除、定数統一

## 進捗記録

### 2025-07-29
- [x] プロジェクト要件分析完了
- [x] 既存コードベース調査完了
- [x] データモデル設計完了
- [x] 実装計画策定完了
- [x] OpenAPI仕様書定義完了

### 設計判断の記録

#### 1. ドキュメント構成の整理
**判断**: `docs/architecture/`と`docs/development/`を分離
- **理由**: 長期的な設計指針と実装証跡を混在させない
- **影響**: メンテナンス性向上、目的別の文書管理

#### 2. GraphDB一覧取得エンドポイントの削除
**判断**: `GET /api/graph-scenarios`エンドポイントを削除
- **理由**: 
  - シナリオ一覧は既存の`/api/scenarios` (RDB)で十分
  - GraphDBは構造データ専用とする役割分担の明確化
  - 不要な重複APIの回避
- **影響**: シンプルなAPI設計、明確な責務分離

#### 3. GraphDBエンドポイントのRESTful化
**判断**: `POST /api/graph-scenarios` → `PUT /api/graph-scenarios/{id}`
- **理由**:
  - RESTfulな設計原則に従う（個別リソース操作にはIDをパスに含める）
  - RDBと同じIDを使用するため、パスパラメータが自然
  - Upsert操作でCreate/Updateを統一
- **影響**: 
  - より直感的なAPI設計
  - RDBとの連携処理が明確化

#### 4. 公開設定の管理分離
**判断**: 公開設定（visibility）はRDBでのみ管理
- **理由**:
  - 権限管理・認証ロジックとの密結合が必要
  - ACIDトランザクションでの確実な制御が重要
  - GraphDBは構造データに特化
- **影響**: データの責務が明確化、整合性確保

#### 5. 冗長データの許容
**判断**: title, overviewをGraphDBにも保存
- **理由**:
  - GraphDB内での検索・表示性能向上
  - RDB障害時の部分的な動作継続
  - 将来的なGraphDB単体での機能拡張への備え
- **トレードオフ**: ストレージ使用量増加 vs パフォーマンス・可用性向上

#### 6. テスト駆動開発の遵守不足
**判断**: 実装後にテスト作成（本来は逆順）
- **理由**: CLAUDE.mdの開発フロー「3. 統合テストでAPIの動作確認」を見落とし
- **修正対応**: 
  - 統合テストファイル作成: `graph-scenario.spec.ts`
  - テストファースト開発への修正
- **学習**: 設計書・開発指針の事前確認の重要性

#### 7. 既存パッケージの活用不足と環境変数統一
**判断**: 動的import重複 → 既存`@odyssage/graph-database`活用 → 環境変数統一
- **問題**: 
  - 各ルートで動的import・driver作成を重複実装
  - 環境変数の命名不統一（`NEO4J_URI` vs `NEO4J_URL`）
- **解決**:
  - 共有driverの活用でコード簡素化
  - 環境変数を`NEO4J_URL`、`NEO4J_USER`、`NEO4J_PASSWORD`に統一
  - 環境変数仕様書の作成（`docs/architecture/environment-variables.md`）
- **効果**: コード重複削除、命名一貫性確保、保守性向上

### 実装完了項目
- [x] スキーマ定義追加（`@odyssage/schema`）
- [x] GraphDBシナリオルート作成（`apps/backend/src/route/graphScenario.ts`）
- [x] 統合テスト作成（`test/integrations/graph-scenario.spec.ts`）
- [x] 既存graph-scenariosエンドポイント削除・置換
- [x] 統合テスト実行・デバッグ完了
- [x] Lintエラー修正・Typecheck完了
- [x] test-utilsリファクタリング（重複定数統一）
- [x] graph-databaseパッケージ統合（既存driverの活用）
- [x] 環境変数統一・仕様書作成（`docs/architecture/environment-variables.md`）

### 2025-07-30 追記（フロントエンド実装）

#### フロントエンド機能設計
**要件**:
- シナリオ作成時にRDBとGraphDB両方にデータ保存
- GraphDB失敗時でもユーザーには成功表示（RDBが主、GraphDBは補助）
- 適切なローディング・エラーハンドリング

**技術設計**:
- `useGraphScenarioMutation`: GraphDB保存専用hook
- `useScenarioWithGraphMutation`: RDB→GraphDBの統合処理hook
- 既存の`useScenarioCreateMutation`を活用

#### テスト駆動開発の実践
**テストファイル作成**:
- `useGraphScenarioMutation.test.ts`: GraphDB API単体テスト
- `useScenarioWithGraphMutation.test.ts`: 統合処理テスト

**テストケース設計**:
1. **GraphDB単体**: 成功・失敗・バリデーションエラー・独立性
2. **統合処理**: RDB→GraphDB順次処理・部分成功許容・状態管理

**設計判断**:
- GraphDB障害時のユーザー体験保護
- RDBを信頼できる情報源とする設計
- テストファーストによる期待動作の明確化

#### フロントエンド実装完了
**実装結果**:
- `useGraphScenarioMutation.ts`: GraphDB専用hook実装完了
- `useScenarioWithGraphMutation.ts`: 統合処理hook実装完了
- 全テストケース通過確認（GraphDB単体4件、統合処理5件）

**技術的解決事項**:
- テストファイルでのモック関連import問題を修正
- React hooks rulesに準拠した設計でESLint違反回避
- GraphDB失敗時の適切なログ出力・ユーザー体験保護を実装

### 次回作業予定
1. エンドツーエンド動作確認
2. 実装完了の証跡最終確認

## 参考情報

### 関連ファイル
- `packages/graph-database/`: Neo4j接続管理
- `apps/backend/src/route/index.ts`: 既存のgraph-scenariosエンドポイント
- `docs/redocly/openapi/`: API仕様書
- `packages/schema/`: バリデーションスキーマ

### 開発環境
- Neo4j起動: `npm run local:graphdb`
- バックエンド開発: `npm run dev:backend`
- フロントエンド開発: `npm run dev:frontend`