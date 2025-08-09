# Odyssage - はじめに

## プロジェクト概要

Odyssage は「**未知を辿る、非同期型ゲームブック風TRPG**」をコンセプトとしたWebアプリケーションです。

### コンセプト
- **選択肢を広げられるゲームブック**: 従来の固定分岐ではなく、動的に展開する物語
- **非同期TRPG**: リアルタイム参加が困難な人も楽しめる時間自由なゲーム体験
- **協調創作**: プレイヤー同士が物語を共創していく仕組み

## 技術構成

### アーキテクチャ概要
```
フロントエンド (React + TypeScript + Vite)
    ↕ API通信
バックエンド (Hono.js + Cloudflare Workers)
    ↕ データ永続化
データベース (PostgreSQL + Neo4j)
```

### 主要技術選定理由

#### **ハイブリッドDB構成**
- **PostgreSQL**: 確実性が必要なユーザー情報・セッション管理
- **Neo4j**: 複雑な物語分岐・キャラクター関係性の表現

#### **モノレポ構成**
- **Feature-Sliced Design**: フロントエンドの保守性向上
- **DDD**: ドメイン中心設計によるビジネスロジック整理

## ブランチ戦略

### Git Flow ベース
```
main ← release/X.X.X ← develop ← id/{issue番号}/feature
```

- **main**: 本番環境デプロイ用
- **develop**: 開発統合ブランチ  
- **feature**: `id/{issue番号}/機能名` で機能開発
- **release**: ステージング環境デプロイ・本番準備

### デプロイフロー
1. `develop` → `release/X.X.X` 作成時: **ステージング環境**デプロイ
2. `release/X.X.X` → `main` マージ時: **本番環境**デプロイ + タグ付け

## プロジェクト構成

### ディレクトリ概要
```
odyssage/
├── apps/
│   ├── frontend/     # React アプリケーション
│   └── backend/      # Hono.js API サーバー
├── packages/
│   ├── database/     # DB接続・マイグレーション  
│   ├── schema/       # 共通スキーマ定義
│   └── bdd-e2e-test/ # E2Eテスト
├── docs/             # ドキュメント（本ディレクトリ）
└── infra/            # インフラ設定
```

### Feature-Sliced Design (フロントエンド)
```
apps/frontend/src/
├── app/          # グローバルなアプリケーション設定（ルート、状態管理など）
├── pages/        # ページコンポーネント
├── widgets/      # UIウィジェット（ヘッダー、フッターなど）
├── features/     # ドメイン機能（キャラクター管理、シナリオ管理など）
├── entities/     # ドメインエンティティ（Character, Scenarioなど）
└── shared/       # 共通コンポーネント、ユーティリティ
```

### バックエンドAPI構造
```
apps/backend/src/
├── index.ts           # エントリーポイント
├── middleware/        # 認証などのミドルウェア
│   └── authorizeMIddleware.ts
├── route/             # APIルート定義
│   ├── gm.ts          # ゲームマスター関連API
│   ├── session.ts     # セッション管理API
│   └── user.ts        # ユーザー管理API
└── utils/             # ユーティリティ
    ├── generateUUID.ts
    ├── logger.ts
    └── verifyJWT.ts
```

### 共有パッケージ
```
packages/
├── core/              # 共通のコアロジック（DDDのドメイン層）
│   ├── character/     # キャラクター文脈
│   ├── scenario/      # シナリオ文脈
│   ├── session/       # セッション文脈
│   └── party/         # パーティ文脈
├── database/          # PostgreSQL・Neo4jアクセス
├── graph-database/    # Neo4j専用クエリライブラリ
├── schema/            # API・DB スキーマ定義（Valibot）
├── ui/                # UIコンポーネントライブラリ
└── bdd-e2e-test/      # BDD E2Eテスト（Playwright + Cucumber）
    ├── e2e/
    │   ├── features/  # Gherkin シナリオファイル
    │   └── tests/     # ステップ定義ファイル
    └── utils/         # テストユーティリティ
```

## 開発環境

### 前提条件
- **Node.js**: 18.x以上
- **Bun**: パッケージマネージャー（npmの代替）
- **Docker**: ローカルデータベース環境
- **VS Code**: 推奨エディタ（Foam拡張対応）

### クイック スタート
```bash
# リポジトリクローン
git clone https://github.com/hibohiboo/odyssage.git
cd odyssage

# 依存関係インストール
bun install

# ローカル環境起動
bun run local:all
```

詳細は [[setup]] を参照してください。

## 学習リソース

### プロジェクト理解
1. [[setup]] - 環境構築手順
2. [[quick-start]] - 開発開始手順
3. [[../02-architecture/overview]] - システム全体設計

### 開発者向け
1. [[../03-development/process]] - 開発プロセス
2. [[../03-development/sprints/README]] - スプリント運用
3. [[../02-architecture/database-design]] - DB設計思想

### 参考リンク
- [GitHub Repository](https://github.com/hibohiboo/odyssage)
- [本体サイト](https://odyssage.com)（予定）
- [テーマソング](https://soundcloud.com/example)（予定）

## コンセプト詳細

### 「未知を辿る」の意味
従来のTRPGは事前に用意されたシナリオに沿って進行しますが、Odyssage では：

- **動的物語生成**: プレイヤーの選択によって新しい展開が生まれる
- **予測不可能な体験**: GM（ゲームマスター）も含めて誰も結末を知らない
- **探索的創作**: 参加者全員で未知の物語世界を創造

### 非同期プレイの利点
- **時間制約なし**: 都合の良い時間に参加・行動選択
- **熟考可能**: じっくり考えてから行動決定
- **継続参加**: 長期間にわたる壮大な物語展開
- **グローバル参加**: 時差を気にせず世界中から参加可能

---

## 関連ドキュメント
- [[setup]] - 環境構築詳細
- [[quick-start]] - 開発開始手順
- [[../00-index]] - ドキュメント全体ハブ

#getting-started #overview #concept