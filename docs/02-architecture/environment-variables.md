# 環境変数仕様

## 命名規約

### 基本原則
- **UPPERCASE_SNAKE_CASE**: 全て大文字、単語間はアンダースコア
- **接頭辞**: サービス名またはカテゴリを明示
- **簡潔性**: 意味が明確で最小限の長さ

### カテゴリ別命名規則

#### データベース接続
```bash
# PostgreSQL (Neon)
NEON_CONNECTION_STRING=postgresql://user:pass@host:port/db

# Neo4j
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

#### 認証・セキュリティ
```bash
# Firebase Authentication
FIREBASE_PROJECT_ID=your-project-id

# JWT
JWT_PUBLIC_KEY=your-jwt-public-key
```

#### アプリケーション設定
```bash
# CORS設定
CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# 実行環境
CLOUDFLARE_ENV=development|staging|production
```

## 環境別設定

### 開発環境
- **ローカル開発**: `.env`ファイルまたはプロセス環境変数
- **テスト**: テストスイート内で動的設定

### 本番環境
- **Cloudflare Workers**: Wranglerによる環境変数管理
- **セキュリティ**: 機密情報はCloudflareのSecretsで管理

## 設定例

### ローカル開発用 `.env`
```bash
# Database
NEON_CONNECTION_STRING=postgresql://user:pass@localhost:5432/odyssage_dev
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Authentication
FIREBASE_PROJECT_ID=odyssage-dev
JWT_PUBLIC_KEY=your-dev-jwt-key

# CORS
CORS_ORIGINS=http://localhost:3000
```

### テスト環境
```bash
# テストスイート内で動的に設定
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

## 移行履歴

### 2025-07-30: Neo4j環境変数統一
- **変更前**: `NEO4J_URI`, `NEO4J_USERNAME` (互換性維持)
- **変更後**: `NEO4J_URL`, `NEO4J_USER` (統一)
- **理由**: 一貫性向上、保守性確保

## 注意事項

### セキュリティ
- **機密情報**: パスワード、APIキーは環境変数で管理
- **コミット禁止**: `.env`ファイルはGitにコミットしない
- **本番分離**: 開発環境と本番環境の設定を分離

### 保守性
- **文書化**: 新しい環境変数追加時はこの文書を更新
- **検証**: 環境変数の設定漏れチェック機能の実装推奨
- **型安全性**: TypeScript環境変数定義の活用推奨

---

## 📖 関連リソース

### アーキテクチャ
- [[database-design]] - データベース設計・接続設定
- [[api-design]] - API設計・認証方式
- [[overview]] - システム全体構成

### 開発・運用
- [[../03-development/process]] - 開発プロセス・環境構築
- [[../04-deployment/local-environment]] - ローカル環境構築詳細
- [[../04-deployment/production]] - 本番環境・セキュリティ設定

#architecture #configuration #environment #security