import { Given, When, Then } from '@cucumber/cucumber';
import { expect, test } from '@playwright/test';

// アプリが起動している
Given('アプリが起動している', async () => {
  await test.page.goto('http://localhost:3000');
});

// キャラクターリストが空である
Given('キャラクターリストが空である', async () => {
  await test.page.evaluate(() => localStorage.clear());
  await test.page.reload();
});

// キャラクターリストページを表示する
When('キャラクターリストページを表示する', async () => {
  await test.page.click('text=キャラクターリスト');
});

// "キャラクターが見つかりませんでした" と表示される
Then('"キャラクターが見つかりませんでした" と表示される', async () => {
  const message = await test.page.locator(
    'text=キャラクターが見つかりませんでした',
  );
  await expect(message).toBeVisible();
});

// "{name}" という名前のキャラクターを追加する
When('{string} という名前のキャラクターを追加する', async (name) => {
  await test.page.fill('input[placeholder="キャラクター名を入力"]', name);
  await test.page.click('button:has-text("キャラクターを追加")');
});

// キャラクターリストに "{name}" が表示される
Then('キャラクターリストに {string} が表示される', async (name) => {
  const character = await test.page.locator(`text=${name}`);
  await expect(character).toBeVisible();
});

// 以下のキャラクターを追加する
When('以下のキャラクターを追加する:', async (table) => {
  for (const { name } of table.hashes()) {
    await test.page.fill('input[placeholder="キャラクター名を入力"]', name);
    await test.page.click('button:has-text("キャラクターを追加")');
  }
});

// キャラクターリストに "{name1}" と "{name2}" が表示される
Then(
  'キャラクターリストに {string} と {string} が表示される',
  async (name1, name2) => {
    const character1 = await test.page.locator(`text=${name1}`);
    const character2 = await test.page.locator(`text=${name2}`);
    await expect(character1).toBeVisible();
    await expect(character2).toBeVisible();
  },
);
