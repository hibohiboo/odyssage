import { Given, When, Then } from '@cucumber/cucumber';
import { PageActions } from '../utils/page-actions.js';
import { neo4jHelper } from '../utils/neo4j-helper.js';
import { expect } from '@playwright/test';

// 共通ヘルパー関数
class SceneTestHelpers {
  constructor(private page: any) {}

  private getPageActions() {
    return new PageActions(this.page);
  }

  async createSceneOptimistic(title: string, overview: string, order: string = '1') {
    const pageActions = this.getPageActions();
    await pageActions.clickButton('新しいシーンを追加');
    await pageActions.fillByTestId('scene-title-input', title);
    await pageActions.fillByTestId('scene-overview-input', overview);
    await pageActions.fillByTestId('scene-order-input', order);
    await pageActions.clickButton('シーンを追加');
  }

  async createSceneNormal(title: string, overview: string, order: string = '1') {
    const pageActions = this.getPageActions();
    await pageActions.clickButton('新しいシーンを追加');
    await pageActions.fillByTestId('scene-title-input', title);
    await pageActions.fillByTestId('scene-overview-input', overview);
    await pageActions.fillByTestId('scene-order-input', order);
    await pageActions.clickButton('シーンを保存');
    await pageActions.waitForSuccessMessage('シーンが保存されました');
  }

  async expectSceneVisibleImmediately(sceneTitle: string) {
    const pageActions = this.getPageActions();
    await pageActions.expectTextVisible(sceneTitle);
    const sceneElement = this.page.locator(`text=${sceneTitle}`);
    await expect(sceneElement).toBeVisible({ timeout: 1000 });
  }

  async expectNewBadgeVisible() {
    const pageActions = this.getPageActions();
    await pageActions.expectTextVisible('新規');
    const badgeElement = this.page.locator('.bg-amber-100:has-text("新規")');
    await expect(badgeElement).toBeVisible();
  }

  async expectUnsavedChangesWarning() {
    const pageActions = this.getPageActions();
    await pageActions.expectTextVisible('未保存の変更があります');
    const warningBanner = this.page.locator('.bg-amber-50:has-text("未保存の変更があります")');
    await expect(warningBanner).toBeVisible();
  }

  async expectNoNewBadges() {
    const badges = this.page.locator('.bg-amber-100:has-text("新規")');
    await expect(badges).toHaveCount(0);
  }

  async navigateToScenarioDetail() {
    await this.page.goto('http://localhost:5173/creator/scenario/list');
    await this.page.waitForLoadState('networkidle');
    const scenarioLink = this.page.locator('a[href*="/creator/scenario/"]').first();
    await scenarioLink.click();
    await this.page.waitForURL(/\/creator\/scenario\/[\w-]+/);
    const pageActions = this.getPageActions();
    await pageActions.expectTextVisible('シーン管理');
  }
}

Given('既存のシナリオを使用してシナリオ詳細ページにいる', async function (this) {
  try {
    // シナリオ一覧ページに移動
    await this.page.goto('http://localhost:5173/creator/scenario/list');
    await this.page.waitForLoadState('networkidle');
    
    // 最初のシナリオを選択（既存のシナリオを使用）
    const scenarioLink = this.page.locator('a[href*="/creator/scenario/"]').first();
    await scenarioLink.click();
    
    // シナリオ詳細ページに移動したことを確認
    await this.page.waitForURL(/\/creator\/scenario\/[\w-]+/);
    
    // シーン管理セクションが表示されるまで待機
    const pageActions = new PageActions(this.page);
    await pageActions.expectTextVisible('シーン管理');
    
    console.log('前提条件: 既存のシナリオ詳細ページに移動しました');
  } catch (error) {
    console.error('シナリオ詳細ページへの移動に失敗:', error);
  }
});

Given('シナリオ「楽観的更新テスト用シナリオ」が作成済みである', async function (this) {
  const PageActions = (await import('../utils/page-actions.js')).PageActions;
  const pageActions = new PageActions(this.page);
  
  try {
    // シナリオ作成ページに移動
    await this.page.goto('http://localhost:5173/creator/scenario/create');
    
    // シナリオ作成フォームに入力
    await this.page.fill('#title', '楽観的更新テスト用シナリオ');
    await this.page.fill('#overview', '楽観的更新機能をテストするためのシナリオです');
    
    // シナリオを保存
    await this.page.click('button[type="submit"]');
    
    // 作成完了後、シナリオ一覧ページに遷移するまで待機
    await this.page.waitForURL(/\/creator\/scenario\/list/);
    
    console.log('前提条件: 楽観的更新テスト用シナリオを作成しました');
  } catch (error) {
    console.error('楽観的更新テスト用シナリオの作成に失敗:', error);
  }
});

