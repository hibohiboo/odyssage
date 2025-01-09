import { chromium, test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: false }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://127.0.0.1:4000/');
  await page.getByRole('link', { name: 'Go to auth emulator' }).click();
  await page.getByLabel('Open menu for user testuser').click();
  await page.getByRole('menuitem', { name: 'Delete user' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.close();
});
test('サインアップする', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(await page.locator('header')).toHaveText(/ゲストユーザ/);
  await page.getByRole('link', { name: 'ログイン' }).click();
  await page.getByRole('link', { name: 'サインアップ' }).click();
  await page.getByLabel('ニックネーム(後から変更できます)').fill('testuser');
  await page.getByLabel('メールアドレス').fill('hoge@example.com');
  await page.getByLabel('パスワード').fill('Passw0rd');
  await page.getByRole('button', { name: 'サインアップ' }).click();
  // Expect a title "to contain" a substring.
  await expect(await page.locator('header')).toHaveText('testuser');
});
