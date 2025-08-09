# 現在のデプロイ手順

Odyssage の**現在実装済み**のデプロイ手順・環境設定

## 📋 概要

本ドキュメントでは、**現在実際に動作している**デプロイ手順のみを記載します。将来予定の機能は含まれません。

### 実装済み環境構成
- **フロントエンド**: Cloudflare Pages (手動デプロイ)
- **バックエンドAPI**: Cloudflare Workers (手動デプロイ)
- **データベース**: Neon PostgreSQL + Neo4j Aura (基本設定のみ)
- **認証基盤**: Firebase Authentication (基本設定のみ)

## 🚀 手動デプロイ手順

### Cloudflare Pages (フロントエンド)
```bash
# フロントエンドビルド・デプロイ
cd apps/frontend
bun run build
npx wrangler pages deploy dist --project-name odyssage
```

### Cloudflare Workers (バックエンド)
```bash
# バックエンドAPI デプロイ
cd apps/backend
bun run build
npx wrangler deploy
```

## ⚙️ 現在の環境設定

### Cloudflare設定

#### Pages Environment Variables (実装済み)
```bash
# Production環境
VITE_API_BASE_URL=https://api.odyssage.com
VITE_FIREBASE_PROJECT_ID=odyssage-prod

# Build設定
Build command: bun run build
Build output directory: dist
Root directory: apps/frontend
```

#### Workers Environment Variables (実装済み)
```bash
# Secrets (wrangler secret put)
NEON_CONNECTION_STRING=postgresql://user:pass@host/db
NEO4J_PASSWORD=your-neo4j-password
NEO4J_URL=bolt+s://xxx.databases.neo4j.io:7687
NEO4J_USER=neo4j
FIREBASE_PROJECT_ID=odyssage-prod
```

### データベース設定 (基本のみ)

#### Neon PostgreSQL
- 基本接続設定のみ
- デフォルトユーザー・権限設定
- バックアップはNeonのデフォルト設定に依存

#### Neo4j Aura  
- 基本接続設定のみ
- デフォルトユーザー・権限設定
- バックアップはAuraのデフォルト設定に依存

### Firebase Authentication
- プロジェクト作成・基本設定のみ
- 認証プロバイダーの基本設定（Email/Password）

## 🔧 現在の制約事項

### 実装されていない機能
- **自動デプロイパイプライン**: GitHub Actions未設定
- **監視・アラート**: 基本的なダッシュボード確認のみ
- **詳細なセキュリティ設定**: WAF・IP制限・詳細権限未設定
- **バックアップ自動化**: 各サービスのデフォルト設定に依存
- **パフォーマンス最適化**: 基本設定のまま

### 手動で管理している項目
- **デプロイ**: 手動wranglerコマンド実行
- **環境変数更新**: 手動でCloudflareダッシュボードで設定
- **データベース管理**: 各サービスのコンソールで手動操作
- **監視**: 問題発生時の手動確認

## 🛠️ 基本的なトラブルシューティング

### デプロイ失敗時
```bash
# ビルドエラー確認
bun run build

# 型エラー・lint確認
bun run lint
bunx tsc --noEmit

# 再デプロイ
npx wrangler deploy
```

### 環境変数問題
```bash
# Workers環境変数確認
npx wrangler secret list

# 環境変数設定
npx wrangler secret put VARIABLE_NAME
```

### データベース接続問題
- **Neon**: Neon Consoleで接続状況確認
- **Neo4j**: Aura Consoleで接続状況確認
- **再起動**: 各サービスのコンソールで再起動実行

## 📚 次のステップ

現在のシンプルな構成から段階的に改善予定：

1. **GitHub Actions導入** → [[deployment-automation-plan]]
2. **監視強化** → [[monitoring-enhancement-plan]]  
3. **セキュリティ強化** → [[security-enhancement-plan]]

---

## 📖 関連リソース

### 現在の設定
- [[local-environment]] - ローカル開発環境
- [[../02-architecture/environment-variables]] - 環境変数仕様

### 将来計画
- [[production-roadmap]] - 本番環境改善ロードマップ
- [[deployment-automation-plan]] - デプロイ自動化計画

#deployment #current #production #manual