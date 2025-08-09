# ローカル開発環境構築

Odyssage プロジェクトのローカル開発環境のセットアップ・起動手順

## 📋 概要

本ガイドでは、開発者のローカル機械で完全なOdyssage開発環境を構築する手順を説明します。

### 環境構成
- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Hono.js + Cloudflare Workers (local)
- **データベース**: PostgreSQL (Docker) + Neo4j (Docker)
- **認証**: Firebase Emulator
- **開発ツール**: VS Code + Foam拡張

## 🚀 クイックセットアップ

### 前提条件
- **Node.js**: 18.x以上
- **Bun**: 最新版
- **Docker**: Desktop または Engine + Compose
- **Git**: バージョン管理

### 一括起動
```bash
# リポジトリクローン
git clone https://github.com/hibohiboo/odyssage.git
cd odyssage

# 依存関係インストール
bun install

# 全サービス起動（Docker必要）
bun run local:all
```

## 📦 詳細セットアップ

### 1. 基本依存関係

#### Node.js & Bun インストール
```bash
# Bun インストール (推奨)
curl -fsSL https://bun.sh/install | bash

# Node.js 18+ がない場合
# https://nodejs.org/ からダウンロード
```

#### Git設定
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 2. Docker環境構築

#### Docker Desktop (Windows/Mac)
- [Docker Desktop](https://docs.docker.com/desktop/)をダウンロード・インストール
- WSL2統合を有効にする（Windows）

#### 動作確認
```bash
docker --version
docker compose version
```

### 3. 環境変数設定

#### `.env.local` 作成
```bash
# プロジェクトルートに作成
cp .env.example .env.local
```

#### 基本設定例
```bash
# Database
NEON_CONNECTION_STRING=postgresql://odyssage:password@localhost:5432/odyssage_dev
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Authentication
FIREBASE_PROJECT_ID=odyssage-dev-local

# CORS
CORS_ORIGINS=http://localhost:3000

# Development
NODE_ENV=development
```

### 4. データベース起動

#### PostgreSQL (Neon模擬)
```bash
# Neonローカル起動
cd infra/local/neon_local
docker compose up -d

# 接続確認
psql postgresql://odyssage:password@localhost:5432/odyssage_dev
```

#### Neo4j
```bash
# Neo4j起動
cd infra/local/neo4j  
docker compose up -d

# ブラウザでアクセス
# http://localhost:7474/browser/
# User: neo4j, Password: password
```

### 5. Firebase Emulator

#### 起動手順
```bash
# Firebase Emulatorコンテナ起動
cd infra/local/firebase
docker compose up -d

# コンテナ内でセットアップ（初回のみ）
./bin/bash.sh
firebase login
firebase init  # Emulatorsを選択
# firebase.jsonのホストに 0.0.0.0 を追加
```

#### アクセス確認
- **Emulator UI**: http://127.0.0.1:4000/
- **Auth Emulator**: http://127.0.0.1:9099/
- **Firestore Emulator**: http://127.0.0.1:8080/

### 6. アプリケーション起動

#### 前提条件の確認
**フロントエンド起動前**:
- Firebase エミュレータが `localhost:9099` で稼働していること
- バックエンドAPIが `localhost:8787` で稼働していること

**バックエンド起動前**:
- Firebase エミュレータが `localhost:9099` で稼働していること

#### 開発サーバー起動
```bash
# 全サービス一括起動
bun run local:all

# または個別起動（依存関係順序重要）
# 1. Firebase Emulator起動
cd infra/local/firebase && docker compose up -d

# 2. バックエンドAPI起動  
bun run dev:backend   # http://localhost:8787

# 3. フロントエンド起動
bun run dev:frontend  # http://localhost:3000
```

#### 動作確認
1. **フロントエンド**: http://localhost:3000
2. **API**: http://localhost:8787/api/health
3. **Neo4j Browser**: http://localhost:7474
4. **Firebase UI**: http://127.0.0.1:4000

#### E2Eテスト準備
**Playwright初回設定**（手動実行必要）:
```bash
# Playwrightブラウザインストール
npx playwright install
```

## 🔧 開発ツール設定

### VS Code拡張
```json
{
  "recommendations": [
    "foam.foam-vscode",           // Foam知識管理
    "bradlc.vscode-tailwindcss",  // Tailwind CSS
    "esbenp.prettier-vscode",     // コードフォーマット
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Foamナレッジグラフ
```bash
# VS Codeでプロジェクト開く
code .

# Foam拡張でグラフビュー確認
# Ctrl+Shift+P → "Foam: Show Graph"
```

## 🛠️ よくある問題

### Docker関連

#### ポート衝突
```bash
# ポート使用状況確認
netstat -an | grep :5432  # PostgreSQL
netstat -an | grep :7687  # Neo4j
netstat -an | grep :4000  # Firebase

# プロセス停止
sudo lsof -ti:5432 | xargs kill -9
```

#### Docker起動失敗（Windows）
- **WSL2設定**: Docker Desktop設定でWSL2統合を有効化
- **Hyper-V**: Windows機能でHyper-Vを有効化
- **メモリ不足**: Docker Desktopのリソース設定を調整

### データベース接続

#### PostgreSQL接続エラー
```bash
# コンテナ状態確認
docker ps

# ログ確認
cd infra/local/neon_local
docker compose logs postgres

# 接続テスト
psql postgresql://odyssage:password@localhost:5432/odyssage_dev
```

#### Neo4j認証エラー
```bash
# 初期パスワード設定
# http://localhost:7474/browser/ にアクセス
# User: neo4j, Password: neo4j (初回)
# 新パスワードに変更後、.env.localを更新
```

### Firebase Emulator

#### 認証設定エラー
```bash
# firebase.json確認
{
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "0.0.0.0"  # 重要: 外部からアクセス可能にする
    }
  }
}
```

### アプリケーション

#### フロントエンドビルドエラー
```bash
# 依存関係再インストール
rm -rf node_modules
bun install

