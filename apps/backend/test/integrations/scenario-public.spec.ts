import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * Scenario Public API統合テスト
 * GET /api/scenarios エンドポイントのテスト
 */
describe('Scenario Public API 統合テスト', () => {
  let fixtures: TestFixtures;

  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  const api = new IntegrationTestApi(getApp(), getEnv());

  beforeEach(async () => {
    // 各テストでTestFixturesのデータを再作成
    await fixtures.setupBasicTestData();
  });
  describe('/api/scenarios', () => {
    it('全シナリオ一覧を正しく取得できる', async () => {
      // APIクライアントを使用してシナリオ一覧を取得
      const res = await api.getAllScenarios();

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(3);

      // テストデータが含まれていることを確認（基本TestFixturesのシナリオ）
      const scenarioIds = data.map((scenario: any) => scenario.id);
      expect(scenarioIds).toContain(
        TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id,
      );
      expect(scenarioIds).toContain(
        TestFixtures.TEST_SCENARIOS.PRIVATE_SCENARIO.id,
      ); // private
      expect(scenarioIds).toContain(
        TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO_2.id,
      ); // public
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await api.getAllScenarios();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);

      const [scenario] = data;

      // 値による直接検証に変更（実際のレスポンス形式に合わせる）
      expect(scenario).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('空のデータベースでも正常に動作する', async () => {
      // TestFixturesでシナリオテーブルをクリーンアップ
      await fixtures.cleanupAllTables();

      const res = await api.getAllScenarios();

      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });

  describe('GET /api/scenarios/public', () => {
    it('公開シナリオのみを正しく取得できる', async () => {
      const res = await api.getPublicScenarios();

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();

      // 公開シナリオが含まれていることを確認
      const scenarioIds = data.map((scenario: any) => scenario.id);
      expect(scenarioIds).toContain(
        TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id,
      );
      expect(scenarioIds).toContain(
        TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO_2.id,
      );

      // プライベートシナリオが含まれていないことを確認
      expect(scenarioIds).not.toContain(
        TestFixtures.TEST_SCENARIOS.PRIVATE_SCENARIO.id,
      );
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await api.getPublicScenarios();
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);

      const scenario = data[0];

      // 値による直接検証に変更（getPublicScenariosのレスポンス構造）
      expect(scenario).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        overview: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
