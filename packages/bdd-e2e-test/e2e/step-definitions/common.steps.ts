import { Given, Before, After, Status, When } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

Before(async function (this) {
  const browser = await chromium.launch({
    headless: process.env.CI === 'true',
  }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  this.page = await context.newPage();

  if (process.env.CI === 'true') {
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
  }
});
After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({
      path: `output/screenshots/${scenario.pickle.name}.png`,
      fullPage: true,
    });
    await this.attach(screenshot, 'image/png');
  }
});
Given('アプリが起動している', async function (this) {
  await this.page.goto('http://localhost:5173');
});
When(
  'ユーザーが「 {string} 」リンクをクリックする',
  async function (this, text) {
    const { page } = this;

    await page.waitForSelector(`a:has-text("${text}")`);
    await page.getByRole('link', { name: text }).nth(0).click();
  },
);
