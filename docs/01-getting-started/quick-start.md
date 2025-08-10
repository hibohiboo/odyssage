# クイック スタート ガイド

Odyssage の開発を素早く開始するためのガイド

## 🚀 5分で始める

### ステップ 1: 環境確認

```bash
# 必要ツールの確認
node --version     # v18.x 以上
bun --version      # 最新版
docker --version   # Docker Desktop
git --version      # Git
```

未インストールの場合は [[setup]] を参照

### ステップ 2: プロジェクト取得

```bash
# リポジトリクローン
git clone https://github.com/hibohiboo/odyssage.git
cd odyssage

# 依存関係インストール（約1分）
bun install
```

### ステップ 3: サービス起動

```bash
# データベース起動（約30秒）
bun run local:all

# アプリケーション起動（別ターミナル）
bun run dev
```

### ステップ 4: 動作確認

ブラウザで以下にアクセス：

- **フロントエンド**: http://localhost:5173
- **API ドキュメント**: http://localhost:8787/docs
- **Neo4j ブラウザ**: http://localhost:7474

## 🛠️ 開発開始

### 最初のタスク

1. **Issue 確認**: GitHub Issues から作業を選択
2. **ブランチ作成**: `id/{issue番号}/機能名` で作成
3. **開発環境テスト**: テストが通ることを確認

```bash
# 新しいfeatureブランチ作成
git checkout -b id/123/new-feature

# テスト実行
bun run test
```

### 開発フロー理解

重要な開発ドキュメント：

- [[../03-development/process]] - 開発プロセス全体
- [[../03-development/sprints/README]] - スプリント運用
- [[../02-architecture/api-design]] - API設計指針

## 📝 コーディング開始

### フロントエンド開発

```bash
# フロントエンド開発
cd apps/frontend

# 開発サーバー起動
bun run dev

# 新しいコンポーネント作成
bun run generate:component MyComponent
```

**Feature-Sliced Design** 構造：

```
apps/frontend/src/
├── entities/   # ドメインエンティティ
├── features/   # ビジネス機能
├── widgets/    # UIコンポーネント
└── pages/      # ページコンポーネント
```

### バックエンド開発

```bash
# バックエンド開発
cd apps/backend

# 開発サーバー起動
bun run dev

# 新しいAPIエンドポイント作成
# 1. OpenAPI仕様定義（必須）
# 2. ルート実装
# 3. テスト作成
```

**API開発順序**：
1. `docs/redocly/openapi/api.yaml` でAPI仕様定義
2. `apps/backend/src/route/` にルート実装
3. `apps/backend/src/**/*.test.ts` でテスト作成

## 🧪 テスト実行

### 単体テスト

```bash
# 全テスト実行
bun run test

# パッケージ別実行
cd packages/core && bun run test
cd apps/frontend && bun run test
```

### E2Eテスト

```bash
# BDD E2Eテスト実行
cd packages/bdd-e2e-test
bun run test:e2e
```

### テスト駆動開発（TDD）

Odyssage では **TDD** を実践：

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限の実装
3. **Refactor**: コードを改善

詳細は [[../03-development/process]] 参照

## 🗃️ データベース操作

### PostgreSQL

```bash
# データベース接続
bun run db:studio

# マイグレーション
cd packages/database
bun run db:migrate
```

### Neo4j グラフDB

```bash
# Neo4j Browser で接続
# http://localhost:7474
# Username: neo4j, Password: password

# Cypherクエリ例
MATCH (n) RETURN n LIMIT 10
```

詳細は [[../02-architecture/database-design]] 参照

## 📊 開発支援ツール

### コード品質

```bash
# Lint チェック
bun run lint

# フォーマット
bun run format

# 型チェック
bun run type-check
```

### API テスト

- **OpenAPI仕様書**: http://localhost:8787/docs
- **Postman**: `/docs/api/postman-collection.json` をインポート

### デバッグ

```bash
# デバッグモードで起動
DEBUG=1 bun run dev

# ログレベル設定
LOG_LEVEL=debug bun run dev:backend
```

## 🔄 コミット・プッシュ

### Git workflow

```bash
# 変更をステージング
git add .

# コミット（コンベンショナルコミット）
git commit -m "feat: add new feature"

# プッシュ
git push origin id/123/new-feature

# プルリクエスト作成
# GitHub上でPRを作成し、レビュー依頼
```

### コミットメッセージ規約

```
<type>(<scope>): <subject>

例:
feat(api): add user authentication endpoint
fix(ui): resolve button styling issue  
docs: update setup instructions
```

## 📈 次のステップ

### 詳細学習

1. **システム理解**: [[../02-architecture/overview]]
2. **開発プロセス**: [[../03-development/process]]
3. **デプロイ**: [[../04-deployment/README]]

### 実践的な学習

1. **既存のIssueに取り組む**
2. **コードレビューに参加**
3. **スプリント会議に参加**

### 開発チーム連携

- **Discord**: 日常的なコミュニケーション
- **GitHub Issues**: 作業管理・バグ報告
- **GitHub PR**: コードレビュー

## ❓ よくある質問

### Q: 開発サーバーが起動しない

**A**: ポート競合を確認してください

```bash
lsof -i :5173  # フロントエンド
lsof -i :8787  # バックエンド
```

### Q: データベース接続エラー

**A**: Docker サービスの状態確認

```bash
docker-compose ps
docker-compose logs
```

### Q: テストが失敗する

**A**: 環境をクリーンな状態に戻す

```bash
bun run clean
bun install
bun run test
```

### Q: 新しい機能を追加したい

**A**: 開発プロセスに従う

1. GitHub Issue を作成
2. [[../03-development/process]] の手順に従う
3. TDD で実装

---

## 🔗 関連リソース

- [[setup]] - 詳細セットアップ手順
- [[../03-development/process]] - 開発プロセス
- [[../02-architecture/overview]] - システム概要
- [[../00-index]] - ドキュメント全体

**困った時は**:
- GitHub Issues で質問
- Discord で相談
- [[../03-development/sprints/README]] でスプリント確認

#getting-started #quick-start #development #onboarding