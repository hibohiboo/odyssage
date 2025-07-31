import { When, Then, Given } from '@cucumber/cucumber';
import { PageActions } from '../utils/page-actions';

When(
  '{string} という名前でシナリオを作成する',
  async function (this, scenarioName) {
    const pageActions = new PageActions(this.page);
    await pageActions.fillTextbox('シナリオタイトル', scenarioName);
  },
);

Then('{string}と画面に表示される', async function (this, text) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible(text);
});

When('概要を {string} と設定する', async function (this, scenarioDetail) {
  const pageActions = new PageActions(this.page);
  await pageActions.fillTextbox('シナリオ概要', scenarioDetail);
  await pageActions.clickButton('保存する');
});

When('「保存する」ボタンをクリックする', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.clickButton('保存する');
});

Then(
  '作成したシナリオ{string}がシナリオ一覧に表示される',
  async function (this, scenarioName) {
    const pageActions = new PageActions(this.page);
    await pageActions.expectTextContaining(scenarioName);
  },
);

When(
  'シナリオ一覧からシナリオ{string}の編集画面を開く',
  async function (this, scenarioName) {
    const pageActions = new PageActions(this.page);
    await pageActions.openScenarioEdit(scenarioName);
  },
);

When('公開設定を {string} に変更する', async function (this, visibility) {
  const pageActions = new PageActions(this.page);
  await pageActions.changeVisibility(visibility as 'public' | 'private');
});

Then(
  'シナリオ{string}が{string}として表示される',
  async function (this, scenarioName, status) {
    const pageActions = new PageActions(this.page);
    await pageActions.expectScenarioStatus(scenarioName, status);
  },
);

// 既存の公開シナリオ関数を最適化
Given('公開シナリオ{string}が存在する', async function (this, scenarioName) {
  try {
    const pageActions = new PageActions(this.page);
    
    // 公開シナリオページに移動して確認
    await pageActions.clickLink('公開シナリオ');
    await pageActions.waitForPageLoad();
    
    // 該当のシナリオがすでに公開状態かチェック
    const scenarioExists = (await this.page.locator(`:has-text("${scenarioName}")`).count()) > 0;

    if (scenarioExists) {
      const scenarioRow = pageActions.getRowContaining(scenarioName);
      const isPublic = (await scenarioRow.locator('text=公開中').count()) > 0;

      if (isPublic) {
        console.log(`シナリオ "${scenarioName}" はすでに公開済み。スキップします。`);
        return;
      }

      // 非公開状態なら公開に変更
      await pageActions.navigateToScenarioManagement();
      await pageActions.openScenarioEdit(scenarioName);
      await pageActions.changeVisibility('public');
      await pageActions.clickButton('保存する');
      await pageActions.waitForPageLoad();
      await pageActions.clickLink('シナリオ一覧に戻る');
      await pageActions.waitForPageLoad();
      return;
    }

    // シナリオを新規作成
    console.log('新規シナリオ作成を開始します');
    
    await pageActions.navigateToNewScenario();
    await pageActions.waitForElement('input[name="シナリオタイトル"], [role="textbox"][name="シナリオタイトル"]');
    
    // シナリオ情報を入力して公開で作成
    await pageActions.createScenario(scenarioName, 'テスト用のシナリオ', true);
    
  } catch (error) {
    console.error(`シナリオ作成中にエラーが発生しました: ${error}`);
    throw error;
  }
});
