Feature: セッションの作成と一覧表示

  As a GM
  I want to create a new session
  So that I can see it appear in the session list

  Scenario: セッションを作成すると、自分の一覧に表示される
    Given GMがシナリオをストックしている
    When セッションを作成する:
      | セッション名   | 状態   | 
      | 闇の森の試練   | 未開始 | 
    And セッション一覧ページを開く
    Then 次のセッションが表示されるべき:
      | セッション名   | 状態   |
      | 闇の森の試練   |  未開始 |
