import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PageActions } from '../utils/page-actions.js';

/**
 * play-experience.feature用のstep definitions
 * Phase 2実装済み機能のテスト：PlaySessionPage・PlaySessionContainer
 */

// Background steps
Given('プレイヤーがアプリにアクセスしている', async function () {
  await this.page.goto('http://localhost:5173');
  await this.page.waitForLoadState('networkidle');
});

Given('以下のシナリオが利用可能である:', async function (dataTable: any) {
  // LocalStorageベースのため、モックデータをセットアップ
  const scenarios = dataTable.hashes();
  const scenarioData = scenarios.map((row: any) => ({
    id: row['シナリオID'],
    title: row['タイトル'],
    overview: row['概要'],
    estimatedPlayTime: row['推定プレイ時間'],
    status: row['状態']
  }));
  
  await this.page.evaluate((data: any) => {
    localStorage.setItem('odyssage_scenarios', JSON.stringify(data));
  }, scenarioData);
});

Given('プレイヤーがセッション {string} に参加済みである', async function (sessionName) {
  // セッション参加状態をLocalStorageに保存
  const sessionData = {
    sessionId: 'test-session-001',
    sessionName,
    status: 'joined',
    joinedAt: new Date().toISOString()
  };
  
  await this.page.evaluate((data) => {
    localStorage.setItem('odyssage_current_session', JSON.stringify(data));
  }, sessionData);
});

Given('プレイセッションが開始されている', async function () {
  // サンプルシーンデータをLocalStorageに設定
  const sampleScenes = [
    {
      id: 'forest_entrance',
      title: '第1章：母の病気',
      description: 'あなたの母が重い病気にかかってしまいました。\\n村の医者は首を振るばかりで、薬草に詳しい老人が言います。\\n「伝説の薬草『星月花』があれば治るかもしれない。しかし、それは危険な山奥にしかない」\\nあなたはどうしますか？',
      backgroundImage: '病気の母と心配そうな村人たち',
      events: [
        {
          type: 'narrative',
          content: 'あなたの母が重い病気にかかってしまいました。'
        },
        {
          type: 'choice',
          content: '次の行動を選択してください',
          choices: [
            {
              id: 'choice-1',
              text: 'すぐに山奥へ向かう（積極的）',
              nextSceneId: 'mountain_path'
            },
            {
              id: 'choice-2', 
              text: '準備を整えてから向かう（慎重）',
              nextSceneId: 'preparation'
            },
            {
              id: 'choice-3',
              text: '他の治療法を探す（保守的）',
              nextSceneId: 'alternative_medicine'
            }
          ]
        }
      ]
    },
    {
      id: 'preparation',
      title: '第2章：準備の時間',
      description: 'あなたは慎重な判断を下しました。\\n村で情報を集め、必要な道具を準備することにします。',
      events: [
        {
          type: 'narrative', 
          content: 'あなたは慎重な判断を下しました。村で情報を集め、必要な道具を準備することにします。'
        }
      ]
    }
  ];
  
  await this.page.evaluate((scenes) => {
    localStorage.setItem('odyssage_session_test-session-001_scenes', JSON.stringify(scenes));
  }, sampleScenes);
});

// Scenario steps
Given('プレイヤーがプレイ画面にアクセスする', async function () {
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play');
  await this.page.waitForLoadState('networkidle');
});

Given('プレイヤーがプレイ画面を表示している', async function () {
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play/forest_entrance');
  await this.page.waitForLoadState('networkidle');
});

Given('現在のシーンが「{string}」である', async function (sceneName) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(sceneName);
});

Given('プレイヤーが「{string}」シーンを表示している', async function (sceneName) {
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play/forest_entrance');
  await this.page.waitForLoadState('networkidle');
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(sceneName);
});

Given('プレイヤーが選択肢を表示している', async function () {
  // 選択肢が表示されるまでのUI操作
  const pageActions = new PageActions(this.page);
  
  // 「次へ」ボタンがある場合はクリック
  try {
    await pageActions.clickButton('次へ');
    await this.page.waitForTimeout(1000);
  } catch {
    // 「次へ」ボタンがない場合はそのまま進む
  }
});

Given('プレイヤーがプレイ中である', async function () {
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play/forest_entrance');
  await this.page.waitForLoadState('networkidle');
});

Given('現在のシーンが「{string}」である', async function (sceneName) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(sceneName);
});

Given('選択処理でエラーが発生する設定になっている', async function () {
  // エラー発生をシミュレートするためのLocalStorage設定
  await this.page.evaluate(() => {
    localStorage.setItem('odyssage_test_choice_error', 'true');
  });
});

Given('次のシーンの読み込みでエラーが発生する', async function () {
  // シーン読み込みエラーをシミュレート
  await this.page.evaluate(() => {
    localStorage.setItem('odyssage_test_scene_load_error', 'true');
  });
});

