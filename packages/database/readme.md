1. src/schema.ts をもとにマイグレーション用のSQLを作成する。

```
drizzle-kit generate
```

2. マイグレーション用のSQLをNeonに反映する

```
npm run migrate
```

pushコマンドでも反映可能。

# ローカル環境

下記コマンドで設定

```
npm run migrate:local
```
