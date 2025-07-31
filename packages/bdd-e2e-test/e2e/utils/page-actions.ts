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
    await expect(this.page.getByText(text)).toBeVisible();
  }

  /**
   * 指定されたテキストを含む要素が表示されているか確認（部分一致）
   */
  async expectTextContaining(text: string) {
    await expect(this.page.locator(`:has-text("${text}")`).first()).toBeVisible();
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
    await this.page.waitForSelector(`text=${message}`, { timeout: 5000 });
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
}