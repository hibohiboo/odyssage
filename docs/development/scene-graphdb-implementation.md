# シーンをGraphDBに追加する機能の実装

## プロジェクト概要

シナリオの下位階層である「シーン」をNeo4jグラフデータベースに追加する機能を実装する。
フロントエンドからバックエンドAPIを通じて、GraphDBにシーンノードを作成し、シナリオとの関係性を構築する。

## アーキテクチャ分析

### 現在のシステム構成
- **フロントエンド**: React + TypeScript (Vite)
- **バックエンド**: Hono.js + Cloudflare Workers
- **データベース**: 
  - PostgreSQL (通常のCRUD操作)
  - Neo4j (グラフ構造・関係性データ)

### 既存のGraphDB機能
- シナリオのGraphDB保存機能が実装済み (`PUT /api/graph-scenarios/{id}`)
- Neo4j接続パッケージ (`@odyssage/graph-database`) が利用可能
- 既存のAPIパターンとスキーマ定義の規約が確立

## データモデル設計

### Neo4jシーンノード構造
```cypher
(:Scene {
  id: string,          // UUID
  title: string,       // シーンタイトル
  overview: string,    // シーン概要
  scenarioId: string,  // 親シナリオID
  order: integer,      // シーン順序
  createdAt: datetime, // 作成日時
  updatedAt: datetime  // 更新日時
})

// シナリオとシーンの関係性
(:Scenario)-[:HAS_SCENE]->(:Scene)
```

### API設計
- **エンドポイント**: `PUT /api/graph-scenes/{id}`
- **リクエスト**: JSON（id, title, overview, scenarioId, order）
- **レスポンス**: 作成されたシーン情報

## 実装計画

### TODO LIST

#### Phase 1: 設計・仕様書作成
- [ ] OpenAPI仕様書作成 (`docs/redocly/openapi/paths/graphScenes.yaml`)
- [ ] スキーマ定義 (`packages/schema/src/schema.ts`)
- [ ] バックエンド統合テスト作成

#### Phase 2: バックエンド実装
- [ ] GraphDBシーンルート実装 (`apps/backend/src/route/graphScene.ts`)
- [ ] Neo4jクエリ実装 (シーン作成・関係性構築)
- [ ] バックエンド統合テスト実行・成功確認

#### Phase 3: フロントエンド実装
- [ ] GraphDBシーンAPI Hook作成 (`useGraphSceneMutation.ts`)
- [ ] フロントエンドテスト作成
- [ ] シーン作成画面への統合

#### Phase 4: 品質保証・完了
- [ ] Lint・ビルドエラー解消
- [ ] E2Eテスト作成（BDD）
- [ ] 動作確認・完了記録

## 実装ガイドライン

### 1. データモデル設計
- シナリオIDによる親子関係の明確化
- order フィールドによるシーン順序管理
- 既存のシナリオノードとの関係性構築

### 2. API設計
- RESTful設計: `PUT /api/graph-scenes/{id}` (Upsert操作)
- 既存のgraph-scenariosパターンに従った命名・構造
- Valibotによるリクエスト検証

### 3. フロントエンド統合
- 既存のGraphDBパターン (`useGraphScenarioMutation`) を参考
- エラーハンドリング: GraphDB失敗時でもユーザー体験を保護
- 段階的統合: まず単体機能から、後でシナリオ編集画面に統合

### 4. テスト戦略
- テストファースト開発: テスト → 実装 → 動作確認
- 統合テスト: Neo4jとの実際の連携確認
- BDDテスト: ユーザーシナリオでのE2E確認

### 5. 品質保証手順
1. **バックエンドテスト**: `bun run test`
2. **フロントエンドテスト**: `npm run test`
3. **Lintチェック**: `npm run lint`
4. **ビルドチェック**: `npm run build`

## 進捗記録

### 2025-07-31 開始
- [x] プロジェクト要件分析完了
- [x] データモデル設計完了
- [x] 実装計画策定完了
- [ ] OpenAPI仕様書作成開始

### 設計判断の記録

#### 1. シーンのデータモデル設計
**判断**: シーンにscenarioIdとorderを含める
- **理由**: 
  - シナリオとの親子関係を明確にする
  - シーン順序管理でUI表示順序を制御
  - Neo4jの関係性とプロパティの両方で関連を表現
- **影響**: フロントエンドでのシーン順序表示が容易

#### 2. API設計パターンの踏襲
**判断**: `PUT /api/graph-scenes/{id}` でUpsert操作
- **理由**:
  - 既存の `PUT /api/graph-scenarios/{id}` パターンとの一貫性
  - Create/Update操作の統一
  - RESTful設計原則に準拠
- **影響**: 既存コードパターンの再利用、学習コストの削減

## 参考情報

### 関連ファイル
- `packages/graph-database/`: Neo4j接続管理
- `apps/backend/src/route/graphScenario.ts`: 既存GraphDBシナリオ実装
- `docs/redocly/openapi/paths/graphScenarios.yaml`: 既存API仕様
- `packages/schema/src/schema.ts`: バリデーションスキーマ

### 開発環境
- Neo4j起動: `npm run local:graphdb`
- バックエンド開発: `npm run dev:backend`
- フロントエンド開発: `npm run dev:frontend`