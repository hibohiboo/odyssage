import { Page } from '@playwright/test';

/**
 * Player文脈テスト用のヘルパー関数
 * LocalStorage操作・モックデータ管理・Player固有の操作を提供
 */
export class PlayerTestHelper {
  constructor(private page: Page) {}

  /**
   * テスト用のシーンデータをLocalStorageにセットアップ
   */
  async setupTestScenes(sessionId: string) {
    const testScenes = [
      {
        id: 'forest_entrance',
        title: '第1章：母の病気',
        description: 'あなたの母が重い病気にかかってしまいました。\n村の医者は首を振るばかりで、薬草に詳しい老人が言います。\n「伝説の薬草『星月花』があれば治るかもしれない。しかし、それは危険な山奥にしかない」\nあなたはどうしますか？',
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
        description: 'あなたは慎重な判断を下しました。\n村で情報を集め、必要な道具を準備することにします。',
        backgroundImage: '村の道具屋と準備をする冒険者',
        events: [
          {
            type: 'narrative',
            content: 'あなたは慎重な判断を下しました。村で情報を集め、必要な道具を準備することにします。'
          },
          {
            type: 'choice',
            content: '準備完了後の行動を選択してください',
            choices: [
              {
                id: 'choice-prep-1',
                text: '道案内を雇う',
                nextSceneId: 'with_guide'
              },
              {
                id: 'choice-prep-2',
                text: '一人で向かう',
                nextSceneId: 'solo_journey'
              }
            ]
          }
        ]
      },
      {
        id: 'mountain_path',
        title: '第3章：危険な山道',
        description: '急いで山に向かったあなた。しかし準備不足で困難に直面します。',
        events: [
          {
            type: 'narrative',
            content: '急いで山に向かったあなた。しかし準備不足で困難に直面します。'
          }
        ]
      }
    ];

    await this.page.evaluate((data) => {
      const { scenes, sessionId } = data;
      localStorage.setItem(`odyssage_session_${sessionId}_scenes`, JSON.stringify(scenes));
    }, { scenes: testScenes, sessionId });
  }

  /**
   * セッション参加状態をLocalStorageにセットアップ
   */
  async setupSessionJoined(sessionId: string, sessionName: string) {
    const sessionData = {
      sessionId,
      sessionName,
      status: 'joined',
      joinedAt: new Date().toISOString()
    };

    await this.page.evaluate((data) => {
      localStorage.setItem('odyssage_current_session', JSON.stringify(data));
    }, sessionData);
  }

  /**
   * プレイ状態をLocalStorageに保存
   */
  async savePlayState(sessionId: string, currentSceneId: string, choices: Record<string, string> = {}) {
    const playState = {
      sessionId,
      currentSceneId,
      choices,
      timestamp: new Date().toISOString()
    };

    await this.page.evaluate((state) => {
      localStorage.setItem('odyssage_play_state', JSON.stringify(state));
    }, playState);
  }

  /**
   * LocalStorageからプレイ状態を取得
   */
  async getPlayState(): Promise<any> {
    return await this.page.evaluate(() => {
      const stateJson = localStorage.getItem('odyssage_play_state');
      return stateJson ? JSON.parse(stateJson) : null;
    });
  }

