import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * セッション関連のエンドポイントに対する統合テスト
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * データベース操作を含む統合テストを実行します
 */
describe('セッション統合テスト', () => {
  let env: Record<string, string>;

  // テストユーザーとシナリオの情報
  const testUserId = 'test-user-id';
  const testUserName = 'テストユーザー';
  const testScenarioId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039909';
  const testScenarioTitle = 'テストシナリオ';
  // テスト環境のセットアップ
  const { getApp } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      await execSql(
        connectionString,
        `
         INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');
         INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) VALUES ('${testScenarioId}', '${testScenarioTitle}', '${testUserId}', CURRENT_TIMESTAMP)
        `,
      );
      env = {
        CLOUDFLARE_ENV: 'test',
        NEON_CONNECTION_STRING: connectionString,
      };
    },
  });

  // テストケース：セッションを作成して取得できることを確認
  it('セッションを作成して正しく取得できること', async () => {
    const app = getApp();
    // リクエストボディ
    const sessionData = {
      gm_id: testUserId,
      scenario_id: testScenarioId,
      title: 'テストセッション',
    };

    // POST リクエストでセッションを作成
    const postResponse = await app.request(
      '/api/sessions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      },
      env,
    );
    expect(postResponse.status).toBe(201);

    const createdSession = (await postResponse.json()) as any;
    expect(createdSession).toHaveProperty('id');
    expect(createdSession.title).toBe(sessionData.title);
    expect(createdSession.gm_id).toBe(sessionData.gm_id);
    expect(createdSession.scenario_id).toBe(sessionData.scenario_id);

    // 作成したセッションをGET リクエストで取得
    const getResponse = await app.request(
      `/api/sessions/${createdSession.id}`,
      undefined,
      env,
    );

    expect(getResponse.status).toBe(200);

    const retrievedSession = (await getResponse.json()) as any;
    expect(retrievedSession.id).toBe(createdSession.id);
    expect(retrievedSession.title).toBe(sessionData.title);
    expect(retrievedSession.scenario_title).toBe(testScenarioTitle);
  });
});
