
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
