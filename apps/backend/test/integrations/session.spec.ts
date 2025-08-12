import { execSql } from '@odyssage/database/test-utils/execSql';
import { generateUUID } from '@odyssage/lib/index';

import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * セッション関連のエンドポイントに対する統合テスト
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * データベース操作を含む統合テストを実行します
 */
describe('セッション統合テスト', () => {
  // テストユーザーとシナリオの情報
  const testUserId = 'test-user-id';
  const testUserName = 'テストユーザー';
  const testScenarioId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039909';
  const testScenarioTitle = 'テストシナリオ';
  // テスト環境のセットアップ
  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      await execSql(
        connectionString,
        `
         INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');
         INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) VALUES ('${testScenarioId}', '${testScenarioTitle}', '${testUserId}', CURRENT_TIMESTAMP)
        `,
      );
    },
  });

  // 注意: セッション作成機能は POST /api/game-masters/{uid}/sessions に移行済み
  // セッション作成のテストは game-master-session.spec.ts で実施

  // GET /api/sessions/:id のテスト（まだ有効なAPI）
  it('セッションIDでセッション詳細を取得できること', async () => {
    const app = getApp();
    const env = getEnv();

    // 直接データベースにテストセッションを挿入
    const testSessionId = generateUUID();

    await execSql(
      getConnectionString(),
      `INSERT INTO odyssage.sessions (id, gm_id, scenario_id, title, status, created_at, updated_at) 
       VALUES ('${testSessionId}', '${testUserId}', '${testScenarioId}', 'テスト用セッション', '準備中', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    );

    // GET リクエストでセッションを取得
    const getResponse = await app.request(
      `/api/sessions/${testSessionId}`,
      undefined,
      env,
    );

    expect(getResponse.status).toBe(200);

    const retrievedSession = (await getResponse.json()) as any;
    expect(retrievedSession.id).toBe(testSessionId);
    expect(retrievedSession.title).toBe('テスト用セッション');
    expect(retrievedSession.scenarioTitle).toBe(testScenarioTitle);
  });
});
