# apps/backend

## 役割
Cloudflare Workers上で動作するAPIサーバーアプリケーションです。フロントエンドとデータベース間の橋渡しを行います。

## 責務
- **RESTful API**: HTTPエンドポイントの提供
- **認証・認可**: Firebase Authenticationとの連携
- **データアクセス**: PostgreSQL・Neo4jからのデータ取得・更新
- **ビジネスロジック**: アプリケーション層のビジネスロジック実装

## 構成
```
src/
├── index.ts           # エントリーポイント
├── middleware/        # 認証などのミドルウェア
│   └── authorizeMIddleware.ts
├── route/             # APIルート定義
│   ├── gm.ts
│   ├── session.ts
│   └── user.ts
└── utils/             # ユーティリティ
    ├── generateUUID.ts
    ├── logger.ts
    └── verifyJWT.ts
```

## 技術スタック
- **Cloudflare Workers**: サーバーレス実行環境
- **Hono.js**: 軽量Webフレームワーク
- **Firebase Auth**: 認証基盤
- **TypeScript**: 型安全性

## API設計原則
- **OpenAPI First**: docs/redocly/openapi/api.yamlに従った実装
- **RESTful**: リソース指向の設計
- **エラーハンドリング**: 一貫したエラーレスポンス
- **CORS**: 適切なクロスオリジン設定

## 認証フロー
1. Firebaseトークンの検証
2. JWTの有効性確認
3. ユーザー情報の取得・認可

## 依存関係
- **@odyssage/database**: データアクセス
- **@odyssage/schema**: リクエスト/レスポンス検証
- **@odyssage/graph-database**: 複雑な関係性クエリ

## デプロイ
- **環境**: Cloudflare Workers
- **設定**: wrangler.toml
- **環境変数**: JWT_PUBLIC_KEY, CORS_ORIGINS など

## 開発フロー
1. OpenAPI仕様を先に定義
2. Valibotスキーマでバリデーション実装
3. 統合テストでAPIの動作確認
4. Cloudflare Workersにデプロイ