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

## 進捗記録

### 2025-07-29
- [x] プロジェクト要件分析完了
- [x] 既存コードベース調査完了
- [x] データモデル設計完了
- [x] 実装計画策定完了

### 次回作業予定
1. スキーマ定義の追加
2. バックエンドAPIエンドポイント実装開始

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