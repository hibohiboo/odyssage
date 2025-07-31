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

#### Phase 3: E2Eテスト・BDD作成 ✅
- [x] BDDテスト設計・作成 (`packages/bdd-e2e-test/e2e/features/scene-graphdb.feature`)
- [x] Step definitions作成 (`packages/bdd-e2e-test/e2e/step-definitions/scene.steps.ts`)
- [x] GraphDB連携・障害時のユーザーシナリオテスト設計

#### Phase 4: フロントエンド実装
- [ ] GraphDBシーンAPI Hook作成 (`useGraphSceneMutation.ts`)
- [ ] フロントエンドlint・ビルドエラー解消
- [ ] シーン作成画面への統合（将来タスク）

#### Phase 5: 品質保証・完了
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
- [x] OpenAPI仕様書作成完了

### Phase 1: 設計・仕様書作成完了
- [x] OpenAPI仕様書作成 (`docs/redocly/openapi/paths/graphScenes.yaml`)
- [x] スキーマ定義追加 (`packages/schema/src/schema.ts`)
- [x] バックエンド統合テスト作成 (`apps/backend/test/integrations/graph-scene.spec.ts`)

### Phase 2: バックエンド実装完了 ✅
- [x] GraphDBシーンルート実装 (`apps/backend/src/route/graphScene.ts`)
- [x] Neo4jクエリ実装（シーン作成・関係性構築）
- [x] バックエンドルート統合 (`apps/backend/src/route/index.ts`)
- [x] 統合テスト実行・成功確認（4/4テスト通過）
- [x] Lintチェック・エラー解消（改行コード問題修正）
- [x] OpenAPI仕様書とテストコード整合性チェック・修正完了

### Phase 3: E2Eテスト・BDD作成完了 ✅
- [x] BDDテスト設計・作成 (`packages/bdd-e2e-test/e2e/features/scene-graphdb.feature`)
- [x] Step definitions作成 (`packages/bdd-e2e-test/e2e/step-definitions/scene.steps.ts`)
- [x] GraphDB連携・障害時のユーザーシナリオテスト設計

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

#### 3. HTTPレスポンスコード201の削除
**判断**: OpenAPI仕様から201レスポンスを削除し、200のみに統一
- **当初設計**: 200(更新)と201(作成)の両方を定義
- **問題発見**: Neo4jのMERGE文では作成・更新の区別が困難
- **実装現実**: 既存の `graph-scenarios` APIも常に200を返している
- **修正判断**: 
  - 実装の複雑性を避け、200で統一
  - 「作成または更新されました」という統一メッセージに変更
  - 既存APIとの一貫性を保持
- **技術的理由**:
  - Neo4jのMERGE文は作成・更新を区別するために追加クエリが必要
  - パフォーマンス・複雑性と厳密なRESTfulness のトレードオフ
  - 既存システムとの整合性を優先
- **影響**: シンプルな実装、既存パターンとの一貫性確保

#### 4. テスト戦略の見直し
**判断**: Unit testより先にBDD E2Eテストを作成
- **当初計画**: フロントエンドHookのUnit testを先に作成
- **ユーザーフィードバック**: "hookの詳細テストをしてもうまみが少ない。BDDのほうを先に記載してください"
- **変更判断**:
  - Unit testはAPIクライアントのモックテストで価値が限定的
  - BDD E2Eテストはユーザーシナリオの観点で実際のビジネス価値を検証
  - Neo4jとの統合確認もBDDで実現可能
- **実装結果**:
  - `packages/bdd-e2e-test/e2e/features/scene-graphdb.feature`: 3つのユーザーシナリオ
  - `packages/bdd-e2e-test/e2e/step-definitions/scene.steps.ts`: Playwright + Cucumber実装
  - 既存パッケージ構造に従った実装
- **学習**: ユーザー視点でのテスト価値を優先する重要性

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