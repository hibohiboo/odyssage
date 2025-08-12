import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * Author Scenario Management API統合テスト
 * POST /api/authors/{uid}/scenarios, GET /api/authors/{uid}/scenarios エンドポイントのテスト
 */
describe('Author Scenario Management API 統合テスト', () => {
  const testAuthorId = 'test-author-id-12345';
  const testAuthorName = 'テストシナリオ作家';
  const testScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'テストシナリオ1',
    overview: 'これはAuthor作成テストシナリオの概要です。',
    visibility: 'public',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストAuthor（ユーザー）を準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES ('${testAuthorId}', '${testAuthorName}');`,
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
      `/api/authors/${uid}/scenarios`,
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

  /** シナリオをPUTで更新する共通関数 */
  const updateScenario = async (uid: string, scenarioId: string, scenarioData: any) =>
    app.request(
      `/api/authors/${uid}/scenarios/${scenarioId}`,
      {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token' // 認証必須
        },
        body: JSON.stringify(scenarioData),
      },
      getEnv(),
    );

  /** Authorシナリオ一覧をGETで取得する共通関数 */
  const getAuthorScenarios = async (uid: string) =>
    app.request(
      `/api/authors/${uid}/scenarios`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('POST /api/authors/{uid}/scenarios', () => {
    it('新規シナリオを正しく作成できる', async () => {
      const res = await createScenario(testAuthorId, testScenario);

      expect(res.status).toBe(201);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({ message: 'Scenario created successfully' });

      // 作成されたシナリオが取得できることを確認
      const listRes = await getAuthorScenarios(testAuthorId);
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

      const res = await createScenario(testAuthorId, scenarioWithoutVisibility);
      expect(res.status).toBe(201);

      // 作成されたシナリオの visibility を確認
      const listRes = await getAuthorScenarios(testAuthorId);
      const scenarios = await listRes.json<any[]>();
      expect(scenarios[0].visibility).toBe('private'); // デフォルト値確認
    });

    it('必須フィールドが不足している場合400エラー', async () => {
      const invalidScenario = {
        id: testScenario.id,
        // title と overview を省略
      };

      const res = await createScenario(testAuthorId, invalidScenario);
      expect(res.status).toBe(400);
    });

    it('不正なvisibility値で400エラー', async () => {
      const invalidScenario = {
        ...testScenario,
        visibility: 'invalid-visibility',
      };

      const res = await createScenario(testAuthorId, invalidScenario);
      expect(res.status).toBe(400);
    });

    it('認証なしでもテスト環境ではバイパスされ201成功', async () => {
      const res = await app.request(
        `/api/authors/${testAuthorId}/scenarios`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Authorization ヘッダーなし（テスト環境ではバイパス）
          body: JSON.stringify({
            id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039905',
            title: 'テストシナリオ認証なし',
            overview: '認証バイパステスト用シナリオ',
          }),
        },
        getEnv(),
      );

      expect(res.status).toBe(201); // テスト環境では認証バイパス
    });
  });

  describe('PUT /api/authors/{uid}/scenarios/{id}', () => {
    beforeEach(async () => {
      // テスト用シナリオを事前作成
      await createScenario(testAuthorId, testScenario);
    });

    it('既存シナリオを正しく更新できる', async () => {
      const updateData = {
        title: 'テストシナリオ1（更新版）',
        overview: 'これは更新されたシナリオの概要です。',
        visibility: 'private',
      };

      const res = await updateScenario(testAuthorId, testScenario.id, updateData);
      expect(res.status).toBe(204); // No Content

      // 更新内容が反映されているか確認
      const listRes = await getAuthorScenarios(testAuthorId);
      const scenarios = await listRes.json<any[]>();
      const updatedScenario = scenarios.find(s => s.id === testScenario.id);
      
      expect(updatedScenario.title).toBe(updateData.title);
      expect(updatedScenario.overview).toBe(updateData.overview);
      expect(updatedScenario.visibility).toBe(updateData.visibility);
    });

    it('必須フィールドが不足している場合400エラー', async () => {
      const invalidUpdateData = {
        // title と overview を省略
        visibility: 'public',
      };

      const res = await updateScenario(testAuthorId, testScenario.id, invalidUpdateData);
      expect(res.status).toBe(400);
    });

    it('存在しないシナリオIDで404エラー', async () => {
      const nonExistentId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999';
      const updateData = {
        title: 'テストシナリオ更新',
        overview: 'テスト用更新概要',
      };

      const res = await updateScenario(testAuthorId, nonExistentId, updateData);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/authors/{uid}/scenarios', () => {
    beforeEach(async () => {
      // テストデータを準備
      await createScenario(testAuthorId, testScenario);
      await createScenario(testAuthorId, {
        id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
        title: 'テストシナリオ2',
        overview: 'これは2番目のテストシナリオです。',
        visibility: 'private',
      });
    });

    it('指定Authorのシナリオ一覧を正しく取得できる', async () => {
      const res = await getAuthorScenarios(testAuthorId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // Authorのシナリオが含まれていることを確認
      const scenarioIds = data.map(scenario => scenario.id);
      expect(scenarioIds).toContain(testScenario.id);
      expect(scenarioIds).toContain('3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902');
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getAuthorScenarios(testAuthorId);
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

    it('シナリオが存在しないAuthorでは空配列を返す', async () => {
      const nonExistentAuthorId = 'non-existent-author-id';
      const res = await getAuthorScenarios(nonExistentAuthorId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await app.request(
        `/api/authors/${testAuthorId}/scenarios`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Authorizationヘッダーなし
        },
        getEnv(),
      );

      expect(res.status).toBe(200);
    });

    it('シナリオ順序が更新日時順（降順）である', async () => {
      const res = await getAuthorScenarios(testAuthorId);
      const data = await res.json<any[]>();

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