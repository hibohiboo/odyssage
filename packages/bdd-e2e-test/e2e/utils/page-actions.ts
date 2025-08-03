import { expect, Page } from '@playwright/test';

/**
 * BDDテストで共通利用するページ操作のユーティリティ関数
 */
export class PageActions {
  constructor(private page: Page) {}

  /**
   * 指定されたリンクテキストをクリック
   */
  async clickLink(linkText: string) {
    await this.page.waitForSelector(`a:has-text("${linkText}")`);
    await this.page.getByRole('link', { name: linkText }).nth(0).click();
  }

  /**
   * 指定されたボタンテキストをクリック
   */
  async clickButton(buttonText: string) {
    await this.page.getByRole('button', { name: buttonText }).click();
  }

  /**
   * テキストボックスに値を入力
   */
  async fillTextbox(label: string, value: string) {
    await this.page.getByRole('textbox', { name: label }).fill(value);
  }

  /**
   * data-testid属性で要素を特定して値を入力
   */
  async fillByTestId(testId: string, value: string) {
    await this.page.fill(`[data-testid="${testId}"]`, value);
  }

  /**
   * 指定されたテキストが表示されているか確認
   */
  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible({ timeout: 10000 });
  }

  /**
   * 指定されたテキストを含む要素が表示されているか確認（部分一致）
   */
  async expectTextContaining(text: string) {
    // まずページが安定するのを待つ
    await this.waitForPageLoad();
    // 複数の方法でテキストを探す
    try {
      await expect(this.page.locator(`:has-text("${text}")`).first()).toBeVisible({ timeout: 15000 });
    } catch (error) {
      // 別の方法で試す
      console.log(`Trying alternative selector for text: ${text}`);
      await expect(this.page.getByText(text, { exact: false })).toBeVisible({ timeout: 15000 });
    }
  }

  /**
   * ページの読み込み完了を待機
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500);
  }

  /**
   * 要素が表示されるまで待機
   */
  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * 成功メッセージの表示を待機
   */
  async waitForSuccessMessage(message: string) {
    await this.page.waitForSelector(`text=${message}`, { timeout: 10000 });
  }

  /**
   * 特定のテキストを含む行を取得
   */
  getRowContaining(text: string) {
    return this.page.locator(`:has-text("${text}")`).first();
  }

  /**
   * シナリオ管理ページに移動
   */
  async navigateToScenarioManagement() {
    await this.clickLink('シナリオ管理');
    await this.waitForPageLoad();
  }

  /**
   * 新規シナリオ作成ページに移動
   */
  async navigateToNewScenario() {
    await this.clickLink('新規シナリオ作成');
    await this.waitForPageLoad();
  }

  /**
   * シナリオを作成（基本的な作成フロー）
   */
  async createScenario(title: string, overview: string, isPublic: boolean = false) {
    await this.fillTextbox('シナリオタイトル', title);
    await this.fillTextbox('シナリオ概要', overview);
    
    if (isPublic) {
      await this.page.getByText('公開', { exact: true }).click();
    }
    
    await this.clickButton('保存する');
    await this.waitForPageLoad();
  }

  /**
   * シナリオの編集画面を開く
   */
  async openScenarioEdit(scenarioName: string) {
    const scenarioRow = this.getRowContaining(scenarioName);
    await scenarioRow.locator('text=編集する').click();
    await this.waitForPageLoad();
  }

  /**
   * 公開設定を変更
   */
  async changeVisibility(visibility: 'public' | 'private') {
    if (visibility === 'public') {
      await this.page.getByText('公開', { exact: true }).click();
    } else {
      await this.page.locator('label:has-text("非公開（下書き）")').click();
    }
    await this.page.waitForTimeout(100);
  }

  /**
   * シナリオの状態を確認
   */
  async expectScenarioStatus(scenarioName: string, status: string) {
    const scenarioRow = this.getRowContaining(scenarioName);
    await expect(scenarioRow.locator(`:has-text("${status}")`).first()).toBeVisible();
  }

  /**
   * フィールドをクリアしてから値を入力
   */
  async clearAndFill(selector: string, value: string) {
    await this.page.locator(selector).clear();
    await this.page.locator(selector).fill(value);
  }

  /**
   * 楽観的更新の未保存変更警告が表示されているか確認
   */
  async expectUnsavedChangesWarning() {
    await expect(this.page.locator('.bg-amber-50:has-text("未保存の変更があります")')).toBeVisible();
  }

  /**
   * 楽観的更新の未保存変更警告が消えているか確認
   */
  async expectNoUnsavedChangesWarning() {
    await expect(this.page.locator('.bg-amber-50:has-text("未保存の変更があります")')).not.toBeVisible();
  }

  /**
   * 新規バッジが表示されているか確認
   */
  async expectNewBadge() {
    await expect(this.page.locator('.bg-amber-100:has-text("新規")')).toBeVisible();
  }

  /**
   * 新規バッジが指定された数だけ表示されているか確認
   */
  async expectNewBadgeCount(count: number) {
    await expect(this.page.locator('.bg-amber-100:has-text("新規")')).toHaveCount(count);
  }

  /**
   * 保存ボタンがローディング中かどうか確認
   */
  async expectSaveButtonLoading() {
    await expect(this.page.locator('button:has-text("保存中...")')).toBeVisible();
  }

  /**
   * 楽観的更新で即座にUI変更が反映されることを確認（ローディングなし）
   */
  async expectImmediateUIUpdate(elementSelector: string, timeout: number = 1000) {
    await expect(this.page.locator(elementSelector)).toBeVisible({ timeout });
  }

  /**
   * 楽観的更新のバッチ保存ボタンをクリック
   */
  async clickBatchSaveButton() {
    await this.page.locator('button:has-text("変更を保存")').click();
  }

  /**
   * 楽観的更新のバッチ破棄ボタンをクリック
   */
  async clickBatchDiscardButton() {
    await this.page.locator('button:has-text("変更を破棄")').click();
  }

  /**
   * シーン項目の順序を確認
   */
  async expectSceneOrder(sceneOrders: string[]) {
    for (let i = 0; i < sceneOrders.length; i++) {
      const expectedText = `${i + 1}. ${sceneOrders[i]}`;
      await this.expectTextVisible(expectedText);
    }
  }

  /**
   * 特定のシーンが削除されて表示されないことを確認
   */
  async expectSceneNotVisible(sceneTitle: string, timeout: number = 1000) {
    await expect(this.page.locator(`text=${sceneTitle}`)).not.toBeVisible({ timeout });
  }

  /**
   * エラーメッセージ表示の確認
   */
  async expectErrorMessage(message: string) {
    await expect(this.page.locator(`:has-text("${message}")`)).toBeVisible({ timeout: 5000 });
  }

  /**
   * 楽観的更新のロールバック完了を確認
   */
  async expectOptimisticRollback() {
    // 新規バッジが消えることを確認
    await expect(this.page.locator('.bg-amber-100:has-text("新規")')).toHaveCount(0);
    
    // 未保存変更警告が消えることを確認
    await this.expectNoUnsavedChangesWarning();
  }
}