# TypeScript型チェック
cd apps/frontend
bunx tsc --noEmit
```

#### APIアクセスエラー
```bash
# CORS設定確認
# .env.localのCORS_ORIGINSを確認

# バックエンド起動確認
curl http://localhost:8787/api/health
```

## 🔄 開発フロー

### 日常開発
```bash
# 1. 全サービス起動
bun run local:all

# 2. 機能開発
# フロントエンド: apps/frontend/src/
# バックエンド: apps/backend/src/

# 3. テスト実行
bun run test              # 全テスト
bun run test:backend      # バックエンドのみ
bun run test:frontend     # フロントエンドのみ

# 4. 品質チェック
bun run lint              # ESLint
bun run build             # ビルド確認
```

### データベース操作
```bash
# PostgreSQL
psql postgresql://odyssage:password@localhost:5432/odyssage_dev

# Neo4j (ブラウザまたはCypher Shell)
http://localhost:7474/browser/
# または
docker exec -it neo4j cypher-shell -u neo4j -p password
```

### Firebase操作
```bash
# Emulator UI でユーザー・データ管理
http://127.0.0.1:4000/

# 認証テストユーザー作成
# Authentication タブで手動作成可能
```

## 📊 パフォーマンス最適化

### リソース使用量
- **RAM**: 最小8GB、推奨16GB以上
- **CPU**: 4コア以上推奨
- **ディスク**: SSD推奨（HDD不可）

### Docker最適化
```yaml
# docker-compose.yml例
services:
  postgres:
    mem_limit: 512m
    cpus: 1.0
  neo4j:
    mem_limit: 1g
    cpus: 1.0
```

---

## 📖 関連リソース

### インフラ設定
- `infra/local/firebase/` - Firebase Emulator設定
- `infra/local/neo4j/` - Neo4j Docker設定  
- `infra/local/neon_local/` - PostgreSQL (Neon)設定

### 開発ガイド
- [[../03-development/process]] - 開発プロセス・TDD実践
- [[../03-development/testing-strategy]] - テスト実行・設定
- [[../02-architecture/environment-variables]] - 環境変数詳細仕様

### 運用・デプロイ
- [[production]] - 本番環境設定・デプロイ手順
- [[../02-architecture/database-design]] - データベース設計理解

#deployment #local-development #docker #environment