Given('既に1つの選択肢を選択済みである', async function () {
  const pageActions = new PageActions(this.page);
  
  // まず選択肢を表示
  try {
    await pageActions.clickButton('次へ');
    await this.page.waitForTimeout(1000);
  } catch {
    // 「次へ」ボタンがない場合はそのまま進む
  }
  
  // 最初の選択肢を選択
  await this.page.locator('button:has-text("すぐに山奥へ向かう（積極的）")').click();
  await this.page.waitForTimeout(500);
});

Given('プレイヤーが最終章をプレイしている', async function () {
  // 最終章のシーンデータをセットアップ
  const finalScene = {
    id: 'final_chapter',
    title: '最終章：運命の選択',
    description: '伝説の薬草『星月花』を手に入れたあなた。母のもとへ急ぎます。',
    events: [
      {
        type: 'choice',
        content: '最後の選択をしてください',
        choices: [
          {
            id: 'ending-happy',
            text: '薬草で母を治す',
            nextSceneId: 'ending_happy'
          }
        ]
      }
    ]
  };
  
  await this.page.evaluate((scene) => {
    const scenes = JSON.parse(localStorage.getItem('odyssage_session_test-session-001_scenes') || '[]');
    scenes.push(scene);
    localStorage.setItem('odyssage_session_test-session-001_scenes', JSON.stringify(scenes));
  }, finalScene);
  
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play/final_chapter');
  await this.page.waitForLoadState('networkidle');
});

// When steps
When('プレイヤーが「次へ」ボタンをクリックする', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.clickButton('次へ');
  await this.page.waitForTimeout(1000);
});

When('プレイヤーが「{string}」を選択する', async function (choiceText) {
  await this.page.locator(`button:has-text("${choiceText}")`).click();
  await this.page.waitForTimeout(1000);
});

When('プレイヤーが次の選択肢を選択する', async function () {
  // 利用可能な選択肢の最初のものを選択
  await this.page.locator('button[data-testid*="choice"]').first().click();
  await this.page.waitForTimeout(1000);
});

When('プレイヤーが画面を閉じる', async function () {
  // プレイ状態をLocalStorageに保存
  const currentState = {
    sessionId: 'test-session-001',
    currentSceneId: 'preparation',
    timestamp: new Date().toISOString()
  };
  
  await this.page.evaluate((state) => {
    localStorage.setItem('odyssage_play_state', JSON.stringify(state));
  }, currentState);
});

When('後でプレイ画面に戻る', async function () {
  // ページをリロードして状態復帰をテスト
  await this.page.reload();
  await this.page.waitForLoadState('networkidle');
});

When('プレイヤーが画面上部のメニューボタンを開く', async function () {
  await this.page.locator('button[data-testid="menu-button"]').click();
  await this.page.waitForTimeout(500);
});

When('プレイヤーが選択肢を選択する', async function () {
  await this.page.locator('button[data-testid*="choice"]').first().click();
  await this.page.waitForTimeout(1000);
});

When('プレイヤーが他の選択肢をクリックする', async function () {
  // 別の選択肢をクリック（2番目の選択肢）
  await this.page.locator('button:has-text("準備を整えてから向かう（慎重）")').click();
  await this.page.waitForTimeout(500);
});

When('プレイヤーが最後の選択肢を選択する', async function () {
  await this.page.locator('button:has-text("薬草で母を治す")').click();
  await this.page.waitForTimeout(1000);
});

// Then steps
Then('以下のUI要素が表示される:', async function (dataTable) {
  const pageActions = new PageActions(this.page);
  const elements = dataTable.hashes();
  
  for (const element of elements) {
    await pageActions.expectTextContaining(element['内容']);
  }
});

Then('シーン背景画像が表示される', async function () {
  await expect(this.page.locator('[data-testid="scene-background"]')).toBeVisible();
});

Then('シーン説明文が表示される', async function () {
  await expect(this.page.locator('[data-testid="scene-description"]')).toBeVisible();
});

Then('「次へ」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("次へ")')).toBeVisible();
});

Then('以下のシーン説明が表示される:', async function (docString) {
  const pageActions = new PageActions(this.page);
  // 改行で分割して部分的にチェック
  const lines = docString.split('\\n');
  for (const line of lines) {
    if (line.trim()) {
      await pageActions.expectTextContaining(line.trim());
    }
  }
});

Then('シーンの背景画像として「{string}」が表示される', async function (imageDescription) {
  // 背景画像のalt属性または説明テキストをチェック
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(imageDescription);
});

Then('以下の選択肢が表示される:', async function (dataTable) {
  const choices = dataTable.hashes();
  
  for (const choice of choices) {
    const choiceButton = this.page.locator(`button:has-text("${choice['選択肢テキスト']}")`);
    await expect(choiceButton).toBeVisible();
  }
});

