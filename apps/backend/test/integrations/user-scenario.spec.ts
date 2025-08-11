import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * User Scenario Management API統合テスト
 * POST /api/users/{uid}/scenario, GET /api/users/{uid}/scenario エンドポイントのテスト
 */
describe('User Scenario Management API 統合テスト', () => {
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const testScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'テストシナリオ1',
    overview: 'これはユーザー作成テストシナリオの概要です。',
    visibility: 'public',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストユーザーを準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');`,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(async () => {
    app = getApp();
    await execSql(getConnectionString(), 'delete from odyssage.scenarios');
  });

  /** シナリオをPOSTで作成する共通関数 */
  const createScenario = async (uid: string, scenarioData: any) =>
    app.request(
      `/api/users/${uid}/scenario`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token' // 認証必須
        },
        body: JSON.stringify(scenarioData),
      },
      getEnv(),
    );

  /** ユーザーシナリオ一覧をGETで取得する共通関数 */
  const getUserScenarios = async (uid: string) =>
    app.request(
      `/api/users/${uid}/scenario`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('POST /api/users/{uid}/scenario', () => {
    it('新規シナリオを正しく作成できる', async () => {
      const res = await createScenario(testUserId, testScenario);

      expect(res.status).toBe(201);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({ message: 'Scenario created successfully' });

      // 作成されたシナリオが取得できることを確認
      const listRes = await getUserScenarios(testUserId);
      expect(listRes.status).toBe(200);
      const scenarios = await listRes.json<any[]>();
      expect(scenarios.length).toBe(1);
      expect(scenarios[0].id).toBe(testScenario.id);
      expect(scenarios[0].title).toBe(testScenario.title);
    });

    it('visibilityが省略された場合はprivateがデフォルト', async () => {
      const scenarioWithoutVisibility = {
        id: testScenario.id,
        title: testScenario.title,
        overview: testScenario.overview,
        // visibilityを省略
      };

      const res = await createScenario(testUserId, scenarioWithoutVisibility);
      expect(res.status).toBe(201);

      // 作成されたシナリオの visibility を確認
      const listRes = await getUserScenarios(testUserId);
      const scenarios = await listRes.json<any[]>();
      expect(scenarios[0].visibility).toBe('private'); // デフォルト値確認
    });

    it('必須フィールドが不足している場合400エラー', async () => {
      const invalidScenario = {
        id: testScenario.id,
        // title と overview を省略
      };

      const res = await createScenario(testUserId, invalidScenario);
      expect(res.status).toBe(400);
    });

    it('不正なvisibility値で400エラー', async () => {
      const invalidScenario = {
        ...testScenario,
        visibility: 'invalid-visibility',
      };

      const res = await createScenario(testUserId, invalidScenario);
      expect(res.status).toBe(400);
    });

    it('認証なしで401エラー', async () => {
      const res = await app.request(
        `/api/users/${testUserId}/scenario`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Authorization ヘッダーなし
          body: JSON.stringify(testScenario),
        },
        getEnv(),
      );

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/{uid}/scenario', () => {
    beforeEach(async () => {
      // テストデータを準備
      await createScenario(testUserId, testScenario);
      await createScenario(testUserId, {
        id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
        title: 'テストシナリオ2',
        overview: 'これは2番目のテストシナリオです。',
        visibility: 'private',
      });
    });

    it('指定ユーザーのシナリオ一覧を正しく取得できる', async () => {
      const res = await getUserScenarios(testUserId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // ユーザーのシナリオが含まれていることを確認
      const scenarioIds = data.map(scenario => scenario.id);
      expect(scenarioIds).toContain(testScenario.id);
      expect(scenarioIds).toContain('3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902');
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getUserScenarios(testUserId);
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const scenario = data[0];

        // 必須フィールドの存在確認
        expect(scenario).toHaveProperty('id');
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('overview');
        expect(scenario).toHaveProperty('visibility');
        expect(scenario).toHaveProperty('updatedAt');

        // フィールド型の確認
        expect(typeof scenario.id).toBe('string');
        expect(typeof scenario.title).toBe('string');
        expect(typeof scenario.overview).toBe('string');
        expect(typeof scenario.visibility).toBe('string');
        expect(typeof scenario.updatedAt).toBe('string');

        // visibilityのenum値確認
        expect(['public', 'private']).toContain(scenario.visibility);
      }
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await app.request(
        `/api/users/${testUserId}/scenario`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Authorizationヘッダーなし
        },
        getEnv(),
      );

      expect(res.status).toBe(200);
    });
  });
});