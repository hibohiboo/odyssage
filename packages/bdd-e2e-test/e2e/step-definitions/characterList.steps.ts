import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect, chromium } from '@playwright/test';
import type { Page } from '@playwright/test';

let page: Page;

Before(async () => {
  const browser = await chromium.launch({ headless: true }); // headless: true にするとブラウザが表示されない
  const context = await browser.newContext();
  page = await context.newPage();
});

Given('アプリが起動している', async () => {
  await page.goto('http://localhost:5173');
});

Given('キャラクターリストが空である', async () => {
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

When('キャラクターリストページを表示する', async () => {
  await page.click('text=キャラクターリスト');
});

Then('"キャラクターが見つかりませんでした" と表示される', async () => {
  const message = await page.locator('text=キャラクターが見つかりませんでした');
  await expect(message).toBeVisible();
});

When('{string} という名前のキャラクターを追加する', async (name: string) => {
  await page.fill('input[placeholder="キャラクター名を入力"]', name);
  await page.click('button:has-text("キャラクターを追加")');
});

Then('キャラクターリストに {string} が表示される', async (name: string) => {
  const character = await page.locator(`text=${name}`);
  await expect(character).toBeVisible();
});

When(
  '以下のキャラクターを追加する:',
  async (table: { hashes: () => { name: string }[] }) => {
    for (const { name } of table.hashes()) {
      await page.fill('input[placeholder="キャラクター名を入力"]', name);
      await page.click('button:has-text("キャラクターを追加")');
    }
  },
);

Then(
  'キャラクターリストに {string} と {string} が表示される',
  async (name1: string, name2: string) => {
    const character1 = await page.locator(`text=${name1}`);
    const character2 = await page.locator(`text=${name2}`);
    await expect(character1).toBeVisible();
    await expect(character2).toBeVisible();
  },
);
