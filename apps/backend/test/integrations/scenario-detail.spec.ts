import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * Scenario Detail API統合テスト
 * GET /api/scenarios/{id} エンドポイントのテスト
 */
describe('Scenario Detail API 統合テスト', () => {
  // TestFixtures の統一定数を使用
  const testScenario = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO;
  const invalidFormatId = 'invalid-uuid-format';

  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      const fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let app: ReturnType<typeof getApp>;
  let api: IntegrationTestApi;

  beforeEach(async () => {
    app = getApp();
    api = new IntegrationTestApi(app, getEnv());
  });

  // 共通関数は IntegrationTestApi に移行済み


  describe('GET /api/scenarios/{id}', () => {
    it('存在するシナリオを正しく取得できる', async () => {
      const res = await api.getScenarioDetail(testScenario.id);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({
        id: testScenario.id,
        title: testScenario.title,
        overview: testScenario.overview,
        visibility: testScenario.visibility,
        updatedAt: expect.any(String), // タイムスタンプは動的なので型のみチェック
      });

      // updatedAtが有効な日付形式であることを確認
      expect(new Date(data.updatedAt)).toBeInstanceOf(Date);
    });


    it('不正なUUID形式で400エラー', async () => {
      const res = await api.getScenarioDetail(invalidFormatId);

      expect(res.status).toBe(400);
    });


    it('認証不要で正常にアクセスできる', async () => {
      const res = await api.getScenarioDetail(testScenario.id);
      expect(res.status).toBe(200);
    });
  });

});
