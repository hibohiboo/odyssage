Feature: ログイン

  Background:
    Given アプリが起動している

  Scenario: ログインを行う
    When ログインページを表示する
    And ログインフォームの"メールアドレス"に"hoge@example.com"を入力
    And ログインフォームの"パスワード"に"Passw0rd"を入力
    And "ログイン"ボタンを押下
    Then ログインユーザ名"testuser"をヘッダに表示
