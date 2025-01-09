import { Given, When, Then, BeforeAll } from '@cucumber/cucumber';
import { expect, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

BeforeAll(async function () {
  const browser = await chromium.launch({ headless: false }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  page = await context.newPage();
});

Given('アプリが起動している', async function () {
  await page.goto('http://localhost:5173');
});

When('ログインページを表示する', async function () {
  await page.getByRole('link', { name: 'ログイン' }).click();
});
When(
  'ログインフォームの{string}に{string}を入力',
  async function (name: string, value: string) {
    await page.getByLabel(name).fill(value);
  },
);
When('{string}ボタンを押下', async function (name: string) {
  await page.getByRole('button', { name }).click();
});
Then('ログインユーザ名{string}をヘッダに表示', async function (name: string) {
  await expect(await page.locator('header')).toHaveText(name);
});
