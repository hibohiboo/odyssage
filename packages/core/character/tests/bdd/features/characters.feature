Feature: キャラクターリストの表示
  As a プレイヤー
  I want to view all characters
  So that I can select and use them

  Scenario: キャラクターリストを取得する
    Given 以下のキャラクターが存在する:
      | name |
      | 勇者 |
      | 魔法使い |
    When キャラクターリストを取得する
    Then 以下のキャラクターがリストに表示されるべき:
      | name      |
      | 勇者      |
      | 魔法使い  |