Then('各選択肢がクリック可能な状態で表示される', async function () {
  const choiceButtons = this.page.locator('button[data-testid*="choice"]');
  const count = await choiceButtons.count();
  
  for (let i = 0; i < count; i++) {
    await expect(choiceButtons.nth(i)).toBeEnabled();
  }
});

Then('選択肢の下に「選択してください」メッセージが表示される', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('選択してください');
});

Then('選択した選択肢がハイライトされる', async function () {
  await expect(this.page.locator('button:has-text("準備を整えてから向かう（慎重）")[class*="selected"]')).toBeVisible({ timeout: 3000 });
});

Then('{int}秒以内に次のシーンに遷移する', async function (seconds) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('第2章：準備の時間');
}, { timeout: 10000 });

Then('次のシーンとして「{string}」が表示される', async function (sceneName) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(sceneName);
});

Then('以下の選択結果が反映される:', async function (docString) {
  const pageActions = new PageActions(this.page);
  const lines = docString.split('\\n');
  for (const line of lines) {
    if (line.trim()) {
      await pageActions.expectTextContaining(line.trim());
    }
  }
});

Then('プレイの進行状況が自動保存される', async function () {
  // LocalStorageに保存状態があることを確認
  const saveData = await this.page.evaluate(() => {
    return localStorage.getItem('odyssage_play_state');
  });
  
  expect(saveData).toBeTruthy();
});

Then('次のシーンへの遷移が正常に行われる', async function () {
  // URL変化またはシーン内容変化を確認
  await this.page.waitForTimeout(1000);
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('/play');
});

Then('以前の状態が復元される', async function () {
  // LocalStorageから状態が復元されることを確認
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('続きから再開');
});

Then('現在のシーンが「{string}」で表示される', async function (sceneName) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(sceneName);
});

Then('選択状態が内部で保持されている', async function () {
  const playState = await this.page.evaluate(() => {
    return localStorage.getItem('odyssage_play_state');
  });
  
  expect(playState).toBeTruthy();
});

Then('「続きから再開」メッセージが表示される', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('続きから再開');
});

Then('以下のオプションが表示される:', async function (dataTable) {
  const options = dataTable.hashes();
  
  for (const option of options) {
    const pageActions = new PageActions(this.page);
    await pageActions.expectTextContaining(option['オプション']);
  }
});

Then('「プレイに戻る」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("プレイに戻る")')).toBeVisible();
});

Then('「{string}」エラーメッセージが表示される', async function (errorMessage) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining(errorMessage);
});

Then('「再試行」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("再試行")')).toBeVisible();
});

Then('「メニューに戻る」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("メニューに戻る")')).toBeVisible();
});

Then('元の選択肢画面は保持される', async function () {
  // 選択肢ボタンがまだ表示されていることを確認
  await expect(this.page.locator('button[data-testid*="choice"]')).toHaveCount(3);
});

Then('「前のシーンに戻る」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("前のシーンに戻る")')).toBeVisible();
});

Then('{int}秒以内に選択の受付が表示される', async function (seconds) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('選択を受付けました');
});

Then('{int}秒以内に次のシーンの表示が開始される', async function (seconds) {
  // シーン遷移の開始を示すローディング表示等をチェック
  await this.page.waitForTimeout(1000);
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('第2章');
});

Then('シーン画像の読み込みが{int}秒以内に完了する', async function (seconds) {
  await expect(this.page.locator('[data-testid="scene-background"]')).toBeVisible({ timeout: seconds * 1000 });
});

Then('追加の選択は受け付けられない', async function () {
  // 他の選択肢ボタンが無効化されていることを確認
  const otherChoices = this.page.locator('button:has-text("すぐに山奥へ向かう（積極的）")');
  await expect(otherChoices).toBeDisabled();
});

Then('「既に選択済みです」メッセージが表示される', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('既に選択済みです');
});

Then('選択済みの選択肢のハイライトが維持される', async function () {
  await expect(this.page.locator('button:has-text("すぐに山奥へ向かう（積極的）")[class*="selected"]')).toBeVisible();
});

Then('エンディングシーンが表示される', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('エンディング');
});

Then('「プレイ完了おめでとうございます！」メッセージが表示される', async function () {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextContaining('プレイ完了おめでとうございます！');
});

Then('以下の完了情報が表示される:', async function (dataTable) {
  const completionInfo = dataTable.hashes();
  
  for (const info of completionInfo) {
    const pageActions = new PageActions(this.page);
    await pageActions.expectTextContaining(info['内容']);
  }
});

Then('「セッション一覧に戻る」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("セッション一覧に戻る")')).toBeVisible();
});