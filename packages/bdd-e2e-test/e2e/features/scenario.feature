Feature: シナリオ管理
  ユーザーとして
  シナリオを作成し一覧で確認したい
  それによりプロジェクトの要件を管理できるようにするため

  Background:
    Given アプリが起動している

  Scenario: 新規シナリオの作成
    When ユーザーが「 "シナリオ新規作成" 」ボタンをクリックする
    And "冒険の始まり" という名前でシナリオを作成する
    And 概要を "初めての冒険を体験するシナリオ" と設定する
    And 「シナリオ作成」ボタンをクリックする
    Then "Scenario created successfully!"と画面に表示される
    And ユーザーが「 "シナリオ一覧" 」ボタンをクリックする
    Then 作成したシナリオ"冒険の始まり"がシナリオ一覧に表示される

