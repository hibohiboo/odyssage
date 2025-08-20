import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PageActions } from '../utils/page-actions.js';

/**
 * play-experience.feature用のstep definitions - 段階的実装版
 * 
 * ⚠️ 重要: 最初の1シナリオ「プレイ画面の初期表示」のみ実装
 * 成功確認後に、1つずつ段階的に追加する方針
 */

// 最小限のBackground steps
Given('プレイヤーがアプリにアクセスしている', async function () {
  await this.page.goto('http://localhost:5173');
  await this.page.waitForLoadState('networkidle');
});


// 第1シナリオ「プレイ画面の初期表示」専用のsteps
Given('プレイヤーがプレイ画面にアクセスする', async function () {
  await this.page.goto('http://localhost:5173/player/session/test-session-001/play');
  await this.page.waitForLoadState('networkidle');
});

Then('以下のUI要素が表示される:', async function (dataTable: any) {
  const pageActions = new PageActions(this.page);
  const elements = dataTable.hashes();
  
  for (const element of elements) {
    // 実装されたdata-testidを活用
    const content = element['内容'];
    if (content.includes('セッション') || content.includes('タイトル')) {
      // セッションタイトル確認
      await expect(this.page.locator('[data-testid="session-title"]')).toBeVisible();
    } else if (content.includes('シーン') || content.includes('章')) {
      // シーンタイトル確認  
      await expect(this.page.locator('[data-testid="scene-title"]')).toBeVisible();
    } else {
      // その他はテキストベース検索
      await pageActions.expectTextContaining(content);
    }
  }
});

Then('シーン背景画像が表示される', async function () {
  // 実装されたdata-testidを使用
  await expect(this.page.locator('[data-testid="scene-background"]')).toBeVisible();
});

Then('シーン説明文が表示される', async function () {
  // data-testid追加待ち - 暫定でコンテンツ確認
  const descElement = this.page.locator('div[class*="p-"], div:has-text("あなた"), div:has-text("母")').first();
  await expect(descElement).toBeVisible();
});

Then('「次へ」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("次へ")')).toBeVisible();
});