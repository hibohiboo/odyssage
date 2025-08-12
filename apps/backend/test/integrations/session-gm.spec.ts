import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * GM Session Management API統合テスト
 * GET /api/game-masters/{uid}/sessions エンドポイントのテスト
 */
describe('GM Session Management API 統合テスト', () => {
  // TestFixtures の統一定数を使用
  const testGmId = TestFixtures.TEST_USERS.GM_USER.id;
  const testOtherGmId = TestFixtures.TEST_USERS.OTHER_USER.id;
  const testScenarioId = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id;

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      const fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let app: ReturnType<typeof getApp>;
  let api: IntegrationTestApi;
  let fixtures: TestFixtures;

  beforeEach(async () => {
    app = getApp();
    api = new IntegrationTestApi(app, getEnv());
    fixtures = new TestFixtures(getConnectionString());

    // セッションのみクリーンアップ（ユーザー・シナリオは保持）
    await fixtures.cleanupSessions();

    // カスタムセッションデータを作成（複数ステータス・複数GMでのテスト用）
    await fixtures.createSession(
      '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
      testGmId,
      testScenarioId,
      'テストセッション1',
      '準備中',
    );
    await fixtures.createSession(
      '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
      testGmId,
      testScenarioId,
      'テストセッション2',
      '進行中',
    );
    await fixtures.createSession(
      '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039803',
      testOtherGmId,
      testScenarioId,
      'その他GMのセッション',
      '準備中',
    );
  });

  // 共通関数は IntegrationTestApi に移行済み

  describe('GET /api/game-masters/{uid}/sessions', () => {
    it('指定GMのセッション一覧を正しく取得できる', async () => {
      const res = await api.getGmSessions(testGmId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // 値ベース検証に変更
      expect(data).toContainEqual(
        expect.objectContaining({
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
          title: 'テストセッション1',
          status: '準備中',
        }),
      );
      expect(data).toContainEqual(
        expect.objectContaining({
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
          title: 'テストセッション2',
          status: '進行中',
        }),
      );

      // その他GMのセッションが含まれていないことを確認
      expect(
        data.every((s) => s.id !== '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039803'),
      ).toBe(true);
    });

    it('セッションが存在しないGMでは空配列を返す', async () => {
      const nonExistentGmId = 'non-existent-gm-id';
      const res = await api.getGmSessions(nonExistentGmId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await api.getGmSessions(testGmId);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);

      const session = data[0];

      // 値による直接検証に変更（型チェック削除）
      expect(session).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        status: expect.any(String),
        scenarioId: expect.any(String),
        scenarioTitle: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      // 関連データの確認
      expect(session.scenarioId).toBe(testScenarioId);
      expect(session.scenarioTitle).toBe(
        TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.title,
      );
    });

    it('複数ステータスのセッションを適切に取得する', async () => {
      const res = await api.getGmSessions(testGmId);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.length).toBe(2);

      // 複数ステータスの確認を簡潔に
      expect(data).toContainEqual(
        expect.objectContaining({ status: '準備中' }),
      );
      expect(data).toContainEqual(
        expect.objectContaining({ status: '進行中' }),
      );

      // 各セッションの詳細確認
      expect(data).toContainEqual(
        expect.objectContaining({
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
          title: 'テストセッション1',
          status: '準備中',
        }),
      );
      expect(data).toContainEqual(
        expect.objectContaining({
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
          title: 'テストセッション2',
          status: '進行中',
        }),
      );
    });

    it('データフィルタリングが正しく動作する', async () => {
      // testGmId のセッション確認
      const res1 = await api.getGmSessions(testGmId);
      const data1 = await res1.json();
      expect(data1.length).toBe(2);

      // 値ベース検証で期待されるセッションを確認
      const expectedIds = [
        '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
        '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
      ];
      expect(data1.every((s) => expectedIds.includes(s.id))).toBe(true);

      // testOtherGmId のセッション確認
      const res2 = await api.getGmSessions(testOtherGmId);
      const data2 = await res2.json();
      expect(data2.length).toBe(1);
      expect(data2[0]).toEqual(
        expect.objectContaining({
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039803',
          title: 'その他GMのセッション',
          status: '準備中',
        }),
      );
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await api.getGmSessions(testGmId);
      expect(res.status).toBe(200);
    });

    it('セッション順序が更新日時順（降順）である', async () => {
      const res = await api.getGmSessions(testGmId);
      const data = await res.json();

      expect(data.length).toBeGreaterThanOrEqual(2);

      // 更新日時順（降順）の確認
      for (let i = 1; i < data.length; i++) {
        const prevUpdatedAt = new Date(data[i - 1].updatedAt);
        const currUpdatedAt = new Date(data[i].updatedAt);
        expect(prevUpdatedAt.getTime()).toBeGreaterThanOrEqual(
          currUpdatedAt.getTime(),
        );
      }
    });
  });
});
