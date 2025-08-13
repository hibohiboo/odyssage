import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * Session List API統合テスト
 * GET /api/sessions エンドポイントのテスト
 */
describe('Session List API 統合テスト', () => {
  const testGmId1 = 'gm-user-id-01';
  const testGmName1 = 'テストGM1';
  const testGmId2 = 'gm-user-id-02';
  const testGmName2 = 'テストGM2';

  const testPublicScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: '公開テストシナリオ',
    overview: 'これは公開シナリオです。',
    visibility: 'public',
  };

  const testPrivateScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
    title: '非公開テストシナリオ',
    overview: 'これは非公開シナリオです。',
    visibility: 'private',
  };

  const testPublicSession = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039801',
    title: '公開セッション',
    status: '準備中',
  };

  const testPrivateSession = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039802',
    title: '非公開セッション',
    status: '進行中',
  };

  const testGm2Session = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039803',
    title: 'GM2のセッション',
    status: '準備中',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストユーザー・GMたちを準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES 
          ('${testGmId1}', '${testGmName1}'),
          ('${testGmId2}', '${testGmName2}');`,
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
        ('${testPublicScenario.id}', '${testPublicScenario.title}', '${testPublicScenario.overview}', '${testGmId1}', '${testPublicScenario.visibility}', CURRENT_TIMESTAMP),
        ('${testPrivateScenario.id}', '${testPrivateScenario.title}', '${testPrivateScenario.overview}', '${testGmId1}', '${testPrivateScenario.visibility}', CURRENT_TIMESTAMP);`,
    );

    // テストセッションを準備
    await execSql(
      getConnectionString(),
      `INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, created_at, updated_at) VALUES 
        ('${testPublicSession.id}', '${testGmId1}', '${testPublicScenario.id}', '${testPublicSession.title}', '${testPublicSession.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('${testPrivateSession.id}', '${testGmId1}', '${testPrivateScenario.id}', '${testPrivateSession.title}', '${testPrivateSession.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('${testGm2Session.id}', '${testGmId2}', '${testPublicScenario.id}', '${testGm2Session.title}', '${testGm2Session.status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
    );
  });

  /** セッション一覧をGETで取得する共通関数 */
  const getSessions = async (gmId?: string) =>
    app.request(
      `/api/sessions${gmId ? `?gm_id=${gmId}` : ''}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('GET /api/sessions', () => {
    it('公開セッションのみを取得できる', async () => {
      const res = await getSessions();

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2); // 公開シナリオベースのセッションのみ

      // 公開セッションが含まれていることを確認
      const sessionIds = data.map((session) => session.id);
      expect(sessionIds).toContain(testPublicSession.id);
      expect(sessionIds).toContain(testGm2Session.id);

      // 非公開セッションが含まれていないことを確認
      expect(sessionIds).not.toContain(testPrivateSession.id);
    });

    it('特定GMのセッションのみ取得できる', async () => {
      const res = await getSessions(testGmId1);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2); // GM1の全セッション（公開・非公開含む）

      // GM1のセッションが含まれていることを確認
      const sessionIds = data.map((session) => session.id);
      expect(sessionIds).toContain(testPublicSession.id);
      expect(sessionIds).toContain(testPrivateSession.id);

      // GM2のセッションが含まれていないことを確認
      expect(sessionIds).not.toContain(testGm2Session.id);

      // 全セッションのGMIDが正しいことを確認
      data.forEach((session) => {
        expect(session.gmId).toBe(testGmId1);
      });
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getSessions();
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const session = data[0];

        // SessionList スキーマの必須フィールドの存在確認
        expect(session).toHaveProperty('id');
        expect(session).toHaveProperty('name');
        expect(session).toHaveProperty('gm');
        expect(session).toHaveProperty('gmId');
        expect(session).toHaveProperty('players');
        expect(session).toHaveProperty('maxPlayers');
        expect(session).toHaveProperty('status');
        expect(session).toHaveProperty('createdAt');

        // フィールド型の確認
        expect(typeof session.id).toBe('string');
        expect(typeof session.name).toBe('string');
        expect(typeof session.gm).toBe('string');
        expect(typeof session.gmId).toBe('string');
        expect(typeof session.players).toBe('number');
        expect(typeof session.maxPlayers).toBe('number');
        expect(typeof session.status).toBe('string');
        expect(typeof session.createdAt).toBe('string');

        // 日付形式の確認
        expect(new Date(session.createdAt)).toBeInstanceOf(Date);

        // 固定値の確認（実装仕様による）
        expect(session.players).toBe(0);
        expect(session.maxPlayers).toBe(5);
      }
    });

    it('存在しないGMIDでは空配列を返す', async () => {
      const nonExistentGmId = 'non-existent-gm-id';
      const res = await getSessions(nonExistentGmId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('セッション順序が作成日時順（降順）である', async () => {
      const res = await getSessions();
      const data = await res.json<any[]>();

      expect(data.length).toBeGreaterThanOrEqual(2);

      // 作成日時順（降順）の確認
      for (let i = 1; i < data.length; i++) {
        const prevCreatedAt = new Date(data[i - 1].createdAt);
        const currCreatedAt = new Date(data[i].createdAt);
        expect(prevCreatedAt.getTime()).toBeGreaterThanOrEqual(
          currCreatedAt.getTime(),
        );
      }
    });

    it('GMフィルタリング機能が正しく動作する', async () => {
      // GM1のセッション確認
      const res1 = await getSessions(testGmId1);
      const data1 = await res1.json<any[]>();
      expect(data1.length).toBe(2); // 公開・非公開含む
      expect(
        data1.every((s) =>
          [testPublicSession.id, testPrivateSession.id].includes(s.id),
        ),
      ).toBe(true);

      // GM2のセッション確認
      const res2 = await getSessions(testGmId2);
      const data2 = await res2.json<any[]>();
      expect(data2.length).toBe(1);
      expect(data2[0].id).toBe(testGm2Session.id);
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await app.request(
        '/api/sessions',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Authorizationヘッダーなし
        },
        getEnv(),
      );

      expect(res.status).toBe(200);
    });

    it('セッション詳細情報が適切に含まれる', async () => {
      const res = await getSessions();
      const data = await res.json<any[]>();

      if (data.length > 0) {
        const session = data.find((s) => s.id === testPublicSession.id);
        expect(session).toBeDefined();
        expect(session.name).toBe(testPublicSession.title);
        expect(session.gmId).toBe(testGmId1);
        expect(session.gm).toBe(testGmName1);
        expect(session.status).toBe(testPublicSession.status);
      }
    });
  });
});
