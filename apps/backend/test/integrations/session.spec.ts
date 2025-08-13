import { generateUUID } from '@odyssage/lib/index';
import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * セッション関連のエンドポイントに対する統合テスト
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * データベース操作を含む統合テストを実行します
 */
describe('セッション統合テスト', () => {
  // TestFixtures の統一定数を使用
  const testUserId = TestFixtures.TEST_USERS.GM_USER.id;
  const testScenarioId = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id;
  const testScenarioTitle = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.title;
  let fixtures: TestFixtures;
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });
  const api = new IntegrationTestApi(getApp(), getEnv());

  beforeEach(async () => {});

  // 注意: セッション作成機能は POST /api/game-masters/{uid}/sessions に移行済み
  // セッション作成のテストは game-master-session.spec.ts で実施

  describe('GET /api/sessions/:id', () => {
    it.each([['準備中'], ['進行中']])(
      'セッションIDでセッション詳細を取得できること',
      async (status) => {
        // TestFixturesを使用してテストセッションを作成
        const testSessionId = generateUUID();
        await fixtures.createSession(
          testSessionId,
          testUserId,
          testScenarioId,
          'テスト用セッション',
          status,
        );

        // APIクライアントでセッション詳細を取得
        const getResponse = await api.getSessionById(testSessionId);

        expect(getResponse.status).toBe(200);

        // 値による直接検証に変更
        const retrievedSession = await getResponse.json();
        expect(retrievedSession).toEqual({
          id: testSessionId,
          title: 'テスト用セッション',
          status,
          scenarioId: testScenarioId,
          scenarioTitle: testScenarioTitle,
          gmId: testUserId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      },
    );
  });
});
