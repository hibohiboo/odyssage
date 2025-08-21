× And シーンの背景画像として "森の入り口の風景" が表示される # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:62
locator.\_expect: Error: strict mode violation: locator('div[class*="aspect-video"], img') resolved to 2 elements: 1) <div data-testid="scene-background" class="aspect-video relative overflow-hidden">…</div> aka getByTestId('scene-background') 2) <img alt="古い森の入り口" class="w-full h-full object-cover" src="https://dummyimage.com/1200x800/2d5016/ffffff?text=Forest+Entrance"/> aka getByRole('img', { name: '古い森の入り口' })

       Call log:
         - Expect "to.be.visible" with timeout 5000ms
         - waiting for locator('div[class*="aspect-video"], img')

           at World.<anonymous> (D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\play-experience-minimal.steps.ts:65:72)

√ After # file:\D:\projects\odyssage\packages\bdd-e2e-test\e2e\step-definitions\common.steps.ts:33
Attachment (image/png)
