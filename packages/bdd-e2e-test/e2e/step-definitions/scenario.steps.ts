import { When, Then, Given } from '@cucumber/cucumber';
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

// 既存の公開シナリオ関数を最適化
Given('公開シナリオ{string}が存在する', async function (this, scenarioName) {
  try {
    const { page } = this;
    // シナリオ一覧ページに移動
    await page.getByRole('link', { name: '公開シナリオ' }).click();
    // ナビゲーションを安定して待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // 該当のシナリオがすでに公開状態かチェック
    const scenarioExists =
      (await page.locator(`:has-text("${scenarioName}")`).count()) > 0;

    if (scenarioExists) {
      const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
      const isPublic = (await scenarioRow.locator('text=公開中').count()) > 0;

      if (isPublic) {
        console.log(
          `シナリオ "${scenarioName}" はすでに公開済み。スキップします。`,
        );
        return; // すでに公開されているのでスキップ
      }

      // 非公開状態なら公開に変更
      // シナリオ一覧ページに移動
      await page.getByRole('link', { name: 'シナリオ管理' }).click();
      // ナビゲーションを安定して待つ
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await page
        .locator(`:has-text("${scenarioName}")`)
        .first()
        .locator('text=編集する')
        .click();
      await page.waitForLoadState('networkidle');
      await page.getByText('公開', { exact: true }).click();
      await page.getByRole('button', { name: '保存する' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByRole('link', { name: 'シナリオ一覧に戻る' }).click();
      await page.waitForLoadState('networkidle');
      return;
    }

    // シナリオを新規作成
    console.log('新規シナリオ作成を開始します');

    // 新規シナリオ作成リンクを探して確実にクリック
    const newScenarioLink = page.getByRole('link', {
      name: '新規シナリオ作成',
    });
    await newScenarioLink.waitFor({ state: 'visible' });

    console.log('新規シナリオ作成リンクを見つけました');
    await page.waitForTimeout(500);

    if (await newScenarioLink.isEnabled()) {
      await newScenarioLink.click();
    } else {
      console.log('要素が有効でないためクリックできません');
      await page.waitForTimeout(500);
      await newScenarioLink.click({ timeout: 1000 });
    }

    // シナリオタイトル入力欄が表示されるまで待機
    await page.getByRole('textbox', { name: 'シナリオタイトル' }).waitFor({
      state: 'visible',
      timeout: 5000,
    });

    // ページが安定するのを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // シナリオ情報を入力
    await page
      .getByRole('textbox', { name: 'シナリオタイトル' })
      .fill(scenarioName);
    await page
      .getByRole('textbox', { name: 'シナリオ概要' })
      .fill('テスト用のシナリオ');
    await page.getByText('公開', { exact: true }).click();
    await page.getByRole('button', { name: '保存する' }).click();
  } catch (error) {
    console.error(`シナリオ作成中にエラーが発生しました: ${error}`);
    throw error;
  }
});
