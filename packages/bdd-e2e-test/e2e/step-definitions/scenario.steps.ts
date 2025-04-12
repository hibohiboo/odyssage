import { Given, When, Then, Before } from '@cucumber/cucumber';
import { chromium, expect } from '@playwright/test';
import fs from 'fs';

Before(async function (this) {
  const browser = await chromium.launch({
    headless: process.env.CI === 'true',
  }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  this.page = await context.newPage();

  // ヘッドレスブラウザ―のコンソール出力をキャッチする
  this.page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      console.error(`[Browser Console Error]: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      console.warn(`[Browser Console Warning]: ${msg.text()}`);
    } else {
      console.log(`[Browser Console]: ${msg.text()}`);
    }
  });
  this.page.on('request', (request: any) =>
    console.log(`Request: ${request.method()} ${request.url()}`),
  );
  this.page.on('response', (response: any) => {
    console.log(`Response: ${response.status()} ${response.url()}`);
    if (response.status() >= 400) {
      console.error(`Error Response: ${response.status()} ${response.url()}`);
    }
  });
});

Given('アプリが起動している', async function (this) {
  await this.page.goto('http://localhost:5173');
});

When(
  'ユーザーが「 {string} 」リンクをクリックする',
  async function (this, text) {
    const { page } = this;

    await page.screenshot({
      path: 'output/screenshots/debug.png',
      fullPage: true,
    });
    const content = await page.content();
    fs.writeFileSync('output/debug.html', content);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'output/screenshots/after_networkidle.png',
      fullPage: true,
    });
    fs.writeFileSync('output/after_networkidle.html', await page.content());

    await page.waitForSelector(`a:has-text("${text}")`);
    await page.getByRole('link', { name: text }).nth(0).click();
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

When(
  'シナリオ一覧からシナリオ{string}の編集画面を開く',
  async function (this, scenarioName) {
    const { page } = this;
    // シナリオ名を含む行を見つけて、その行の「編集する」リンクをクリック
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await scenarioRow.locator('text=編集する').click();
  },
);

When('公開設定を {string} に変更する', async function (this, visibility) {
  const { page } = this;
  if (visibility === 'public') {
    await page.getByText('公開', { exact: true }).click();
  } else {
    await page.locator('label:has-text("非公開（下書き）")').click();
  }
});

Then(
  'シナリオ{string}が{string}として表示される',
  async function (this, scenarioName, status) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await expect(
      scenarioRow.locator(`:has-text("${status}")`).first(),
    ).toBeVisible();
  },
);
