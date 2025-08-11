import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * Scenario Public API統合テスト
 * GET /api/scenarios エンドポイントのテスト
 */
describe('Scenario Public API 統合テスト', () => {
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const testScenario1 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'テストシナリオ1',
    visibility: 'public',
  };
  const testScenario2 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
    title: 'テストシナリオ2',
    visibility: 'private',
  };
  const testScenario3 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039903',
    title: 'テストシナリオ3',
    visibility: 'public',
  };

  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストユーザーとシナリオデータを準備
      await execSql(
        connectionString,
        `
          INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');
          INSERT INTO odyssage.scenarios (id, title, user_id, visibility, updated_at) VALUES 
            ('${testScenario1.id}', '${testScenario1.title}', '${testUserId}', '${testScenario1.visibility}', CURRENT_TIMESTAMP),
            ('${testScenario2.id}', '${testScenario2.title}', '${testUserId}', '${testScenario2.visibility}', CURRENT_TIMESTAMP),
            ('${testScenario3.id}', '${testScenario3.title}', '${testUserId}', '${testScenario3.visibility}', CURRENT_TIMESTAMP);
        `,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(() => {
    app = getApp();
  });

  /** シナリオ一覧をGETで取得する共通関数 */
  const getScenarios = async () =>
    app.request(
      '/api/scenarios',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  it('全シナリオ一覧を正しく取得できる', async () => {
    const res = await getScenarios();

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');

    const data = await res.json<any[]>();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(3);

    // テストデータが含まれていることを確認
    const scenarioIds = data.map((scenario: any) => scenario.id);
    expect(scenarioIds).toContain(testScenario1.id);
    expect(scenarioIds).toContain(testScenario2.id); // privateも含まれる
    expect(scenarioIds).toContain(testScenario3.id);
  });

  it('レスポンススキーマが適切な形式である', async () => {
    const res = await getScenarios();
    expect(res.status).toBe(200);

    const data = await res.json<any[]>();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const scenario = data[0];

      // 必須フィールドの存在確認
      expect(scenario).toHaveProperty('id');
      expect(scenario).toHaveProperty('title');
      expect(scenario).toHaveProperty('updatedAt');

      // フィールド型の確認
      expect(typeof scenario.id).toBe('string');
      expect(typeof scenario.title).toBe('string');
      expect(typeof scenario.updatedAt).toBe('string');
    }
  });

  it('空のデータベースでも正常に動作する', async () => {
    // 全シナリオを削除
    await execSql(
      getEnv().NEON_CONNECTION_STRING,
      'DELETE FROM odyssage.scenarios',
    );

    const res = await getScenarios();

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');

    const data = await res.json<any[]>();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('認証不要で正常にアクセスできる', async () => {
    // Authorizationヘッダーなしでリクエスト
    const res = await app.request(
      '/api/scenarios',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Authorizationヘッダーを意図的に省略
      },
      getEnv(),
    );

    expect(res.status).toBe(200);
  });
});