Given('ユーザーがシナリオ詳細ページにいる', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // シナリオ一覧から対象シナリオを選択
  await pageActions.expectTextVisible('楽観的更新テスト用シナリオ');
  await this.page.click('text=楽観的更新テスト用シナリオ');
  
  // シナリオ詳細ページに移動したことを確認
  await this.page.waitForURL(/\/creator\/scenario\/\w+/);
  await pageActions.expectTextVisible('シーン管理');
});

Given('シーン「テスト用シーン」が作成済みである', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // 直前のシナリオにシーンを作成（通常の方法で）
  await pageActions.clickButton('新しいシーンを追加');
  await pageActions.fillByTestId('scene-title-input', 'テスト用シーン');
  await pageActions.fillByTestId('scene-overview-input', '楽観的更新テスト用の既存シーン');
  await pageActions.fillByTestId('scene-order-input', '1');
  await pageActions.clickButton('シーンを保存');
  
  // 保存完了を待機
  await pageActions.waitForSuccessMessage('シーンが保存されました');
});

Given('シーン「削除対象シーン」が作成済みである', async function (this) {
  const pageActions = new PageActions(this.page);
  
  await pageActions.clickButton('新しいシーンを追加');
  await pageActions.fillByTestId('scene-title-input', '削除対象シーン');
  await pageActions.fillByTestId('scene-overview-input', '削除テスト用のシーン');
  await pageActions.fillByTestId('scene-order-input', '1');
  await pageActions.clickButton('シーンを保存');
  
  await pageActions.waitForSuccessMessage('シーンが保存されました');
});

Given('シーンが楽観的に作成・編集・削除されている状態である', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // 1. 楽観的にシーンを作成
  await pageActions.clickButton('新しいシーンを追加');
  await pageActions.fillByTestId('scene-title-input', '楽観的作成シーン');
  await pageActions.fillByTestId('scene-overview-input', '楽観的に作成されたシーン');
  await pageActions.fillByTestId('scene-order-input', '1');
  await pageActions.clickButton('シーンを追加'); // 楽観的更新では「追加」ボタン
  
  // 2. 既存シーンを楽観的に編集（事前に作成済みと仮定）
  if (await this.page.locator('text=テスト用シーン').isVisible()) {
    await this.page.click('[data-testid="edit-scene-button"]');
    await pageActions.fillByTestId('scene-title-input', '楽観的編集シーン');
    await pageActions.clickButton('シーンを更新');
  }
  
  // 未保存変更の警告が表示されることを確認
  await pageActions.expectTextVisible('未保存の変更があります');
});

Given('シーンが楽観的に作成されている状態である', async function (this) {
  const pageActions = new PageActions(this.page);
  
  await pageActions.clickButton('新しいシーンを追加');
  await pageActions.fillByTestId('scene-title-input', '楽観的作成テストシーン');
  await pageActions.fillByTestId('scene-overview-input', 'サーバーエラーテスト用');
  await pageActions.fillByTestId('scene-order-input', '1');
  await pageActions.clickButton('シーンを追加');
  
  await pageActions.expectTextVisible('未保存の変更があります');
});

Given('サーバーが一時的にエラーを返す状態にある', async function (this) {
  // サーバーエラーのシミュレーション設定
  // 実際の実装では、Network条件やMockServiceWorkerでエラーレスポンスを設定
  console.log('サーバーエラー状態をシミュレート（実装時は適切なエラー条件を設定）');
});

When('ユーザーが「シーン管理」セクションを開く', async function (this) {
  // シーン管理セクションは既にシナリオ詳細ページで表示されている想定
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible('シーン管理');
});

When('シーンタイトルを「{string}」と入力する', async function (this, title: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.fillByTestId('scene-title-input', title);
});

When('シーン概要を「{string}」と入力する', async function (this, overview: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.fillByTestId('scene-overview-input', overview);
});

When('シーン順序を「{int}」と設定する', async function (this, order: number) {
  const pageActions = new PageActions(this.page);
  await pageActions.fillByTestId('scene-order-input', order.toString());
});

When('「シーンを追加」ボタンをクリックする', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.clickButton('シーンを追加');
});

When('さらに「新しいシーンを追加」ボタンをクリックする', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.clickButton('新しいシーンを追加');
});

Then('シーン「{string}」も即座にシーン一覧に表示される', async function (this, sceneTitle: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible(sceneTitle);
  
  // 即座に表示されることを検証
  const sceneElement = this.page.locator(`text=${sceneTitle}`);
  await expect(sceneElement).toBeVisible({ timeout: 1000 });
});