  /**
   * LocalStorageをクリア
   */
  async clearStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
    });
  }

  /**
   * エラーテスト用の設定をLocalStorageにセット
   */
  async setupErrorTest(errorType: 'choice' | 'scene_load' | 'auto_save') {
    await this.page.evaluate((type) => {
      localStorage.setItem(`odyssage_test_${type}_error`, 'true');
    }, errorType);
  }

  /**
   * エラーテスト用の設定をクリア
   */
  async clearErrorTest(errorType: 'choice' | 'scene_load' | 'auto_save') {
    await this.page.evaluate((type) => {
      localStorage.removeItem(`odyssage_test_${type}_error`);
    }, errorType);
  }

  /**
   * プレイ画面に直接アクセス
   */
  async navigateToPlayScreen(sessionId: string, sceneId?: string) {
    const url = sceneId 
      ? `http://localhost:5173/player/session/${sessionId}/play/${sceneId}`
      : `http://localhost:5173/player/session/${sessionId}/play`;
    
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * セッション一覧画面に移動
   */
  async navigateToSessionList() {
    await this.page.goto('http://localhost:5173/player/sessions');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 選択肢を選択
   */
  async selectChoice(choiceText: string) {
    const choiceButton = this.page.locator(`button:has-text("${choiceText}")`);
    await choiceButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 選択肢インデックスで選択
   */
  async selectChoiceByIndex(index: number) {
    const choiceButtons = this.page.locator('button[data-testid*="choice"]');
    await choiceButtons.nth(index).click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * メニューを開く
   */
  async openMenu() {
    await this.page.locator('button[data-testid="menu-button"]').click();
    await this.page.waitForTimeout(500);
  }

  /**
   * 自動保存状態を確認
   */
  async getAutoSaveStatus(): Promise<string> {
    return await this.page.evaluate(() => {
      const statusElement = document.querySelector('[data-testid="autosave-status"]');
      return statusElement ? statusElement.textContent || '' : '';
    });
  }

  /**
   * ローディング状態を確認
   */
  async isLoading(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const loadingElement = document.querySelector('[data-testid="loading"]');
      return loadingElement !== null;
    });
  }

  /**
   * エラーメッセージを取得
   */
  async getErrorMessage(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const errorElement = document.querySelector('[data-testid="error-message"]');
      return errorElement ? errorElement.textContent : null;
    });
  }

  /**
   * 現在のシーンタイトルを取得
   */
  async getCurrentSceneTitle(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const titleElement = document.querySelector('[data-testid="scene-title"]');
      return titleElement ? titleElement.textContent : null;
    });
  }

  /**
   * 利用可能な選択肢の数を取得
   */
  async getChoiceCount(): Promise<number> {
    return await this.page.locator('button[data-testid*="choice"]').count();
  }

  /**
   * 選択肢が選択済みかどうかを確認
   */
  async isChoiceSelected(choiceText: string): Promise<boolean> {
    return await this.page.evaluate((text) => {
      const choiceButton = document.querySelector(`button:has-text("${text}")`);
      return choiceButton ? choiceButton.classList.contains('selected') : false;
    }, choiceText);
  }

  /**
   * URLのシーンIDを取得
   */
  async getCurrentSceneIdFromUrl(): Promise<string | null> {
    const url = this.page.url();
    const match = url.match(/\/play\/([^/?]+)/);
    return match ? match[1] : null;
  }

  /**
   * テスト用のシナリオデータをセットアップ
   */
  async setupTestScenarios() {
    const scenarios = [
      {
        id: 'fantasy-001',
        title: '失われた森の守護者',
        overview: '古い森で起きる不思議な現象を調査する冒険者の物語',
        estimatedPlayTime: '45分',
        status: '公開中'
      },
      {
        id: 'adventure-001',
        title: '薬草採取の旅',
        overview: '病気の母を救うため、伝説の薬草を求めて危険な山奥へと向かう若者の物語',
        estimatedPlayTime: '35分',
        status: '公開中'
      }
    ];

    await this.page.evaluate((data) => {
      localStorage.setItem('odyssage_scenarios', JSON.stringify(data));
    }, scenarios);
  }

  /**
   * テスト用のセッションデータをセットアップ
   */
  async setupTestSessions() {
    const sessions = [
      {
        sessionId: 'session-001',
        scenarioId: 'fantasy-001',
        sessionName: '失われた森の守護者 - 深夜セッション',
        status: '進行中'
      },
      {
        sessionId: 'session-002',
        scenarioId: 'adventure-001',
        sessionName: '薬草採取の旅 - 初心者歓迎',
        status: '参加者募集中'
      },
      {
        sessionId: 'session-003',
        scenarioId: 'fantasy-001',
        sessionName: '失われた森の守護者 - 完結編',
        status: '完了'
      }
    ];

    await this.page.evaluate((data) => {
      localStorage.setItem('odyssage_sessions', JSON.stringify(data));
    }, sessions);
  }
}