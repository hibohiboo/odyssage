import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * User Management API統合テスト
 * GET /api/users/{uid} エンドポイントのテスト
 *
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * ユーザー管理API の統合テストを実行します
 */
describe('User Management API 統合テスト', () => {
  // テストユーザーの情報
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const nonExistentUserId = 'non-existent-user-id';

  // テスト環境のセットアップ
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テスト用ユーザーデータを準備
      await execSql(
        connectionString,
        `
         INSERT INTO odyssage.users (id, name) 
         VALUES ('${testUserId}', '${testUserName}');
        `,
      );
    },
  });

  describe('GET /api/users/{uid}', () => {
    it('[正常系] 存在するユーザーを正しく取得できること', async () => {
      const app = getApp();

      // GETリクエストでユーザーを取得
      const response = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // レスポンス検証
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain(
        'application/json',
      );

      const responseData = await response.json();

      // レスポンスデータ構造の検証
      expect(responseData).toHaveProperty('id');
      expect(responseData).toHaveProperty('name');

      // レスポンスデータ内容の検証
      expect(responseData.id).toBe(testUserId);
      expect(responseData.name).toBe(testUserName);

      // 不要なフィールドが含まれていないことを確認
      expect(Object.keys(responseData)).toEqual(['id', 'name']);
    });

    it('[異常系] 存在しないユーザーの場合404エラーが返されること', async () => {
      const app = getApp();

      // 存在しないユーザーIDでGETリクエスト
      const response = await app.request(
        `/api/users/${nonExistentUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // 404ステータスの確認
      expect(response.status).toBe(404);
      expect(response.headers.get('content-type')).toContain('text/plain');

      const responseText = await response.text();
      expect(responseText).toBe('Not Found');
    });

    it('[バリデーション] 不正なuid形式の場合400エラーが返されること', async () => {
      const app = getApp();
      const invalidUid = ''; // 空文字列

      // 不正なuidでGETリクエスト
      const response = await app.request(
        `/api/users/${invalidUid}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // 400エラーの確認（Valibot バリデーションエラー）
      expect(response.status).toBe(400);
    });

    it('[データ整合性] データベースから直接取得したデータと一致すること', async () => {
      const app = getApp();

      // APIからユーザー取得
      const apiResponse = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      expect(apiResponse.status).toBe(200);
      const apiData = await apiResponse.json();

      // データベースから直接データ取得して比較
      const connectionString = getEnv().NEON_CONNECTION_STRING;
      const dbResult = await execSql(
        connectionString,
        `SELECT id, name FROM odyssage.users WHERE id = '${testUserId}'`,
      );

      expect(dbResult).toHaveLength(1);
      expect(apiData.id).toBe(dbResult[0].id);
      expect(apiData.name).toBe(dbResult[0].name);
    });

    it('[セキュリティ] レスポンスヘッダーが適切に設定されていること', async () => {
      const app = getApp();

      const response = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      expect(response.status).toBe(200);

      // Content-Typeヘッダーの確認
      expect(response.headers.get('content-type')).toContain(
        'application/json',
      );

      // CORS関連ヘッダーの確認（必要に応じて）
      // expect(response.headers.get('access-control-allow-origin')).toBeDefined();
    });

    it('[パフォーマンス] レスポンス時間が適切であること', async () => {
      const app = getApp();

      const startTime = Date.now();

      const response = await app.request(
        `/api/users/${testUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(response.status).toBe(200);

      // 1秒以内に応答することを確認（統合テスト環境での許容範囲）
      expect(responseTime).toBeLessThan(1000);
    });
  });
});
