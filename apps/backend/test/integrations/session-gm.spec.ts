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

  let fixtures: TestFixtures;
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  const api = new IntegrationTestApi(getApp(), getEnv());

  beforeEach(async () => {
    // セッションのみクリーンアップ（ユーザー・シナリオは保持）
    await fixtures.cleanupSessions();

    // カスタムセッションデータを作成（複数ステータス・複数GMでのテスト用）
    await fixtures.createSession(
      '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
      testGmId,
      testScenarioId,
      'テストセッション1',
      '準備中',
      '2025-08-13T15:00:00',
    );
    await fixtures.createSession(
      '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
      testGmId,
      testScenarioId,
      'テストセッション2',
      '進行中',
      '2025-08-13T16:00:00',
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
      expect(data.length).toBe(2);

      // 値ベース検証に変更
      // セッション順序が更新日時順（降順）
      expect(data).toEqual([
        {
          createdAt: '2025-08-13T16:00:00.000Z',
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
          scenarioId: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
          scenarioTitle: 'パブリックテストシナリオ',
          status: '進行中',
          title: 'テストセッション2',
          updatedAt: '2025-08-13T16:00:00.000Z',
        },
        {
          createdAt: '2025-08-13T15:00:00.000Z',
          id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
          scenarioId: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
          scenarioTitle: 'パブリックテストシナリオ',
          status: '準備中',
          title: 'テストセッション1',
          updatedAt: '2025-08-13T15:00:00.000Z',
        },
      ]);

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
  });
});