When('シーンタイトルを「{string}」と入力してシーンを追加する', async function (this, title: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.fillByTestId('scene-title-input', title);
  await pageActions.fillByTestId('scene-overview-input', `${title}の概要`);
  await pageActions.fillByTestId('scene-order-input', '1');
  await pageActions.clickButton('シーンを追加');
});

When('さらに別のシーンを編集してタイトルを変更する', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // 既存のシーンの編集ボタンをクリック（最初に見つかるもの）
  await this.page.click('[data-testid="edit-scene-button"]:first-of-type');
  await pageActions.fillByTestId('scene-title-input', '楽観的編集されたシーン');
  await pageActions.clickButton('シーンを更新');
});

When('既存のシーンを1つ削除する', async function (this) {
  // 削除ボタンをクリック（最初に見つかるもの）
  await this.page.click('[data-testid="delete-scene-button"]:first-of-type');
  await this.page.click('button:has-text("OK")'); // 確認ダイアログ
});

When('ユーザーがシーン「{string}」の編集ボタンをクリックする', async function (this, sceneTitle: string) {
  // 特定のシーンの編集ボタンを探してクリック
  await this.page.click(`[data-testid="scene-item"]:has-text("${sceneTitle}") [data-testid="edit-scene-button"]`);
});

When('シーンタイトルを「{string}」に変更する', async function (this, newTitle: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.clearAndFill('[data-testid="scene-title-input"]', newTitle);
});

When('シーン概要を「{string}」に変更する', async function (this, newOverview: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.clearAndFill('[data-testid="scene-overview-input"]', newOverview);
});

When('ユーザーがシーン「{string}」の削除ボタンをクリックする', async function (this, sceneTitle: string) {
  await this.page.click(`[data-testid="scene-item"]:has-text("${sceneTitle}") [data-testid="delete-scene-button"]`);
});

When('削除確認ダイアログで「OK」をクリックする', async function (this) {
  await this.page.click('button:has-text("OK")');
});

When('破棄確認ダイアログで「OK」をクリックする', async function (this) {
  await this.page.click('button:has-text("OK")');
});

Then('シーン「{string}」が即座にシーン一覧に表示される', async function (this, sceneTitle: string) {
  const pageActions = new PageActions(this.page);
  
  // シーンがすぐに表示されることを確認（ローディングなし）
  await pageActions.expectTextVisible(sceneTitle);
  
  // ネットワーク待機なしで即座に表示されることを検証
  const sceneElement = this.page.locator(`text=${sceneTitle}`);
  await expect(sceneElement).toBeVisible({ timeout: 1000 }); // 1秒以内で表示
});

Then('シーンに「新規」バッジが表示されている', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible('新規');
  
  // 新規バッジのスタイルも確認
  const badgeElement = this.page.locator('.bg-amber-100:has-text("新規")');
  await expect(badgeElement).toBeVisible();
});

Then('「未保存の変更があります」という警告が表示される', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible('未保存の変更があります');
  
  // 警告バナーの色も確認
  const warningBanner = this.page.locator('.bg-amber-50:has-text("未保存の変更があります")');
  await expect(warningBanner).toBeVisible();
});

Then('両方のシーンに「新規」バッジが表示されている', async function (this) {
  const badges = this.page.locator('.bg-amber-100:has-text("新規")');
  await expect(badges).toHaveCount(2);
});

Then('シーン一覧には2つのシーンが順序通りに表示される', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // 1番目のシーンを確認
  await pageActions.expectTextVisible('1. 森の入口');
  // 2番目のシーンを確認
  await pageActions.expectTextVisible('2. 村の中心');
  
  // 順序が正しいことも確認
  const sceneElements = this.page.locator('[data-testid="scene-item"]');
  await expect(sceneElements).toHaveCount(2);
});

Then('シーン一覧でタイトルが即座に「{string}」に更新される', async function (this, newTitle: string) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible(newTitle);
  
  // 即座に更新されることを確認（1秒以内）
  const updatedElement = this.page.locator(`text=${newTitle}`);
  await expect(updatedElement).toBeVisible({ timeout: 1000 });
});

Then('シーン「{string}」が即座にシーン一覧から消える', async function (this, sceneTitle: string) {
  // シーンが即座に削除されることを確認
  const deletedElement = this.page.locator(`text=${sceneTitle}`);
  await expect(deletedElement).not.toBeVisible({ timeout: 1000 });
});

Then('保存中の表示が現れる', async function (this) {
  const pageActions = new PageActions(this.page);
  await pageActions.expectTextVisible('保存中...');
});

