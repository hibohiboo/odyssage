import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * Game Master Session Management API統合テスト
 * POST /api/game-masters/{uid}/sessions, GET /api/game-masters/{uid}/sessions エンドポイントのテスト
 */
describe('Game Master Session Management API 統合テスト', () => {
  const testGMId = 'test-gm-id-12345';
  const testGMName = 'テストゲームマスター';
  const testScenarioId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901';
  const testScenarioTitle = 'テストシナリオ';
  const testSession = {
    scenarioId: testScenarioId,
    title: 'テストセッション1',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストGM（ユーザー）とシナリオを準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES ('${testGMId}', '${testGMName}');`,
      );
      await execSql(
        connectionString,
        `INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) VALUES ('${testScenarioId}', '${testScenarioTitle}', '${testGMId}', CURRENT_TIMESTAMP);`,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(async () => {
    app = getApp();
    await execSql(getConnectionString(), 'delete from odyssage.sessions');
  });

  /** セッションをPOSTで作成する共通関数 */
  const createSession = async (uid: string, sessionData: any) =>
    app.request(
      `/api/game-masters/${uid}/sessions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token', // 認証必須
        },
        body: JSON.stringify(sessionData),
      },
      getEnv(),
    );

  /** GMセッション一覧をGETで取得する共通関数 */
  const getGMSessions = async (uid: string) =>
    app.request(
      `/api/game-masters/${uid}/sessions`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('POST /api/game-masters/{uid}/sessions', () => {
    it('新規セッションを正しく作成できる', async () => {
      const res = await createSession(testGMId, testSession);

      expect(res.status).toBe(201);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('gmId', testGMId);
      expect(data).toHaveProperty('scenarioId', testSession.scenarioId);
      expect(data).toHaveProperty('title', testSession.title);
      expect(data).toHaveProperty('status', '準備中');
      expect(data).toHaveProperty('createdAt');

      // 作成されたセッションが取得できることを確認
      const listRes = await getGMSessions(testGMId);
      expect(listRes.status).toBe(200);
      const sessions = await listRes.json<any[]>();
      expect(sessions.length).toBe(1);
      expect(sessions[0].id).toBe(data.id);
      expect(sessions[0].title).toBe(testSession.title);
    });

    it('必須フィールドが不足している場合400エラー', async () => {
      const invalidSession = {
        title: testSession.title,
        // scenarioIdを省略
      };

      const res = await createSession(testGMId, invalidSession);
      expect(res.status).toBe(400);
    });

    it('存在しないシナリオIDで400エラー', async () => {
      const invalidSession = {
        ...testSession,
        scenarioId: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999',
      };

      const res = await createSession(testGMId, invalidSession);
      expect(res.status).toBe(400);
      
      const errorData = await res.json();
      expect(errorData).toHaveProperty('message');
      expect(typeof errorData.message).toBe('string');
    });

    it('認証なしでもテスト環境ではバイパスされ201成功', async () => {
      const res = await app.request(
        `/api/game-masters/${testGMId}/sessions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Authorization ヘッダーなし（テスト環境ではバイパス）
          body: JSON.stringify({
            scenarioId: testScenarioId,
            title: 'テストセッション認証なし',
          }),
        },
        getEnv(),
      );

      expect(res.status).toBe(201); // テスト環境では認証バイパス
    });

    it('複数セッション作成時にユニークIDが生成される', async () => {
      const session1 = await createSession(testGMId, {
        ...testSession,
        title: 'セッション1',
      });
      const session2 = await createSession(testGMId, {
        ...testSession,
        title: 'セッション2',
      });

      expect(session1.status).toBe(201);
      expect(session2.status).toBe(201);

      const data1 = await session1.json<any>();
      const data2 = await session2.json<any>();

      expect(data1.id).not.toBe(data2.id);
      expect(data1.title).toBe('セッション1');
      expect(data2.title).toBe('セッション2');
    });
  });

  describe('GET /api/game-masters/{uid}/sessions', () => {
    beforeEach(async () => {
      // テストデータを準備
      await createSession(testGMId, testSession);
      await createSession(testGMId, {
        scenarioId: testScenarioId,
        title: 'テストセッション2',
      });
    });

    it('指定GMのセッション一覧を正しく取得できる', async () => {
      const res = await getGMSessions(testGMId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // GMのセッションが含まれていることを確認
      const sessionTitles = data.map((session) => session.title);
      expect(sessionTitles).toContain('テストセッション1');
      expect(sessionTitles).toContain('テストセッション2');
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getGMSessions(testGMId);
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const session = data[0];

        // 必須フィールドの存在確認（実際のレスポンス形式に合わせて修正）
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

        // status値の確認
        expect(['準備中', '進行中', '完了', '中断']).toContain(session.status);
      }
    });

    it('セッションが存在しないGMでは空配列を返す', async () => {
      const nonExistentGMId = 'non-existent-gm-id';
      const res = await getGMSessions(nonExistentGMId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await app.request(
        `/api/game-masters/${testGMId}/sessions`,
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
