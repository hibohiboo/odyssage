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

# ブラウザ操作からPlaywrightのコードを作成

```
npx playwright codegen
```
