<div><img src="./docs/astro/public/images/consept-art/top.png" /></div>

<div align="center">オデッサージュ</div>

---

# コンセプト

未知を辿る、非同期型ゲームブック風TRPG。
君だけの旅路を残す白い手帳。

# 開発環境

## ワークスペース

[Bun workspace で始めるモノレポ生活](https://azukiazusa.dev/blog/bun-workspace/)

## 最初にやること

```
npm install
npm run init
```

## フォルダ構成

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

### フォルダ構成のポイント

1.  **モノレポ構成**:
    *   `apps/` と `packages/` でプロジェクトを分離し、再利用性を高める。
    *   `core/` には、各文脈のドメインロジックが入る。
2.  **DDDとFSDの融合**:
    *   `entities/` や `features/` など、FSDのフォルダ構成を採用してドメイン層を分かりやすく配置。
    *   ドメイン層は `core/` 内の各パッケージに分け、DDDの概念に沿って設計。
3.  **テスト**:
    *   ユニットテスト、統合テスト、E2Eテストを `tests/` 内にまとめる。
4.  **設計ドキュメント**:
    *   `docs/` フォルダに、これまでのDDD設計資料をまとめて配置。
 

### キャラクター文脈のフォルダ構成

```
core/
└── character/
    ├── application/             # アプリケーション層（ユースケース）
    │   ├── createCharacter.ts   # キャラクター作成のユースケース
    │   ├── updateTag.ts         # タグ更新のユースケース
    │   └── deleteCharacter.ts   # キャラクター削除のユースケース
    ├── domain/                  # ドメイン層（ビジネスロジック）
    │   ├── Character.ts         # キャラクターエンティティ
    │   ├── Tag.ts               # タグエンティティ
    │   └── CharacterRepository.ts # リポジトリインターフェース
    ├── infrastructure/          # インフラ層（データアクセス）
    │   ├── CharacterRepositoryImpl.ts # リポジトリ実装
    │   └── DataSource.ts        # データソース
    ├── presentation/            # プレゼンテーション層（UIとの連携）
    │   ├── CharacterViewModel.ts # キャラクターの状態管理
    │   └── TagViewModel.ts      # タグの状態管理
    ├── tests/                   # テスト関連
    │   ├── unit/                # ユニットテスト
    │   │   ├── Character.test.ts
    │   │   └── Tag.test.ts
    │   ├── integration/         # 統合テスト
    │   │   └── CharacterIntegration.test.ts
    │   └── bdd/                 # BDDテスト（Cucumber.js）
    │       ├── features/        # Gherkinシナリオ
    │       │   └── character.feature
    │       └── step-definitions/ # ステップ定義
    │           └── characterSteps.ts
    └── utils/                   # 共通ユーティリティ
        └── validateTag.ts       # タグのバリデーション関数
```

### フォルダ構成のポイント

1.  **application/**:
    *   キャラクターの作成、更新、削除といったユースケースが実装される。
2.  **domain/**:
    *   キャラクターやタグのエンティティが定義され、ビジネスロジックを保持する。
3.  **infrastructure/**:
    *   データアクセスのロジックを実装。
    *   フロントエンドの場合、APIリクエストの実装がここに含まれることが多い。
4.  **presentation/**:
    *   UIコンポーネントとのバインディングに使用されるViewModelが含まれる。
5.  **tests/bdd/**:
    *   **features/** フォルダに、Gherkin記法で書かれたテストシナリオ (`character.feature`) が格納される。
    *   **step-definitions/** フォルダには、Gherkinのステップに対応するJavaScriptの関数 (`character.steps.ts`) が含まれる。

* srcディレクトリをcore内で切らない理由
  *   **DDDを重視**する今回のプロジェクトでは、不要な深さを増やすリスクを避けるため、`src/` を切らない構成とした。
   各文脈が独立したエントリポイントを持ち、内部でレイヤーが明確に分かれているため、シンプルでわかりやすくなる。
