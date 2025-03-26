import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When(
  'シナリオ{string}の「ストックする」ボタンをクリックする',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await scenarioRow.locator('text=ストックする').click();
  },
);

Then(
  'シナリオ{string}が「ストック済み」と表示される',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await expect(scenarioRow.locator('text=ストック済み')).toBeVisible();
  },
);

Then(
  '「ストック一覧」ページにシナリオ{string}が表示される',
  async function (this, scenarioName) {
    const { page } = this;
    await expect(page.getByText(scenarioName)).toBeVisible();
  },
);

When(
  'シナリオ{string}の「ストック解除」ボタンをクリックする',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await scenarioRow.locator('text=ストック解除').click();
  },
);

Then(
  'シナリオ{string}が「ストック一覧」に表示されなくなる',
  async function (this, scenarioName) {
    const { page } = this;
    await expect(page.getByText(scenarioName)).not.toBeVisible();
  },
);

Then(
  'シナリオ一覧ページでシナリオ{string}が「ストックする」と表示される',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await expect(scenarioRow.locator('text=ストックする')).toBeVisible();
  },
);
When('公開シナリオ{string}が存在する', async function (this, scenarioName) {
  const { page } = this;

  // シナリオ作成画面に遷移
  await page.getByRole('link', { name: 'シナリオ管理' }).click();
  await page.getByRole('link', { name: '新規シナリオ作成' }).click();

  // シナリオを作成
  await page
    .getByRole('textbox', { name: 'シナリオタイトル' })
    .fill(scenarioName);
  await page
    .getByRole('textbox', { name: 'シナリオ概要' })
    .fill('テスト用のシナリオ');
  await page.getByRole('button', { name: '保存する' }).click();

  // シナリオ一覧に戻る
  await page.getByRole('link', { name: 'シナリオ一覧に戻る' }).click();

  // 作成したシナリオの編集画面を開く
  const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
  await scenarioRow.locator('text=編集する').click();

  // 公開設定を "public" に変更
  await page.getByText('公開', { exact: true }).click();
  await page.getByRole('button', { name: '保存する' }).click();

  // シナリオ一覧に戻る
  await page.getByRole('link', { name: 'シナリオ一覧に戻る' }).click();

  // 公開中であることを確認
  await expect(scenarioRow.locator('text=公開中')).toBeVisible();
});
