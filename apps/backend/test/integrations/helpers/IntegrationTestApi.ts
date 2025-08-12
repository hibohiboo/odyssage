import type { GameMasterSessionRequest } from '@odyssage/schema/src/schema';

/**
 * 統合テスト用APIクライアント
 * テストでの重複コードを解消し、APIエンドポイントへの統一的なアクセスを提供
 */
export class IntegrationTestApi {
  constructor(
    private app: any,
    private env: any,
  ) {}

  // ===== ユーザー管理API =====

  /**
   * ユーザー情報を取得
   */
  async getUser(uid: string) {
    return this.app.request(
      `/api/users/${uid}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * ユーザー情報を登録・更新
   * @param uid ユーザーID
   * @param userData ユーザーデータまたは文字列（テスト用）
   */
  async putUser(uid: string, userData: any) {
    return this.app.request(
      `/api/users/${uid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: typeof userData === 'string' ? userData : JSON.stringify(userData),
      },
      this.env,
    );
  }

  // ===== セッション管理API（Game Masters） =====

  /**
   * GMセッションを作成（認証あり）
   */
  async createSession(gmId: string, sessionData: GameMasterSessionRequest) {
    return this.app.request(
      `/api/game-masters/${gmId}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
        body: JSON.stringify(sessionData),
      },
      this.env,
    );
  }

  /**
   * GMセッションを作成（認証なし - テスト環境用）
   */
  async createSessionWithoutAuth(
    gmId: string,
    sessionData: GameMasterSessionRequest,
  ) {
    return this.app.request(
      `/api/game-masters/${gmId}/sessions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      },
      this.env,
    );
  }

  /**
   * 指定GMのセッション一覧を取得
   */
  async getGmSessions(gmId: string) {
    return this.app.request(
      `/api/game-masters/${gmId}/sessions`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  // ===== セッション管理API（従来） =====

  /**
   * セッションIDでセッション詳細を取得
   */
  async getSessionById(sessionId: string) {
    return this.app.request(
      `/api/sessions/${sessionId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * セッション一覧を取得（クエリパラメータ対応）
   */
  async getSessions(gmId?: string) {
    const url = gmId ? `/api/sessions?gm_id=${gmId}` : '/api/sessions';
    return this.app.request(
      url,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * セッションのステータスを更新
   */
  async updateSessionStatus(gmId: string, sessionId: string, status: string) {
    return this.app.request(
      `/api/game-masters/${gmId}/sessions/${sessionId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
        body: JSON.stringify({ status }),
      },
      this.env,
    );
  }

  // ===== シナリオ管理API =====

  /**
   * シナリオを作成
   */
  async createScenario(
    userId: string,
    scenarioData: {
      id: string;
      title: string;
      overview: string;
      visibility?: string;
    },
  ) {
    return this.app.request(
      `/api/users/${userId}/scenarios`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
        body: JSON.stringify(scenarioData),
      },
      this.env,
    );
  }

  /**
   * ユーザーのシナリオ一覧を取得
   */
  async getUserScenarios(userId: string) {
    return this.app.request(
      `/api/users/${userId}/scenarios`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * 公開シナリオ一覧を取得
   */
  async getPublicScenarios() {
    return this.app.request(
      `/api/scenarios`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * シナリオ詳細を取得
   */
  async getScenarioById(userId: string, scenarioId: string) {
    return this.app.request(
      `/api/users/${userId}/scenarios/${scenarioId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      this.env,
    );
  }

  /**
   * シナリオを更新
   */
  async updateScenario(
    userId: string,
    scenarioId: string,
    updates: {
      title?: string;
      overview?: string;
      visibility?: string;
    },
  ) {
    return this.app.request(
      `/api/users/${userId}/scenarios/${scenarioId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
        body: JSON.stringify(updates),
      },
      this.env,
    );
  }

  // ===== ユーティリティメソッド =====

  /**
   * レスポンスのJSONデータを型付きで取得
   */
  async getJsonResponse<T = any>(response: Response): Promise<T> {
    return (await response.json()) as T;
  }

  /**
   * 成功レスポンスかチェック
   */
  isSuccessResponse(response: Response): boolean {
    return response.status >= 200 && response.status < 300;
  }

  /**
   * エラーレスポンスかチェック
   */
  isErrorResponse(response: Response): boolean {
    return response.status >= 400;
  }
}
