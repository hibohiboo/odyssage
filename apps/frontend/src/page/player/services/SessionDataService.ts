/**
 * SessionDataService - セッションデータのモック実装
 * PlaySessionContainer と同じアプローチ: LocalStorage + モックデータ
 * MVP制約: バックエンドAPI呼び出しなし
 */

export interface SessionData {
  id: string;
  title: string;
  scenarioId: string;
  scenarioTitle: string;
  status: 'available' | 'ongoing' | 'completed';
  overview: string;
  author: {
    name: string;
  };
  createdAt: string;
  tags: string[];
}

/**
 * モックセッションデータ
 * 実際のプロダクションでは静的JSONファイルまたはAPI連携に置き換え
 */
const MOCK_SESSIONS: SessionData[] = [
  {
    id: 'test-session-join',
    title: 'テストセッション（参加用）',
    scenarioId: 'sample-scenario-1',
    scenarioTitle: '魔法の森の冒険',
    status: 'available',
    overview: 'このセッションでは「魔法の森の冒険」シナリオをプレイします。\n\n古い森に隠された謎を解き明かし、仲間と協力して困難を乗り越える冒険が待っています。初心者の方でも楽しめる内容となっております。\n\nステータス: 参加者募集中',
    author: {
      name: 'テストGM',
    },
    createdAt: '2025-08-26T00:00:00.000Z',
    tags: ['TRPG', 'オンラインセッション', '初心者歓迎'],
  },
  {
    id: 'session-ongoing-test',
    title: '進行中セッション',
    scenarioId: 'sample-scenario-2',
    scenarioTitle: '都市の謎解き',
    status: 'ongoing',
    overview: 'このセッションでは「都市の謎解き」シナリオをプレイします。\n\n現代都市を舞台にした謎解きとサスペンスが展開される物語です。プレイヤーの推理力と判断力が試されます。\n\nステータス: 進行中',
    author: {
      name: '経験豊富GM',
    },
    createdAt: '2025-08-25T12:00:00.000Z',
    tags: ['TRPG', '謎解き', '中級者向け'],
  },
  {
    id: 'session-completed-test',
    title: '完了済みセッション',
    scenarioId: 'sample-scenario-3',
    scenarioTitle: '宇宙船の危機',
    status: 'completed',
    overview: 'このセッションでは「宇宙船の危機」シナリオをプレイしました。\n\nSF世界を舞台にしたスリルあふれる冒険でした。プレイヤーの皆さんは見事に危機を乗り越え、無事に地球に帰還することができました。\n\nステータス: 完了',
    author: {
      name: 'SF好きGM',
    },
    createdAt: '2025-08-24T18:30:00.000Z',
    tags: ['TRPG', 'SF', '上級者向け'],
  },
];

export class SessionDataService {
  private readonly SESSION_DATA_CACHE_KEY = 'odyssage_session_data_cache';

  /**
   * セッション詳細データを取得
   * PlaySessionContainer の SceneLoader と同じパターン
   */
  async loadSessionData(sessionId: string): Promise<SessionData | null> {
    try {
      // 1. LocalStorageから既存データ確認
      const cached = this.loadFromCache(sessionId);
      if (cached) {
        return cached;
      }

      // 2. モックデータから取得
      const sessionData = await SessionDataService.loadFromMockData(sessionId);
      if (sessionData) {
        // 3. LocalStorageにキャッシュ保存
        this.saveToCache(sessionId, sessionData);
        return sessionData;
      }

      return null;
    } catch (error) {
      console.error('Session data loading failed:', error);
      return null;
    }
  }

  /**
   * 全セッション一覧を取得（将来の機能拡張用）
   */
  static async loadAllSessions(): Promise<SessionData[]> {
    try {
      // モックデータから全セッション取得
      await SessionDataService.simulateAsyncDelay();
      return JSON.parse(JSON.stringify(MOCK_SESSIONS));
    } catch (error) {
      console.error('All sessions loading failed:', error);
      return [];
    }
  }

  /**
   * モックデータから特定セッションを取得
   */
  private static async loadFromMockData(sessionId: string): Promise<SessionData | null> {
    // 非同期処理をシミュレート（実際のAPI呼び出し時間をエミュレート）
    await SessionDataService.simulateAsyncDelay();

    // モックデータから該当セッションを検索
    const session = MOCK_SESSIONS.find(s => s.id === sessionId);
    return session ? JSON.parse(JSON.stringify(session)) : null;
  }

  /**
   * LocalStorageからセッションデータを読み込み
   */
  private loadFromCache(sessionId: string): SessionData | null {
    try {
      const cacheKey = `${this.SESSION_DATA_CACHE_KEY}_${sessionId}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      return SessionDataService.validateSessionData(parsed) ? parsed : null;
    } catch (error) {
      console.error('Session cache loading error:', error);
      return null;
    }
  }

  /**
   * LocalStorageにセッションデータを保存
   */
  private saveToCache(sessionId: string, sessionData: SessionData): void {
    try {
      const cacheKey = `${this.SESSION_DATA_CACHE_KEY}_${sessionId}`;
      const data = JSON.stringify(sessionData);
      localStorage.setItem(cacheKey, data);
    } catch (error) {
      console.error('Session cache saving error:', error);
      // エラーでも処理を継続（キャッシュ失敗は致命的ではない）
    }
  }

  /**
   * セッションデータの基本的なバリデーション
   */
  private static validateSessionData(data: unknown): data is SessionData {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof (data as SessionData).id === 'string' &&
      typeof (data as SessionData).title === 'string' &&
      typeof (data as SessionData).status === 'string'
    );
  }

  /**
   * 非同期遅延のシミュレート（実際のAPI呼び出し時間をエミュレート）
   */
  private static async simulateAsyncDelay(): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 150); // SceneLoader より少し長め
    });
  }

  /**
   * キャッシュクリア（開発・デバッグ用）
   */
  clearCache(sessionId?: string): void {
    try {
      if (sessionId) {
        // 特定セッションのキャッシュのみクリア
        const cacheKey = `${this.SESSION_DATA_CACHE_KEY}_${sessionId}`;
        localStorage.removeItem(cacheKey);
      } else {
        // 全セッションキャッシュをクリア
        const keys = Object.keys(localStorage);
        const sessionKeys = keys.filter(key => key.startsWith(this.SESSION_DATA_CACHE_KEY));
        sessionKeys.forEach((key) => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Session cache clear error:', error);
    }
  }
}