import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';
import { IntegrationTestApi, TestFixtures } from './helpers';

/**
 * User Management API統合テスト
 * GET /api/users/{uid} エンドポイントのテスト
 */
describe('User Management API 統合テスト', () => {
  // TestFixtures の統一定数を使用
  const testUserId = TestFixtures.TEST_USERS.GM_USER.id;
  const testUserName = TestFixtures.TEST_USERS.GM_USER.name;
  const nonExistentUserId = 'non-existent-user-id';

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      const fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let app: ReturnType<typeof getApp>;
  let api: IntegrationTestApi;
  let fixtures: TestFixtures;

  beforeEach(() => {
    app = getApp();
    api = new IntegrationTestApi(app, getEnv());
    fixtures = new TestFixtures(getConnectionString());
  });

  // 共通関数は IntegrationTestApi に移行済み

  it('存在するユーザーを正しく取得できる', async () => {
    const res = await api.getUser(testUserId);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');

    const data = await res.json();
    expect(data).toEqual({ id: testUserId, name: testUserName });
  });

  it('存在しないユーザーで404エラー', async () => {
    const res = await api.getUser(nonExistentUserId);

    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('text/plain');
    expect(await res.text()).toBe('Not Found');
  });

  it('空のuidで404エラー', async () => {
    const res = await api.getUser('');
    expect(res.status).toBe(404);
  });

  it('レスポンスヘッダーが適切に設定される', async () => {
    const res = await api.getUser(testUserId);

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
  });

  describe('PUT /api/users/{uid}', () => {
    it('新規ユーザーを正しく登録できる', async () => {
      const newUserId = 'new-user-id-12345';
      const newUserData = { name: '新規ユーザー太郎' };

      const res = await api.putUser(newUserId, newUserData);

      expect(res.status).toBe(204);
      expect(await res.text()).toBe(''); // No Content

      // 登録されたユーザーが取得できることを確認
      const getRes = await api.getUser(newUserId);
      expect(getRes.status).toBe(200);
      const userData = await getRes.json();
      expect(userData).toEqual({ id: newUserId, name: newUserData.name });
    });

    it('既存ユーザー情報を正しく更新できる', async () => {
      const updatedUserData = { name: '更新されたユーザー太郎' };

      const res = await api.putUser(testUserId, updatedUserData);

      expect(res.status).toBe(204);
      expect(await res.text()).toBe(''); // No Content

      // 更新されたユーザー情報が取得できることを確認
      const getRes = await api.getUser(testUserId);
      expect(getRes.status).toBe(200);
      const userData = await getRes.json();
      expect(userData).toEqual({ id: testUserId, name: updatedUserData.name });
    });

    it('nameフィールドが空文字列でバリデーションエラー', async () => {
      const invalidUserData = { name: '' };

      const res = await api.putUser(testUserId, invalidUserData);

      expect(res.status).toBe(400);
    });

    it('nameフィールドが未定義でバリデーションエラー', async () => {
      const res = await api.putUserRaw(testUserId, {}); // name フィールドなし

      expect(res.status).toBe(400);
    });

    it('不正なJSONでバリデーションエラー', async () => {
      const res = await api.putUserWithInvalidJson(testUserId, 'invalid json string');

      expect(res.status).toBe(400);
    });
  });
});
