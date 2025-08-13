import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * Game Master Session Management API統合テスト
 * POST /api/game-masters/{uid}/sessions, GET /api/game-masters/{uid}/sessions エンドポイントのテスト
 */
describe('Game Master Session Management API 統合テスト', () => {
  // テストデータ定数を統一
  const testGMId = TestFixtures.TEST_USERS.GM_USER.id;
  const testScenarioId = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id;
  const testSession = {
    scenarioId: testScenarioId,
    title: 'テストセッション1',
  };

  let fixtures: TestFixtures;
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let api: IntegrationTestApi;

  beforeEach(async () => {
    api = new IntegrationTestApi(getApp(), getEnv());
    // セッションのみクリーンアップ（ユーザー・シナリオは保持）
    await fixtures.cleanupSessions();
  });

  // 共通関数は IntegrationTestApi に移行済み

  describe('POST /api/game-masters/{uid}/sessions', () => {
    it('新規セッションを正しく作成できる', async () => {
      const res = await api.createSession(testGMId, testSession);

      expect(res.status).toBe(201);
      expect(res.headers.get('content-type')).toContain('application/json');

      // 値による直接検証に変更
      const data = await res.json();
      expect(data).toEqual({
        id: expect.any(String),
        gmId: testGMId,
        scenarioId: testSession.scenarioId,
        title: testSession.title,
        status: '準備中',
        createdAt: expect.any(String),
      });

      // 作成されたセッションが取得できることを確認
      const listRes = await api.getGmSessions(testGMId);
      expect(listRes.status).toBe(200);
      const sessions = await listRes.json();
      expect(sessions.length).toBe(1);
      expect(sessions[0]).toEqual({
        id: data.id,
        title: testSession.title,
        status: '準備中',
        scenarioId: testSession.scenarioId,
        scenarioTitle: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it.each([
      ['必須フィールドが不足している場合400エラー', undefined, 400],
      [
        '存在しないシナリオIDで400エラー',
        '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999',
        400,
      ],
    ])('%s', async (_, scenarioId, expectStatus) => {
      const invalidSession = {
        title: testSession.title,
        ...testSession,
        scenarioId,
      };

      const res = await api.createSession(testGMId, invalidSession as any);
      expect(res.status).toBe(expectStatus);
    });

    it('複数セッション作成時にユニークIDが生成される', async () => {
      const session1 = await api.createSession(testGMId, {
        ...testSession,
        title: 'セッション1',
      });
      const session2 = await api.createSession(testGMId, {
        ...testSession,
        title: 'セッション2',
      });

      const data1 = await session1.json();
      const data2 = await session2.json();

      expect(data1.id).not.toBe(data2.id);
    });
  });

  describe('GET /api/game-masters/{uid}/sessions', () => {
    beforeEach(async () => {
      // テストデータを準備
      await api.createSession(testGMId, testSession);
      await api.createSession(testGMId, {
        scenarioId: testScenarioId,
        title: 'テストセッション2',
      });
      await api.createSession('other-gm-id', {
        scenarioId: '4d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999',
        title: 'テストセッション3',
      });
    });

    it('指定GMのセッション一覧を正しく取得できる', async () => {
      const res = await api.getGmSessions(testGMId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // toContainEqualで値による検証に変更
      expect(data).toContainEqual(
        expect.objectContaining({
          title: 'テストセッション1',
          scenarioId: testScenarioId,
        }),
      );
      expect(data).toContainEqual(
        expect.objectContaining({
          title: 'テストセッション2',
          scenarioId: testScenarioId,
        }),
      );
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await api.getGmSessions(testGMId);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      const session = data[0];
      expect(session).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        status: expect.any(String),
        scenarioId: expect.any(String),
        scenarioTitle: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('セッションが存在しないGMでは空配列を返す', async () => {
      const nonExistentGMId = 'non-existent-gm-id';
      const res = await api.getGmSessions(nonExistentGMId);

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.length).toBe(0);
    });
  });
});
