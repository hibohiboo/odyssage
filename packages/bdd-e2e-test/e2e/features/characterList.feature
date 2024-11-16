Feature: Character List Management

  Background:
    Given アプリが起動している

  Scenario: キャラクターリストが空の場合
    When キャラクターリストページを表示する
    Then "キャラクターが見つかりませんでした" と表示される

  Scenario: キャラクターを追加する
    Given キャラクターリストが空である
    When "John Doe" という名前のキャラクターを追加する
    Then キャラクターリストに "John Doe" が表示される

  Scenario: キャラクターを複数追加して表示する
    Given キャラクターリストが空である
    When 以下のキャラクターを追加する:
      | name     |
      | Alice    |
      | Bob      |
    Then キャラクターリストに "Alice" と "Bob" が表示される
