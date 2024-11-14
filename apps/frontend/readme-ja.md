# 作業に入る前に

playwrightは手動でローカル環境にいれる必要がある

```
 npx playwright install  
```

# フォルダ構成

```
odysseyage/
├── apps/
│   ├── frontend/            # フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── app/         # グローバルなアプリケーション設定（ルート、状態管理など）
│   │   │   ├── entities/    # ドメインエンティティ（Character, Scenarioなど）
│   │   │   ├── features/    # ドメイン機能（キャラクター管理、シナリオ管理など）
│   │   │   ├── pages/       # ページコンポーネント
│   │   │   ├── shared/      # 共通コンポーネント、ユーティリティ
│   │   │   └── widgets/     # UIウィジェット（ヘッダー、フッターなど）
│   │   └── tests/           # テスト関連（ユニットテスト、E2Eテスト）
├── packages/
│   ├── core/                # 共通のコアロジック（DDDのドメイン層に相当）
│   │   ├── character/       # キャラクター文脈
│   │   ├── scenario/        # シナリオ文脈
│   │   ├── session/         # セッション文脈
│   │   └── party/           # パーティ文脈
│   ├── ui/                  # UIコンポーネントライブラリ
│   └── utils/               # 共通ユーティリティ
├── docs/                    # 設計ドキュメント
└── package.json
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
