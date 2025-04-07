import { execSql } from '@odyssage/database/test-utils/execSql';
import { setupDb } from '@odyssage/database/test-utils/setupDb';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Hono } from 'hono';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { sessionRoute } from '../src/route/session';
import { generateUUID } from '../src/utils/generateUUID';
/**
 * セッション関連のエンドポイントに対する統合テスト
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * データベース操作を含む統合テストを実行します
 */
describe('セッション統合テスト', () => {
  let postgresContainer: StartedPostgreSqlContainer;

  let connectionString: string;
  let app: Hono;

  // テストユーザーとシナリオの情報
  const testUserId = 'test-user-id';
  const testUserName = 'テストユーザー';
  const testScenarioId = generateUUID();
  const testScenarioTitle = 'テストシナリオ';

  // テスト開始前にPostgreSQLコンテナを起動
  beforeAll(async () => {
    // PostgreSQLコンテナを起動
    postgresContainer = await new PostgreSqlContainer('postgres:17.4-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    connectionString = postgresContainer.getConnectionUri();
    await setupDb(connectionString);
    await execSql(
      connectionString,
      `
       INSERT INTO odyssage.users (id, name) VALUES ('${testUserId}', '${testUserName}');
       INSERT INTO odyssage.scenarios (id, title, user_id, updated_at) VALUES ('${testScenarioId}', '${testScenarioTitle}', '${testUserId}', CURRENT_TIMESTAMP)
      `,
    );

    // アプリを初期化
    app = new Hono();
    app.route('/api/sessions', sessionRoute);
  }, 60000); // コンテナ起動に時間がかかるためタイムアウトを延長

  // テスト終了後にコンテナを停止
  afterAll(async () => {
    await postgresContainer.stop();
  });

  // テストケース：セッションを作成して取得できることを確認
  it('セッションを作成して正しく取得できること', async () => {
    // リクエストボディ
    const sessionData = {
      gm_id: testUserId,
      scenario_id: testScenarioId,
      title: 'テストセッション',
    };
    const env = {
      CLOUDFLARE_ENV: 'test',
      NEON_CONNECTION_STRING: connectionString,
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
