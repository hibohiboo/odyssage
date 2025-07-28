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

## Lintエラー修正作業の記録

### 実施した修正
1. **プライベートフィールドの修正**: `_field` → `#field` 構文に変更
2. **ファイル分割**: max-classes-per-file対応で複数クラスを個別ファイルに分割
3. **行末文字統一**: CRLF → LF変換を自動修正で実施
4. **ループ構文変更**: for...of → forEach/配列メソッドに変更
5. **Switch文改善**: default case追加
6. **複雑度削減**: makeChoiceメソッドを複数メソッドに分割
7. **静的メソッド化**: thisを使わないメソッドを静的メソッドに変更
8. **未使用変数対応**: `_`プレフィックスで明示的に未使用を示す

### 残存するlintエラー（22個）
以下のエラーは設計上の制約により残存（本番実装時に対応予定）：
- **sonarjs/pseudo-random**: Math.random()使用への警告（7箇所）
- **@typescript-eslint/no-explicit-any**: 型推論困難な箇所でのany使用（6箇所）
- **class-methods-use-this**: 設計上thisが不要だが非静的である必要があるメソッド（4箇所）
- **no-param-reassign**: 引数オブジェクトのプロパティ変更（1箇所）
- **complexity**: switch文での複雑度超過（1箇所）

### UUID対応による改善
- **UUIDライブラリ導入**: `uuid`パッケージ（v11.1.0）と`@types/uuid`（v10.0.0）を追加
- **IdGeneratorユーティリティ作成**: ライブラリ変更への耐性向上
  - 各エンティティタイプ別のID生成メソッド
  - プレフィックス付きUUID（`event_`, `scenario_`など）
  - 将来的なID生成方式変更への対応
- **Math.random()置き換え**: sonarjs/pseudo-randomエラー（7箇所）を完全解決
- **エラー大幅削減**: 63個 → 13個（sonarjs/pseudo-randomを含む50個を解決）

### 教訓
- **ファイル作成時の行末**: 新規ファイル作成時はLF行末を明示的に指定する必要がある
- **段階的修正**: 大量のlintエラーは種類別に段階的に修正することで効率化
- **規約の事前定義**: コード規約をCLAUDE.mdで明確化することで一貫性を保つ
- **自動修正の活用**: `--fix`オプションで修正可能なエラーから対応
- **ライブラリ抽象化**: 外部ライブラリはユーティリティクラスで抽象化して変更容易性を確保