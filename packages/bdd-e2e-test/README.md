# init

```
 npx playwright install  
```

# e2e folder

```
apps/frontend/
└── src/
pacakages/bdd-e2e-test
├── e2e/
│   ├── playwright/                 # e2eテスト
│   ├── features/                   # BDDテスト
│   │   └── characterList.feature   # Gherkin シナリオファイル
│   └── tests/
│       └── characterList.steps.ts  # ステップ定義ファイル
```

# テストの順番

`e2e-test`で作成したアカウントをBDDテストで利用するので、まずはこのテストを実行すること。

```
bun run e2e-test
```

次にBDDのテストを行う。

```
bun run bdd-test
```

## GraphDB連携テスト

Neo4jが起動している状態でGraphDB連携のBDDテストを実行できます：

```
# Neo4j起動
npm run local:graphdb

# GraphDB連携テスト実行
bun run bdd-test --name "GraphDB"
```

### 環境変数

GraphDBテストでは以下の環境変数を使用します：

- `NEO4J_URL`: Neo4jの接続URL（デフォルト: bolt://localhost:7687）
- `NEO4J_USER`: Neo4jユーザー名（デフォルト: neo4j）
- `NEO4J_PASSWORD`: Neo4jパスワード（デフォルト: password）

# ブラウザ操作からPlaywrightのコードを作成

```
npx playwright codegen
```
