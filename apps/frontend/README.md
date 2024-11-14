# 作業に入る前に

playwrightは手動でローカル環境にいれる必要がある

```
 npx playwright install  
```

# e2eフォルダ構成

```
apps/frontend/
├── e2e/
│   ├── features/
│   │   └── characterList.feature      # Gherkin シナリオファイル
│   └── tests/
│       └── characterList.steps.ts          # ステップ定義ファイル
└── src/
```
