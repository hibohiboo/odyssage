import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * User Management API統合テスト
 * GET /api/users/{uid} エンドポイントのテスト
 */
describe('User Management API 統合テスト', () => {
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const nonExistentUserId = 'non-existent-user-id';

  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');`,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(() => {
    app = getApp();
  });

  /** ユーザーをGETで取得する共通関数 */
  const getUser = async (uid: string) =>
    app.request(
      `/api/users/${uid}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      getEnv(),
    );

  it('存在するユーザーを正しく取得できる', async () => {
    const res = await getUser(testUserId);
    
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    
    const data = await res.json();
    expect(data).toEqual({ id: testUserId, name: testUserName });
  });

  it('存在しないユーザーで404エラー', async () => {
    const res = await getUser(nonExistentUserId);
    
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('text/plain');
    expect(await res.text()).toBe('Not Found');
  });

  it('空のuidで404エラー', async () => {
    const res = await getUser('');
    expect(res.status).toBe(404);
  });

  it('APIとDBデータが一致する', async () => {
    const apiRes = await getUser(testUserId);
    expect(apiRes.status).toBe(200);
    const apiData = await apiRes.json();

    const dbResult = await execSql(
      getEnv().NEON_CONNECTION_STRING,
      `SELECT id, name FROM odyssage.users WHERE id = '${testUserId}'`,
    );

    expect(dbResult).toHaveLength(1);
    expect(apiData).toEqual({ id: dbResult[0].id, name: dbResult[0].name });
  });

  it('レスポンスヘッダーが適切に設定される', async () => {
    const res = await getUser(testUserId);
    
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});