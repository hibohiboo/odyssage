# Copilot 命名規則指示書

## 基本原則
- 一般的な用語以外は単語を省略せずに記載すること
  - good: errorCount, dnsConnectionIndex
  - bad: errCnt, dnsIdx

## 変数、定数、カラム名の命名規則
- 日時を示す場合: 動詞 + at
  - 例: createdAt, allowAt
- 値がboolean以外の場合： 形容詞 + 名詞
  - 例: allAnimal, freeWord
- 存在有無を表現するboolean: has + 名詞
  - 例: hasAnimal

## 関数、クラスの命名規則
- イベント関数: on + 名詞 + 形容詞
  - 例: onArrivalJust, onWageLost
- 変換、成形関数: to + 名詞
  - 例: toUser, toAnimal
- 状態を変更: 動詞 + 目的語 + 形容詞
  - 例: deleteUserOld
