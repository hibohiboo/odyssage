import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

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
  await expect(await page.getByText(text)).toBeVisible();
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
  await page.waitForTimeout(100);
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
