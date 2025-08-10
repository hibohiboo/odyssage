# 開発環境構築

Odyssage プロジェクトの開発環境セットアップ手順

## 前提条件

### 必須ツール

- **Node.js**: 18.x 以上
- **Bun**: パッケージマネージャー
- **Docker**: ローカル開発用データベース環境
- **Git**: ソースコード管理

### 推奨ツール

- **VS Code**: 開発エディタ（Foam拡張対応）
- **Postman**: API テスト
- **pgAdmin**: PostgreSQL管理
- **Neo4j Browser**: グラフDB管理

## インストール手順

### 1. Node.js & Bun セットアップ

```bash
# Node.js インストール（推奨: nvm使用）
nvm install 18
nvm use 18

# Bun インストール
curl -fsSL https://bun.sh/install | bash
```

### 2. Docker セットアップ

```bash
# Docker Desktop インストール（Windows/Mac）
# https://www.docker.com/products/docker-desktop

# Docker 動作確認
docker --version
docker-compose --version
```

### 3. リポジトリクローン

```bash
# GitHub からクローン
git clone https://github.com/hibohiboo/odyssage.git
cd odyssage

# 依存関係インストール
bun install
```

## ローカル開発環境起動

### 1. データベース起動

```bash
# 全サービス起動（PostgreSQL + Neo4j + Firebase Emulator）
bun run local:all

# 個別起動も可能
bun run local:rdb      # PostgreSQL のみ
bun run local:graphdb  # Neo4j のみ
bun run local:firebase # Firebase Emulator のみ
```

### 2. アプリケーション起動

```bash
# 全アプリケーション起動
bun run dev

# 個別起動
bun run dev:frontend  # フロントエンド開発サーバー
bun run dev:backend   # バックエンド開発サーバー
```

### 3. 動作確認

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8787
- **Neo4j Browser**: http://localhost:7474
- **pgAdmin**: http://localhost:5050

## 環境設定

### 環境変数設定

```bash
# バックエンド環境変数（apps/backend/.dev.vars）
cp apps/backend/.dev.vars.example apps/backend/.dev.vars

# 必要に応じて値を編集
```

詳細は [[../02-architecture/environment-variables]] を参照

### VS Code 設定

推奨拡張機能：

```json
{
  "recommendations": [
    "foam.foam-vscode",
    "bradlc.vscode-tailwindcss", 
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## データベース初期設定

### PostgreSQL

```bash
# マイグレーション実行
cd packages/database
bun run db:migrate

# 初期データ投入
bun run db:seed
```

### Neo4j

```bash
# グラフDB スキーマ設定
cd packages/graph-database  
bun run setup
```

## トラブルシューティング

### よくある問題

#### ポート競合エラー

```bash
# 使用中ポート確認
lsof -i :5173  # フロントエンド
lsof -i :8787  # バックエンド
lsof -i :7474  # Neo4j

# プロセス停止
kill -9 <PID>
```

#### Docker 起動エラー

```bash
# Docker サービス再起動
docker-compose down
docker-compose up -d

# ログ確認
docker-compose logs
```

#### 依存関係エラー

```bash
# node_modules クリーンアップ
rm -rf node_modules
bun install

# キャッシュクリア
bun run clean
```

### ログ確認

各サービスのログ確認方法：

```bash
# アプリケーションログ
bun run dev:frontend  # Terminal 1
bun run dev:backend   # Terminal 2

# データベースログ
docker-compose logs postgres
docker-compose logs neo4j
```

## 開発ツール設定

### API テスト（Postman）

1. Postmanコレクション読み込み
2. 環境変数設定（local development）
3. 認証トークン設定

### データベース管理

#### pgAdmin設定

- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

#### Neo4j Browser

- URL: http://localhost:7474
- Username: neo4j
- Password: password

## 次のステップ

環境構築完了後：

1. [[quick-start]] - 開発開始手順
2. [[../03-development/process]] - 開発プロセス理解  
3. [[../02-architecture/overview]] - システム理解

---

## 関連リソース

- [[quick-start]] - クイック スタート ガイド
- [[../04-deployment/local-environment]] - 詳細環境構築手順
- [[../03-development/process]] - 開発プロセス
- [[../00-index]] - ドキュメントハブ

#getting-started #setup #environment #development