hisa@DESKTOP-UVNKAM1 MINGW64 /d/projects/odyssage/packages/bdd-e2e-test (id/120/bdd-test)
$ bun run bdd-test
$ cucumber-js --config cucumber.mjs --exit
(node:32396) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)

1.  Scenario: 初回シーン内容の表示 # e2e\features\play-experience-single.feature:22
    √ Before # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:5
    √ Given プレイヤーがアプリにアクセスしている # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:10
    √ And テストセッション "test-session-001" が利用可能である # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:45
    √ Given プレイヤーがプレイ画面を表示している # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:47
    × And 現在のシーンが "第1章：森の入り口" である # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:51
    Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

        Locator: locator('body')
        - Expected string  - 1
        + Received string  + 6

        - 第1章：森の入り口
        +
        +     終了セッション test-session-001⋯古い森の入り口古い森への入り口あなたは古い森の入り口に立っています。深い霧が漂い、木々の向こうから不思議な音が聞こえてきます。続ける
        +
        +
        +
        + Running in emulator mode. Do not use with production credentials.
        Call log:
          - Expect "to.have.text" with timeout 5000ms
          - waiting for locator('body')
            9 × locator resolved to <body>…</body>
              - unexpected value "
            終了セッション test-session-001⋯古い森の入り口古い森への入り口あなたは古い森の入り口に立っています。深い霧が漂い、木々の向こうから不思議な音が聞こえてきます。続ける



        Running in emulator mode. Do not use with production credentials."

            at Proxy.<anonymous> (D:\projects\odyssage\node_modules\playwright\lib\matchers\expect.js:221:24)
            at World.<anonymous> (file:///D:/projects/odyssage/packages/bdd-e2e-test/e2e/step-definitions/play-experience-minimal.steps.ts:53:45)

    - Then 以下のシーン説明が表示される: # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:55
      """
      あなたは魔法の森の入り口に立っています。深い緑に覆われた小道が奥へと続いています。
      """
    - And シーンの背景画像として "森の入り口の風景" が表示される # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:62
      √ After # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:33
      Attachment (image/png)

13/13 steps [==================================================================================================================================================================================] 2 scenarios (1 failed, 1 passed)
13 steps (1 failed, 2 skipped, 10 passed)
0m09.290s (executing steps: 0m09.273s)
error: script "bdd-test" exited with code 1
