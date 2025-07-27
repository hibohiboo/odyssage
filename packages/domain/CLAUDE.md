# @odyssage/domain

## 役割
ドメイン駆動設計（DDD）におけるドメイン層を担当するパッケージです。ビジネスロジックとドメインルールを実装します。

## 責務
- **エンティティ**: ビジネスの核となるオブジェクト（Scenario, Scene, Event, Message）
- **値オブジェクト**: 不変で等価性を持つオブジェクト（Visibility, SceneType など）
- **ドメインサービス**: エンティティに属さないビジネスロジック
- **ドメインイベント**: ドメインで発生する重要な出来事

## 構成
```
src/
├── entities/          # エンティティクラス
│   ├── scenario.ts
│   ├── scene.ts
│   ├── event.ts
│   └── message.ts
├── value-objects/     # 値オブジェクト
├── services/          # ドメインサービス
├── events/            # ドメインイベント
└── repositories/      # リポジトリインターフェース
```

## 設計原則
- **集約**: Scenarioを集約ルートとし、Scene→Event→Messageの階層構造を管理
- **カプセル化**: プライベートフィールドとpublicメソッドで状態変更を制御
- **不変性**: 値オブジェクトは不変として設計
- **ドメインルール**: ビジネスルールはドメイン層で実装

## 依存関係
- 外部ライブラリへの依存は最小限に抑制
- インフラ層（database, APIなど）に依存しない
- 他のパッケージからインポートされる立場

## テスト方針
- エンティティの状態変更ロジックをテスト
- ドメインルールの検証をテスト
- 集約の整合性をテスト
- テスト駆動開発でドメインモデルを構築

## ESLint設定
- 設定ファイル: `eslint.config.js` (eslint.config.js形式を使用)
- テストファイルとconfigファイルでimport/no-extraneous-dependenciesルールを無効化

## コード規約
### プライベートフィールド
- クラスのプライベートフィールドは`#`構文を使用する（`#title`, `#description`など）
- アンダースコア記法（`_title`）は使用しない

### ファイル構成
- 1ファイル1クラスの原則（max-classes-per-file）
- 複数のクラスがある場合は別ファイルに分割する

### 行末文字
- 必ずLF（Unix形式）を使用する
- CRLF（Windows形式）は使用しない

### 複雑度制限
- メソッドの複雑度は7以下に制限（complexity rule）
- 複雑なif/else文はswitch文やearly returnで簡略化する

### ループとイテレーター
- for...ofループは使用しない（no-restricted-syntax）
- 代わりに配列メソッド（map, filter, forEach）を使用する

### メソッド設計
- クラスメソッドは必ずthisを使用する（class-methods-use-this）
- thisを使わない場合は静的メソッドまたは関数として定義する

### switch文
- switch文には必ずdefault caseを含める（default-case）

### 未使用変数
- 未使用の引数は`_`プレフィックスを付ける（unused-imports/no-unused-vars）
- 例：`_scenario`, `_eventId`

### セキュリティ
- Math.random()の使用時はセキュリティに注意（sonarjs/pseudo-random）
- 本番環境では適切な乱数生成器を使用する