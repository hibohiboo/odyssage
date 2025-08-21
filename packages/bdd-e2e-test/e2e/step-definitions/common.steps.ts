import {
  Given,
  Before,
  After,
  Status,
  When,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium } from '@playwright/test';

// Increase timeout to 60 seconds to avoid timeout errors
setDefaultTimeout(60 * 1000);

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

Given('テストセッション {string} が利用可能である', async function (sessionId: string) {
  // テストセッションのサンプルデータをLocalStorageに設定
  const sampleSession = {
    id: sessionId,
    title: 'テストセッション：魔法の森の冒険',
    description: 'BDDテスト用サンプルセッション',
    currentSceneId: 'forest_entrance'
  };
  
  const sampleScenes = [
    {
      id: 'forest_entrance',
      title: '古い森の入り口',
      description: 'あなたは古い森の入り口に立っています。深い霧が漂い、木々の向こうから不思議な音が聞こえてきます。',
      backgroundImage: '/images/forest-entrance.jpg',
      events: [
        {
          type: 'narrative',
          content: 'あなたは古い森の入り口に立っています。'
        }
      ]
    }
  ];
  
  await this.page.evaluate((data: any) => {
    localStorage.setItem(`odyssage_session_${data.session.id}`, JSON.stringify(data.session));
    localStorage.setItem(`odyssage_session_${data.session.id}_scenes`, JSON.stringify(data.scenes));
  }, { session: sampleSession, scenes: sampleScenes });
});
When(
  'ユーザーが「 {string} 」リンクをクリックする',
  async function (this, text) {
    const { PageActions } = await import('../utils/page-actions.js');
    const pageActions = new PageActions(this.page);
    await pageActions.clickLink(text);
  },
);
