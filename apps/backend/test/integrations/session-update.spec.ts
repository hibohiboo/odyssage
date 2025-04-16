import { execSql } from '@odyssage/database/test-utils/execSql';
import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * セッション状態更新APIに対する統合テスト
 */
describe('セッション状態更新 統合テスト', () => {
  // テストデータ
  const testUserId = 'test-gm-id';
  const testUserName = 'テストGM';
  const testScenarioId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039909';
  const testScenarioTitle = 'テストシナリオ';
  const testSessionId = '4d8b1bc2-e2cc-5e1f-97e8-0d6e6e150010';
  const testSessionTitle = 'テストセッション';

  // テスト環境のセットアップ
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      await execSql(
        connectionString,
        `
         INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');
         INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) 
            VALUES ('${testScenarioId}', '${testScenarioTitle}', '${testUserId}', CURRENT_TIMESTAMP);
         INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, updated_at)
            VALUES ('${testSessionId}', '${testUserId}', '${testScenarioId}', '${testSessionTitle}', '準備中', CURRENT_TIMESTAMP);
        `,
      );
    },
  });

  const headerWithAuth = {
    'Content-Type': 'application/json',
    Authorization: `Bearer test`,
  };

  // テストケース1: 正常系 - GMが自身のセッションのステータスを更新できる
  it('GMが自身のセッションのステータスを更新できる', async () => {
    const app = getApp();
    const env = getEnv();

    // リクエストボディ
    const updateData = {
      status: '進行中',
    };

    // PATCH リクエストでセッションステータスを更新
    const patchResponse = await app.request(
      `/api/gm/${testUserId}/sessions/${testSessionId}`,
      {
        method: 'PATCH',
        headers: headerWithAuth,
        body: JSON.stringify(updateData),
      },
      env,
    );

    // レスポンスの検証
    expect(patchResponse.status).toBe(200);
    const responseBody = await patchResponse.json();
    expect(responseBody).toHaveProperty('id', testSessionId);
    expect(responseBody).toHaveProperty('status', '進行中');
  });

  // テストケース2: 異常系 - 他のGMのセッションは更新できない
  it('他のGMのセッションは更新できない', async () => {
    const app = getApp();
    const env = getEnv();

    const otherUserId = 'other-user-id';

    // リクエストボディ
    const updateData = {
      status: '終了',
    };

    // PATCH リクエストでセッションステータスを更新
    const patchResponse = await app.request(
      `/api/gm/${otherUserId}/sessions/${testSessionId}`,
      {
        method: 'PATCH',
        headers: headerWithAuth,
        body: JSON.stringify(updateData),
      },
      env,
    );

    // レスポンスの検証 - 認可エラー(403)が返ること
    expect(patchResponse.status).toBe(403);
  });

  // テストケース3: 異常系 - 不正なステータス値は更新できない
  it('不正なステータス値は更新できない', async () => {
    const app = getApp();
    const env = getEnv();

    // リクエストボディ
    const updateData = {
      status: '不正な値',
    };

    // PATCH リクエストでセッションステータスを更新
    const patchResponse = await app.request(
      `/api/gm/${testUserId}/sessions/${testSessionId}`,
      {
        method: 'PATCH',
        headers: headerWithAuth,
        body: JSON.stringify(updateData),
      },
      env,
    );

    // レスポンスの検証 - バリデーションエラー(400)が返ること
    expect(patchResponse.status).toBe(400);
  });
});
