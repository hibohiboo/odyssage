× Then 以下の選択肢が表示される: # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:80
| 選択肢番号 | 選択肢テキスト |
| 1 | 森の奥へ進む |
| 2 | 安全な道を探す |
| 3 | 村へ戻る |
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

       Locator: locator('button:has-text("森の奥へ進む")')
       Expected: visible
       Received: <element(s) not found>
       Call log:
         - Expect "to.be.visible" with timeout 5000ms
         - waiting for locator('button:has-text("森の奥へ進む")')

           at Proxy.<anonymous> (D:\projects\odyssage\node_modules\playwright\lib\matchers\expect.js:221:24)
           at World.<anonymous> (file:///D:/projects/odyssage/packages/bdd-e2e-test/e2e/step-definitions/play-experience-minimal.steps.ts:85:77)

- And 各選択肢がクリック可能な状態で表示される # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:88
- And 選択肢の下に「選択してください」メッセージが表示される # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:96
  √ After # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:33
  Attachment (image/png)
