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
  'ユーザーが「 {string} 」リンクをクリックする',
  async function (this, text) {
    const { page } = this;
    await page.getByRole('link', { name: text }).click();
  },
);

When(
  '{string} という名前でシナリオを作成する',
  async function (this, scenarioName) {
    const { page } = this;
    await page
      .getByRole('textbox', { name: 'シナリオタイトル' })
      .fill(scenarioName);
  },
);
Then('{string}と画面に表示される', async function (this, text) {
  const { page } = this;
  await expect(page.getByText(text)).toBeVisible();
});

When('概要を {string} と設定する', async function (this, scenarioDetail) {
  const { page } = this;
  await page
    .getByRole('textbox', { name: 'シナリオ概要' })
    .fill(scenarioDetail);
  await page.getByRole('button', { name: '保存する' }).click();
});

When('「保存する」ボタンをクリックする', async function (this) {
  const { page } = this;
  await page.getByRole('button', { name: '保存する' }).click();
});

Then(
  '作成したシナリオ{string}がシナリオ一覧に表示される',
  async function (this, scenarioName) {
    const { page } = this;
    await expect(page.getByText(scenarioName).nth(0)).toBeVisible();
  },
);
