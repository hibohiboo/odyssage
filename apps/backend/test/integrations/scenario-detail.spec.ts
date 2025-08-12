import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * Scenario Detail API統合テスト
 * GET /api/scenarios/{id} エンドポイントのテスト（新API）
 * GET /api/scenario/{id} エンドポイントのテスト（旧API・非推奨）
 */
describe('Scenario Detail API 統合テスト', () => {
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const testScenario = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'テストシナリオ1',
    overview: 'これはテストシナリオ1の詳細概要です。',
    visibility: 'public',
  };
  const nonExistentScenarioId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999';
  const invalidFormatId = 'invalid-uuid-format';

  const insertSQL = `
          INSERT INTO odyssage.scenarios (id, title, overview, user_id, visibility, updated_at) VALUES 
            ('${testScenario.id}', '${testScenario.title}', '${testScenario.overview}', '${testUserId}', '${testScenario.visibility}', CURRENT_TIMESTAMP);
        `;

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
    await execSql(getConnectionString(), insertSQL);
  });

  /** シナリオ詳細をGETで取得する共通関数（新API） */
  const getScenarioNew = async (id: string) =>
    app.request(
      `/api/scenarios/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  /** シナリオ詳細をGETで取得する共通関数（旧API・非推奨） */
  const getScenarioLegacy = async (id: string) =>
    app.request(
      `/api/scenario/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  describe('新API: GET /api/scenarios/{id}', () => {
    it('存在するシナリオを正しく取得できる', async () => {
      const res = await getScenarioNew(testScenario.id);

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

    it('存在しないシナリオで404エラー', async () => {
      const res = await getScenarioNew(nonExistentScenarioId);

      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('text/plain');
      expect(await res.text()).toBe('Not Found');
    });

    it('不正なUUID形式で400エラー', async () => {
      const res = await getScenarioNew(invalidFormatId);

      expect(res.status).toBe(400);
    });

    it('レスポンススキーマが適切な形式である', async () => {
      const res = await getScenarioNew(testScenario.id);
      expect(res.status).toBe(200);

      const data = await res.json();

      // 必須フィールドの存在確認
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('overview');
      expect(data).toHaveProperty('visibility');
      expect(data).toHaveProperty('updatedAt');

      // フィールド型の確認
      expect(typeof data.id).toBe('string');
      expect(typeof data.title).toBe('string');
      expect(typeof data.overview).toBe('string');
      expect(typeof data.visibility).toBe('string');
      expect(typeof data.updatedAt).toBe('string');

      // visibilityのenum値確認
      expect(['public', 'private']).toContain(data.visibility);
    });

    it('認証不要で正常にアクセスできる', async () => {
      const res = await getScenarioNew(testScenario.id);
      expect(res.status).toBe(200);
    });
  });

  describe('旧API: GET /api/scenario/{id} (非推奨)', () => {
    it('存在するシナリオを正しく取得できる（後方互換性）', async () => {
      const res = await getScenarioLegacy(testScenario.id);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({
        id: testScenario.id,
        title: testScenario.title,
        overview: testScenario.overview,
        visibility: testScenario.visibility,
        updatedAt: expect.any(String),
      });
    });

    it('Deprecated警告ヘッダーが付与されること', async () => {
      const res = await getScenarioLegacy(testScenario.id);

      expect(res.headers.get('X-Deprecated-Endpoint')).toBe('true');
      expect(res.headers.get('X-New-Endpoint')).toBe('GET /api/scenarios/{id}');
      expect(res.headers.get('X-Deprecated-Until')).toBe('2025-11-01');
    });
  });

  describe('API移行互換性テスト', () => {
    it('新旧エンドポイントが完全に同一結果を返すこと', async () => {
      const oldResponse = await getScenarioLegacy(testScenario.id);
      const newResponse = await getScenarioNew(testScenario.id);

      // ステータス・レスポンス本体の完全一致確認
      expect(oldResponse.status).toBe(newResponse.status);
      expect(await oldResponse.json()).toEqual(await newResponse.json());
    });

    it('404エラーも新旧で同一であること', async () => {
      const oldResponse = await getScenarioLegacy(nonExistentScenarioId);
      const newResponse = await getScenarioNew(nonExistentScenarioId);

      expect(oldResponse.status).toBe(newResponse.status);
      expect(await oldResponse.text()).toBe(await newResponse.text());
    });
  });
});