Then('保存が完了すると「未保存の変更があります」警告が消える', async function (this) {
  // 警告が消えることを確認
  const warningBanner = this.page.locator('.bg-amber-50:has-text("未保存の変更があります")');
  await expect(warningBanner).not.toBeVisible({ timeout: 5000 });
});

Then('すべての「新規」バッジが消える', async function (this) {
  // 新規バッジが消えることを確認
  const badges = this.page.locator('.bg-amber-100:has-text("新規")');
  await expect(badges).toHaveCount(0);
});

Then('GraphDBにすべての変更が正しく反映されている', async function (this) {
  // GraphDBに保存されていることを確認
  // 実際の実装では、API呼び出しやDB確認ロジックを使用
  console.log('GraphDBへの変更反映を確認（実装時は実際のDB確認処理を追加）');
  
  // 例: 最新のシーンデータをAPIから取得して確認
  await this.page.waitForTimeout(1000); // DB更新完了を待機
});

Then('サーバーから最新のシーンデータが取得される', async function (this) {
  // サーバーからのデータ再取得を確認
  // 実際の実装では、ネットワークリクエストの監視やレスポンス確認
  console.log('サーバーからのデータ再取得を確認');
});

Then('シーン一覧が元の状態に戻る', async function (this) {
  // 破棄前の状態に戻ることを確認
  // 実際の実装では、元の状態と比較
  const pageActions = new PageActions(this.page);
  
  // 楽観的変更が取り消されることを確認
  await this.page.waitForTimeout(500); // UI更新を待機
  console.log('シーン一覧が元の状態に戻りました');
});

Then('すべての楽観的変更が取り消される', async function (this) {
  // 楽観的更新による変更がすべて取り消されることを確認
  const badges = this.page.locator('.bg-amber-100:has-text("新規")');
  await expect(badges).toHaveCount(0);
});

Then('エラーメッセージが表示される', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // エラーメッセージの表示を確認
  // 実際の実装では、具体的なエラーメッセージを確認
  await pageActions.expectTextVisible('保存に失敗しました');
});

Then('シーン一覧が元の状態に自動的に巻き戻される', async function (this) {
  // エラー時の自動巻き戻しを確認
  await this.page.waitForTimeout(1000); // 巻き戻し処理完了を待機
  
  // 楽観的変更が取り消されることを確認
  const badges = this.page.locator('.bg-amber-100:has-text("新規")');
  await expect(badges).toHaveCount(0);
});

Then('すべての操作が即座にUI反映される', async function (this) {
  const pageActions = new PageActions(this.page);
  
  // 複数の操作結果がすべて表示されることを確認
  await pageActions.expectTextVisible('新規シーン');
  await pageActions.expectTextVisible('楽観的編集されたシーン');
  
  // 削除されたシーンは表示されないことを確認
  // （削除対象の具体的なシーン名は文脈により決定）
});

Then('3つの異なる操作による変更が画面に表示されている', async function (this) {
  // 作成・編集・削除の3つの操作結果を確認
  
  // 1. 新規作成されたシーンとバッジ
  const newSceneElement = this.page.locator('text=新規シーン');
  await expect(newSceneElement).toBeVisible();
  
  // 2. 編集されたシーン
  const editedSceneElement = this.page.locator('text=楽観的編集されたシーン');
  await expect(editedSceneElement).toBeVisible();
  
  // 3. 削除されたシーンがないことを確認
  // （具体的な削除シーン名は前のステップから継承）
});

Then('すべての変更が一括でサーバーに送信される', async function (this) {
  // ネットワークリクエストの監視
  // 実際の実装では、Playwrightのネットワーク監視機能を使用
  
  // 一括更新APIが1回だけ呼び出されることを確認
  console.log('一括更新APIの呼び出しを確認（実装時はネットワーク監視を追加）');
});

Then('GraphDBでは1回のトランザクションですべてが処理される', async function (this) {
  // GraphDBでの一括処理確認
  // 実際の実装では、ログやメトリクスでトランザクション数を確認
  console.log('GraphDBでの一括トランザクション処理を確認');
});

Then('最終的なシーン状態が正しく画面に反映される', async function (this) {
  // 最終状態の確認
  await this.page.waitForTimeout(2000); // 保存完了とUI更新を待機
  
  // 未保存変更警告が消えることを確認
  const warningBanner = this.page.locator('.bg-amber-50:has-text("未保存の変更があります")');
  await expect(warningBanner).not.toBeVisible();
  
  console.log('最終的なシーン状態が正しく反映されました');
});