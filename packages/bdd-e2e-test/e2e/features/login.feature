Feature: ログイン

  Background:
    Given アプリが起動している

  Scenario: サインアップをしていない場合にログインを試みる
    When ログインページを表示する
    And ログインフォームの"メールアドレス"に"hoge@example.com"を入力
    And ログインフォームの"パスワード"に"Passw0rd"を入力
    And "ログイン"ボタンを押下
    Then "ログインに失敗しました。サインアップがまだの場合はまずサインアップをお願いします。"と表示

  Scenario: サインアップを行う
    When サインアップページを表示する
    And サインアップフォームの"ユーザ名"に"testuser"を入力
    And サインアップフォームの"メールアドレス"に"hoge@example.com"を入力
    And サインアップフォームの"パスワード"に"Passw0rd"を入力
    And "サインアップ"ボタンを押下
    Then ログインユーザ名"testuser"をヘッダに表示

  Scenario: ログインを行う
    Given ユーザ"hoge@example.com"が登録されている
    When ログインページを表示する
    And ログインフォームの"メールアドレス"に"hoge@example.com"を入力
    And ログインフォームの"パスワード"に"Passw0rd"を入力
    And "ログイン"ボタンを押下
    Then ログインユーザ名"testuser"をヘッダに表示