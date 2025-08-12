import { execSql } from '@odyssage/database/test-utils/execSql';

/**
 * 統合テスト用フィクスチャー管理クラス
 * テストデータの作成・削除・管理を統一的に提供
 */
export class TestFixtures {
  constructor(private connectionString: string) {}

  // ===== テストデータ定数 =====

  static readonly TEST_USERS = {
    GM_USER: {
      id: 'test-gm-user-12345',
      name: 'テストゲームマスター',
    },
    PLAYER_USER: {
      id: 'test-player-user-67890',
      name: 'テストプレイヤー',
    },
    OTHER_USER: {
      id: 'test-other-user-99999',
      name: 'その他のユーザー',
    },
  } as const;

  static readonly TEST_SCENARIOS = {
    PUBLIC_SCENARIO: {
      id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
      title: 'パブリックテストシナリオ',
      overview: 'これはパブリック用のテストシナリオです',
      visibility: 'public',
    },
    PRIVATE_SCENARIO: {
      id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
      title: 'プライベートテストシナリオ',
      overview: 'これはプライベート用のテストシナリオです',
      visibility: 'private',
    },
  } as const;

  static readonly TEST_SESSIONS = {
    PREPARING_SESSION: {
      id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
      title: 'テストセッション（準備中）',
      status: '準備中',
    },
    ACTIVE_SESSION: {
      id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
      title: 'テストセッション（進行中）',
      status: '進行中',
    },
  } as const;

  // ===== テーブルクリーンアップ =====

  /**
   * すべてのテストテーブルをクリーンアップ
   */
  async cleanupAllTables() {
    await this.cleanupSessions();
    await this.cleanupScenarios();
    await this.cleanupUsers();
  }

  /**
   * セッションテーブルをクリーンアップ
   */
  async cleanupSessions() {
    await execSql(this.connectionString, 'DELETE FROM odyssage.sessions');
  }

  /**
   * シナリオテーブルをクリーンアップ
   */
  async cleanupScenarios() {
    await execSql(this.connectionString, 'DELETE FROM odyssage.scenarios');
  }

  /**
   * ユーザーテーブルをクリーンアップ
   */
  async cleanupUsers() {
    await execSql(this.connectionString, 'DELETE FROM odyssage.users');
  }

  // ===== テストデータ作成 =====

  /**
   * 標準テストユーザーを作成
   */
  async createTestUsers() {
    const users = Object.values(TestFixtures.TEST_USERS);
    const values = users
      .map((user) => `('${user.id}', '${user.name}')`)
      .join(', ');

    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.users (id, name) VALUES ${values}`,
    );
  }

  /**
   * 標準テストシナリオを作成
   * @param userId シナリオ作成者のユーザーID（デフォルト: GM_USER）
   */
  async createTestScenarios(
    userId: string = TestFixtures.TEST_USERS.GM_USER.id,
  ) {
    const scenarios = Object.values(TestFixtures.TEST_SCENARIOS);
    const values = scenarios
      .map(
        (scenario) =>
          `('${scenario.id}', '${scenario.title}', '${scenario.overview}', '${userId}', '${scenario.visibility}', CURRENT_TIMESTAMP)`,
      )
      .join(', ');

    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.scenarios (id, title, overview, user_id, visibility, updated_at) VALUES ${values}`,
    );
  }

  /**
   * 標準テストセッションを作成
   * @param gmId ゲームマスターのユーザーID（デフォルト: GM_USER）
   * @param scenarioId 使用するシナリオID（デフォルト: PUBLIC_SCENARIO）
   */
  async createTestSessions(
    gmId: string = TestFixtures.TEST_USERS.GM_USER.id,
    scenarioId: string = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id,
  ) {
    const sessions = Object.values(TestFixtures.TEST_SESSIONS);
    const values = sessions
      .map(
        (session) =>
          `('${session.id}', '${gmId}', '${scenarioId}', '${session.title}', '${session.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      )
      .join(', ');

    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, created_at, updated_at) VALUES ${values}`,
    );
  }

  // ===== カスタムデータ作成 =====

  /**
   * カスタムユーザーを作成
   */
  async createUser(id: string, name: string) {
    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.users (id, name) VALUES ('${id}', '${name}')`,
    );
  }

  /**
   * カスタムシナリオを作成
   */
  async createScenario(
    id: string,
    title: string,
    overview: string,
    userId: string,
    visibility: string = 'public',
  ) {
    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.scenarios (id, title, overview, user_id, visibility, updated_at) 
       VALUES ('${id}', '${title}', '${overview}', '${userId}', '${visibility}', CURRENT_TIMESTAMP)`,
    );
  }

  /**
   * カスタムセッションを作成
   */
  async createSession(
    id: string,
    gmId: string,
    scenarioId: string,
    title: string,
    status: string = '準備中',
  ) {
    await execSql(
      this.connectionString,
      `INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, created_at, updated_at) 
       VALUES ('${id}', '${gmId}', '${scenarioId}', '${title}', '${status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    );
  }

  // ===== セットアップメソッド =====

  /**
   * 基本的なテストデータセットアップ（ユーザー + シナリオ）
   */
  async setupBasicTestData() {
    await this.cleanupAllTables();
    await this.createTestUsers();
    await this.createTestScenarios();
  }

  /**
   * 完全なテストデータセットアップ（ユーザー + シナリオ + セッション）
   */
  async setupFullTestData() {
    await this.setupBasicTestData();
    await this.createTestSessions();
  }

  // ===== ユーティリティメソッド =====

  /**
   * テストデータの存在確認
   */
  async verifyTestDataExists(): Promise<{
    users: number;
    scenarios: number;
    sessions: number;
  }> {
    const [userCount] = await execSql(
      this.connectionString,
      'SELECT COUNT(*) as count FROM odyssage.users',
    );
    const [scenarioCount] = await execSql(
      this.connectionString,
      'SELECT COUNT(*) as count FROM odyssage.scenarios',
    );
    const [sessionCount] = await execSql(
      this.connectionString,
      'SELECT COUNT(*) as count FROM odyssage.sessions',
    );

    return {
      users: userCount.count as number,
      scenarios: scenarioCount.count as number,
      sessions: sessionCount.count as number,
    };
  }
}
