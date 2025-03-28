# Copilot Instructions
## ソフトウェア設計

- 単一責任の原則に従う。クラス・関数は１つの役割のみを実行すること
- 依存性逆転の原則に従う。外部の依存関係はインターフェースを介して注入すること
- KISS原則に従う。可能な限り複雑さを避け、シンプルで理解しやすいアーキテクチャとすること

## コーディングスタイル
- 条件文ではネストを避け、コードの可読性を高めるために早期リターンを使用すること
- クラス及び関数には適切なドキュメントコメントを追加する。各関数やクラスにはその目的や使用方法を説明するコメントを追加すること
- 実装はテスト駆動開発で実施する
  - プロンプトに記載された要件からテストリストを作成すること
  - テストリストを元にテストコードを記述すること
  - テストが通るようにプロダクトコードを記述すること
  - 必ずリファクタリングを実装するか確認すること
  - プロダクトコードとテストコードは一度にすべて記載しないこと
  - テストリストの1ケースずつ実装を進めること
- テストケースは日本語で記載すること

## 命名規則
- 一般的な用語以外は単語を省略せずに記載すること
  - good: errorCount, dnsConnectionIndex
  - bad: errCnt, dnsIdx
- 変数、定数、カラム名の命名規則
  - 日時を示す場合: 動詞 + at
    - 例: createdAt, allowAt
  - 値がboolean以外の場合： 形容詞 + 名詞
    - 例: allAnimal, freeWord
  - 存在有無を表現するboolean: has + 名詞
    - 例: hasAnimal
- 関数、クラスの命名規則
  - イベント関数: on + 名詞 + 形容詞
    - 例: onArrivalJust, onWageLost
  - 変換、成形関数: to + 名詞
    - 例: toUser, toAnimal
  - 状態を変更: 動詞 + 目的語 + 形容詞
    - 例: deleteUserOld

## フォルダ階層
- フォルダ名は小文字を用いる
- フロントエンドはFeature-Sliced Designのディレクトリ構成とする

## 利用ライブラリ

用途|ライブラリ
--|--
テスト|vitest
言語|typescript
バックエンドフレームワーク|hono
フロントエンドからバックエンドへの通信|hono rpc
