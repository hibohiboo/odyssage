import { setDefaultTimeout, setWorldConstructor } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import config from '../playwright.config';

class CustomWorld {
  browser: Browser;

  page: Page;

  constructor() {
    this.browser = null!;
    this.page = null!;
  }

  async init() {
    // Playwright の設定ファイルから baseURL を読み込む
    const context = await chromium.launch(config.use);
    this.page = await context.newPage();
    if (!config.use?.baseURL) throw new Error('baseURL is not defined');
    await this.page.goto(config.use.baseURL);
  }

  async close() {
    await this.page.close();
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);
