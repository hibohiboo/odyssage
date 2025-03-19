import { Given, When, Then, Before } from '@cucumber/cucumber';
import { chromium, expect } from '@playwright/test';

Before(async function (this) {
  const browser = await chromium.launch({ headless: false }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  this.page = await context.newPage();
});

Given('アプリが起動している', async function (this) {
  await this.page.goto('http://localhost:5173');
});

When(
  'ユーザーが「新規シナリオ作成」ボタンをクリックする',
  async function (this) {
    const { page } = this;
    await page.getByRole('link', { name: 'シナリオ新規作成' }).click();
  },
);
