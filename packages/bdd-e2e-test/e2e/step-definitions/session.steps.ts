import {
  Given,
  When,
  Then,
  setDefaultTimeout,
  DataTable,
} from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// 時間がかかるテストなのでタイムアウトを延長 （デフォルトは5秒）
setDefaultTimeout(10 * 1000);

/**
 * GMがシナリオをストックしている前提条件
 * 既存のストック機能を利用して、GMのアカウントでシナリオをストックすることを確認します
 */
Given('GMがシナリオをストックしている', async function (this) {
  const { page } = this;
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(500);
  // 公開シナリオページに移動
  await page.getByRole('link', { name: '公開シナリオ' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // 最低1つのシナリオが存在するか確認
  const scenarios = await page.locator('.scenario-list .card').count();
  if (scenarios === 0) {
    await page.getByRole('link', { name: 'シナリオ管理' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const newScenarioLink = page.getByRole('link', {
      name: '新規シナリオ作成',
    });
    await newScenarioLink.waitFor({ state: 'visible' });
    await page.waitForTimeout(500);
    await newScenarioLink.click();
    await page.getByRole('textbox', { name: 'シナリオタイトル' }).waitFor({
      state: 'visible',
      timeout: 5000,
    });
    await page
      .getByRole('textbox', { name: 'シナリオタイトル' })
      .fill('闇の森の試練');
    await page
      .getByRole('textbox', { name: 'シナリオ概要' })
      .fill('テスト用のシナリオ');
    await page.getByText('公開', { exact: true }).click();
    await page.getByRole('button', { name: '保存する' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('link', { name: '公開シナリオ' }).click();
    await page.waitForTimeout(500);
  }

  // 最初のシナリオを取得
  const firstScenario = page.locator('.scenario-list .card').first();
  const scenarioName = await firstScenario.locator('h3').textContent();

  // ストック状態を確認
  const stockButton = firstScenario.getByText('ストックする');
  const stockedButton = firstScenario.getByText('ストック済み');

  // まだストックされていなければストックする
  if ((await stockButton.count()) > 0) {
    await stockButton.click();
    // ストック完了を待つ
    await expect(stockedButton).toBeVisible({ timeout: 5000 });
  }

  // 少なくとも1つのシナリオがストックされていることを確認
  if ((await stockedButton.count()) === 0) {
    throw new Error('シナリオをストックすることができませんでした');
  }

  // ストックしたシナリオ名を保存（後で使用するため）
  this.stockedScenarioName = scenarioName;
});

/**
 * セッションを作成するステップ
 * DataTableからセッション情報を取得して新規セッションを作成します
 * ストックした公開シナリオの詳細画面からセッション作成を行います
 */
When('セッションを作成する:', async function (this, dataTable: DataTable) {
  const { page } = this;
  const sessionData = dataTable.hashes()[0];
  const sessionName = sessionData['セッション名'];

  // ストック一覧ページに移動
  await page.getByRole('tab', { name: 'ストック一覧' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // ストックしたシナリオを見つける
  const stockedScenario = page
    .locator(`:has-text("${this.stockedScenarioName}")`)
    .first();
  await stockedScenario.click();
  await page.waitForLoadState('networkidle');
  // 作成ボタンをクリック
  await page.getByRole('link', { name: '詳細を見る' }).click();

  // シナリオ詳細画面からセッション作成ボタンをクリック
  await page.waitForTimeout(500);
  const button = await page.getByRole('link', {
    name: 'このシナリオでセッションを作成',
  });
  await page.waitForTimeout(500);
  await button.click();

  await page.waitForTimeout(1000);
  // セッション情報を入力
  await page.getByLabel('セッション名').fill(sessionName);

  // 既にシナリオは選択されている状態のため、選択操作は不要

  // 作成ボタンをクリック
  await page.getByRole('button', { name: '作成する' }).click();

  // 作成完了を待つ
  await page.waitForLoadState('networkidle');

  // セッション名を保存（後で使用するため）
  this.createdSessionName = sessionName;
});

/**
 * セッション一覧ページを開くステップ
 */
When('セッション一覧ページを開く', async function (this) {
  const { page } = this;

  // セッション一覧ページに移動
  await page.getByRole('link', { name: 'セッション' }).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
});

/**
 * セッション一覧に特定のセッションが表示されていることを確認するステップ
 * DataTableからセッション情報を取得して表示を検証します
 */
Then(
  '次のセッションが表示されるべき:',
  async function (this, dataTable: DataTable) {
    const { page } = this;
    const expectedSessions = dataTable.hashes();

    // 各セッションに対して表示を検証
    for (const session of expectedSessions) {
      const sessionName = session['セッション名'];
      const sessionStatus = session['状態'];

      // セッションカードを探す
      const sessionCard = page
        .locator(`.card:has-text("${sessionName}")`)
        .first();

      // カードが存在することを確認
      await expect(sessionCard).toBeVisible();

      // セッション名が表示されていることを確認
      await expect(sessionCard.getByText(sessionName)).toBeVisible();

      // 状態が表示されていることを確認
      await expect(sessionCard.getByText(sessionStatus)).toBeVisible();
    }
  },
);
