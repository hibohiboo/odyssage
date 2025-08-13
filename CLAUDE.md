# Odyssage プロジェクト

## パッケージマネージャー
**このプロジェクトはBunを使用します。npmは使用しません。**

```bash
# ✅ 正しい
bun install
bun run dev
bun run test

# ❌ 使用禁止
npm install
npm run dev
npm test
```

## 構成
- **モノレポ**: Turboを使用したワークスペース管理
- **パッケージマネージャー**: Bun 1.2.20
- **フロントエンド**: React + Next.js
- **バックエンド**: Cloudflare Workers + Hono.js
- **データベース**: PostgreSQL + Neo4j

## 開発環境セットアップ
```bash
bun install
bun run local:all  # ローカル環境起動
bun run dev        # 開発サーバー起動
```

## テスト実行
```bash
bun run test                    # 全体テスト
cd apps/backend && bun run test # バックエンドテスト
```

## 重要な規則
1. **npm使用禁止**: 全てbunで実行する
2. **テスト構文**: `it()` を使用、`test()` は使用しない
3. **TypeScript**: 型安全性を重視
4. **OpenAPI First**: API設計はOpenAPI仕様から開始