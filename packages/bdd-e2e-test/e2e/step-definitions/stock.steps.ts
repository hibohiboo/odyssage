import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Increase timeout to 60 seconds to avoid timeout errors
setDefaultTimeout(60 * 1000);

When(
  'シナリオ{string}の「ストックする」ボタンをクリックする',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await scenarioRow.locator('text=ストックする').nth(0).click();
  },
);

Then(
  'シナリオ{string}が「ストック済み」と表示される',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await expect(scenarioRow.locator('text=ストック済み').nth(0)).toBeVisible();
  },
);

Then(
  '「ストック一覧」ページにシナリオ{string}が表示される',
  async function (this, scenarioName) {
    const { page } = this;
    // ストック一覧タブへ切り替え - セレクタをrole属性を使用
    await page.getByRole('tab', { name: 'ストック一覧' }).click();
    // ページが安定するのを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // シナリオ名が表示されていることを検証
    await expect(page.getByText(scenarioName)).toBeVisible();
  },
);

When(
  'シナリオ{string}の「ストック解除」ボタンをクリックする',
  async function (this, scenarioName) {
    const { page } = this;
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    await scenarioRow.locator('text=ストック解除').nth(0).click();
  },
);

Then(
  'シナリオ{string}が「ストック一覧」に表示されなくなる',
  async function (this, scenarioName) {
    const { page } = this;
    // ストック一覧タブへ切り替え - セレクタをrole属性を使用
    await page.getByRole('tab', { name: 'ストック一覧' }).click();
    // ページが安定するのを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // シナリオ名が表示されていないことを検証
    await expect(page.getByText(scenarioName)).not.toBeVisible();
  },
);

/**
 * シナリオ一覧ページでシナリオが「ストックする」と表示されることを確認するステップ
 * 複数の同名シナリオが存在する場合に備え、よりピンポイントで検索します
 * @param scenarioName 検索対象のシナリオ名
 */
Then(
  'シナリオ一覧ページでシナリオ{string}が「ストックする」と表示される',
  async function (this, scenarioName) {
    const { page } = this;
    // 公開シナリオタブに切り替え
    await page.getByRole('tab', { name: '公開シナリオ' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // シナリオカードを探す - シナリオ名を含むカードを特定
    const scenarioCards = page.locator(
      '.card:has(h3:text("' + scenarioName + '"))',
    );

    // 最初のカードを選択
    const firstCard = scenarioCards.first();

    // このカードに「ストックする」ボタンがあることを確認
    const stockButton = firstCard.getByText('ストックする');
    await expect(stockButton).toBeVisible();
  },
);

Given(
  'ユーザーがシナリオ{string}をストック済みである',
  async function (this, scenarioName) {
    const { page } = this;
    // シナリオ一覧ページに移動
    await page.getByRole('link', { name: '公開シナリオ' }).click();

    // シナリオが存在するか確認
    const scenarioRow = page.locator(`:has-text("${scenarioName}")`).first();
    const isScenarioExists = await scenarioRow.count(); // 0なら存在しない

    if (!isScenarioExists) {
      throw new Error(`シナリオ "${scenarioName}" が見つかりません。`);
    }

    // ストック状態を確認
    const isStocked = await scenarioRow.locator('text=ストック済み').count();

    // まだストックされていない場合はストックする
    if (!isStocked) {
      await scenarioRow.locator('text=ストックする').nth(0).click();
      // ストック完了を待つ
      await expect(
        scenarioRow.locator('text=ストック済み').nth(0),
      ).toBeVisible();
    }
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

/**
 * 特定のシナリオが「ストック一覧」に表示されていることを検証するステップ
 * @param scenarioName 検索対象のシナリオ名
 */
Then(
  'シナリオ"{string}"が「ストック一覧」に表示される',
  async function (this, scenarioName) {
    const { page } = this;
    // ストック一覧タブへ切り替え
    await page.getByRole('tab', { name: 'ストック一覧' }).click();
    // ページが安定するのを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // シナリオ名が表示されていることを検証
    await expect(page.getByText(scenarioName)).toBeVisible();
  },
);
