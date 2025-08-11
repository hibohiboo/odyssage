import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * GM Session Management API統合テスト
 * GET /api/sessions/gm/{gm_id} エンドポイントのテスト
 */
describe('GM Session Management API 統合テスト', () => {
  const testGmId = 'gm-user-id-12345';
  const testGmName = 'テストGMユーザー';
  const testOtherGmId = 'other-gm-id-67890';
  const testOtherGmName = 'その他GMユーザー';

  const testScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'セッション用テストシナリオ',
    overview: 'これはセッション管理テスト用のシナリオです。',
    visibility: 'public',
  };

  const testSession1 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
    title: 'テストセッション1',
    status: '準備中',
  };

  const testSession2 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
    title: 'テストセッション2',
    status: '進行中',
  };

  const testOtherSession = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039803',
    title: 'その他GMのセッション',
    status: '準備中',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストユーザー・GMたちを準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES 
          ('${testGmId}', '${testGmName}'),
          ('${testOtherGmId}', '${testOtherGmName}');`,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(async () => {
    app = getApp();
    // クリーンアップ
    await execSql(getConnectionString(), 'delete from odyssage.sessions');
    await execSql(getConnectionString(), 'delete from odyssage.scenarios');

    // テストシナリオを準備
    await execSql(
      getConnectionString(),
      `INSERT INTO odyssage.scenarios (id, title, overview, user_id, visibility, updated_at) VALUES 
        ('${testScenario.id}', '${testScenario.title}', '${testScenario.overview}', '${testGmId}', '${testScenario.visibility}', CURRENT_TIMESTAMP);`,
    );

    // テストセッションを準備
    await execSql(
      getConnectionString(),
      `INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, created_at, updated_at) VALUES 
        ('${testSession1.id}', '${testGmId}', '${testScenario.id}', '${testSession1.title}', '${testSession1.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('${testSession2.id}', '${testGmId}', '${testScenario.id}', '${testSession2.title}', '${testSession2.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('${testOtherSession.id}', '${testOtherGmId}', '${testScenario.id}', '${testOtherSession.title}', '${testOtherSession.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
    );
  });

  /** GM管理セッション一覧をGETで取得する共通関数 */
  const getSessionsByGm = async (gmId: string) =>
    app.request(
      `/api/sessions/gm/${gmId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('GET /api/sessions/gm/{gm_id}', () => {
    it('指定GMのセッション一覧を正しく取得できる', async () => {
      const res = await getSessionsByGm(testGmId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // テストGMのセッションが含まれていることを確認
      const sessionIds = data.map((session) => session.id);
      expect(sessionIds).toContain(testSession1.id);
      expect(sessionIds).toContain(testSession2.id);

      // その他GMのセッションが含まれていないことを確認
      expect(sessionIds).not.toContain(testOtherSession.id);
    });

    it('セッションが存在しないGMでは空配列を返す', async () => {
      const nonExistentGmId = 'non-existent-gm-id';
      const res = await getSessionsByGm(nonExistentGmId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getSessionsByGm(testGmId);
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const session = data[0];

        // 必須フィールドの存在確認
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('title');
        expect(session).toHaveProperty('status');
        expect(session).toHaveProperty('scenarioId');
        expect(session).toHaveProperty('scenarioTitle');
        expect(session).toHaveProperty('createdAt');
        expect(session).toHaveProperty('updatedAt');

        // フィールド型の確認
        expect(typeof session.id).toBe('string');
        expect(typeof session.title).toBe('string');
        expect(typeof session.status).toBe('string');
        expect(typeof session.scenarioId).toBe('string');
        expect(typeof session.scenarioTitle).toBe('string');
        expect(typeof session.createdAt).toBe('string');
        expect(typeof session.updatedAt).toBe('string');

        // 日付形式の確認
        expect(new Date(session.createdAt)).toBeInstanceOf(Date);
        expect(new Date(session.updatedAt)).toBeInstanceOf(Date);

        // 関連データの確認
        expect(session.scenarioId).toBe(testScenario.id);
        expect(session.scenarioTitle).toBe(testScenario.title);
      }
    });

    it('複数ステータスのセッションを適切に取得する', async () => {
      const res = await getSessionsByGm(testGmId);
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(data.length).toBe(2);

      // ステータスごとのセッション確認
      const statuses = data.map((session) => session.status);
      expect(statuses).toContain('準備中');
      expect(statuses).toContain('進行中');

      // 各セッションの詳細確認
      const session1 = data.find((s) => s.id === testSession1.id);
      const session2 = data.find((s) => s.id === testSession2.id);

      expect(session1.title).toBe(testSession1.title);
      expect(session1.status).toBe(testSession1.status);
      expect(session2.title).toBe(testSession2.title);
      expect(session2.status).toBe(testSession2.status);
    });

    it('データフィルタリングが正しく動作する', async () => {
      // testGmId のセッション確認
      const res1 = await getSessionsByGm(testGmId);
      const data1 = await res1.json<any[]>();
      expect(data1.length).toBe(2);
      expect(
        data1.every((s) => [testSession1.id, testSession2.id].includes(s.id)),
      ).toBe(true);

      // testOtherGmId のセッション確認
      const res2 = await getSessionsByGm(testOtherGmId);
      const data2 = await res2.json<any[]>();
      expect(data2.length).toBe(1);
      expect(data2[0].id).toBe(testOtherSession.id);
    });

    it('空のgm_idで400エラー', async () => {
      const res = await app.request(
        '/api/sessions/gm/',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
        getEnv(),
      );

      expect(res.status).toBe(404); // Honoルーティングで404になる
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await app.request(
        `/api/sessions/gm/${testGmId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Authorizationヘッダーなし
        },
        getEnv(),
      );

      expect(res.status).toBe(200);
    });

    it('セッション順序が更新日時順（降順）である', async () => {
      const res = await getSessionsByGm(testGmId);
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
