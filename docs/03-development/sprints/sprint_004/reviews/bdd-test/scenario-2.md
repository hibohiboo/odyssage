下記の結果になりました。
data-test-idを使っていますが、ここは妥当な使いどころですか？
また、featureファイルとstepsファイルの同期がとれていません。
前回も同じミスをしていました。
次のスプリントの担当者が同じミスをしないようにフィードバックしてください。

1.  Scenario: 初回シーン内容の表示 # e2e\features\play-experience-single.feature:22
    √ Before # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:5
    √ Given プレイヤーがアプリにアクセスしている # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:10
    √ And テストセッション "test-session-001" が利用可能である # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:45
    √ Given プレイヤーがプレイ画面を表示している # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:47
    ? And 現在のシーンが「第1章：森の入り口」である
    Undefined. Implement with the following snippet:

          Given('現在のシーンが「第1章：森の入り口」である', function () {
            // Write code here that turns the phrase above into concrete actions
            return 'pending';
          });

    - Then 以下のシーン説明が表示される: # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:55
      """
      あなたは魔法の森の入り口に立っています。深い緑に覆われた小道が奥へと続いています。
      """
      ? And シーンの背景画像として「森の入り口の風景」が表示される
      Undefined. Implement with the following snippet:

            Then('シーンの背景画像として「森の入り口の風景」が表示される', function () {
              // Write code here that turns the phrase above into concrete actions
              return 'pending';
            });

    √ After # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:33

13/13 steps [=============================================================================================================================================================================================]22 scenarios (1 undefined, 1 passed)
13 steps (2 undefined, 1 skipped, 10 passed)
0m04.127s (executing steps: 0m04.105s)
error: script "bdd-test" exited with code 1
