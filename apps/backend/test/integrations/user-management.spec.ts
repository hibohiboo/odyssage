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

  /** ユーザーをPUTで登録・更新する共通関数 */
  const putUser = async (uid: string, userData: { name: string }) =>
    app.request(
      `/api/users/${uid}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
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

  it('レスポンスヘッダーが適切に設定される', async () => {
    const res = await getUser(testUserId);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
  });

  describe('PUT /api/users/{uid}', () => {
    it('新規ユーザーを正しく登録できる', async () => {
      const newUserId = 'new-user-id-12345';
      const newUserData = { name: '新規ユーザー太郎' };

      const res = await putUser(newUserId, newUserData);

      expect(res.status).toBe(204);
      expect(await res.text()).toBe(''); // No Content

      // 登録されたユーザーが取得できることを確認
      const getRes = await getUser(newUserId);
      expect(getRes.status).toBe(200);
      const userData = await getRes.json();
      expect(userData).toEqual({ id: newUserId, name: newUserData.name });
    });

    it('既存ユーザー情報を正しく更新できる', async () => {
      const updatedUserData = { name: '更新されたユーザー太郎' };

      const res = await putUser(testUserId, updatedUserData);

      expect(res.status).toBe(204);
      expect(await res.text()).toBe(''); // No Content

      // 更新されたユーザー情報が取得できることを確認
      const getRes = await getUser(testUserId);
      expect(getRes.status).toBe(200);
      const userData = await getRes.json();
      expect(userData).toEqual({ id: testUserId, name: updatedUserData.name });
    });

    it('nameフィールドが空文字列でバリデーションエラー', async () => {
      const invalidUserData = { name: '' };

      const res = await putUser(testUserId, invalidUserData);

      expect(res.status).toBe(400);
    });

    it('nameフィールドが未定義でバリデーションエラー', async () => {
      const res = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}), // name フィールドなし
        },
        getEnv(),
      );

      expect(res.status).toBe(400);
    });

    it('不正なJSONでバリデーションエラー', async () => {
      const res = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json string',
        },
        getEnv(),
      );

      expect(res.status).toBe(400);
    });
  });
});
