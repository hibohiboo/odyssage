import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Hono } from 'hono';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { sessionRoute } from '../src/route/session';
import { generateUUID } from '../src/utils/generateUUID';

/**
 * セッション関連のエンドポイントに対する統合テスト
 * Testcontainersを使用して実際のPostgreSQLコンテナを起動し、
 * データベース操作を含む統合テストを実行します
 */
describe('セッション統合テスト', () => {
  let postgresContainer: PostgreSqlContainer;
  let connectionString: string;
  let pgClient: Client;
  let app: Hono;

  // テストユーザーとシナリオの情報
  const testUserId = 'test-user-id';
  const testUserName = 'テストユーザー';
  const testScenarioId = generateUUID();
  const testScenarioTitle = 'テストシナリオ';

  // テスト開始前にPostgreSQLコンテナを起動
  beforeAll(async () => {
    // PostgreSQLコンテナを起動
    postgresContainer = await new PostgreSqlContainer()
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    connectionString = postgresContainer.getConnectionUri();

    // PGクライアントを作成してテスト用のテーブルを初期化
    pgClient = new Client({
      connectionString,
    });

    await pgClient.connect();

    // スキーマとテーブルを作成
    await pgClient.query(`CREATE SCHEMA odyssage;`);

    await pgClient.query(`
      CREATE TABLE odyssage.users (
        id VARCHAR(64) PRIMARY KEY,
        name TEXT NOT NULL DEFAULT ''
      );
    `);

    await pgClient.query(`
      CREATE TABLE odyssage.scenarios (
        id UUID PRIMARY KEY,
        title TEXT NOT NULL,
        user_id VARCHAR(64) NOT NULL REFERENCES odyssage.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        overview TEXT NOT NULL DEFAULT '',
        visibility VARCHAR(10) NOT NULL DEFAULT 'private'
      );
    `);

    await pgClient.query(`
      CREATE TABLE odyssage.sessions (
        id UUID PRIMARY KEY,
        gm_id VARCHAR(64) NOT NULL REFERENCES odyssage.users(id) ON DELETE CASCADE,
        scenario_id UUID NOT NULL REFERENCES odyssage.scenarios(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT '準備中',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // テストデータを作成
    await pgClient.query(
      `
      INSERT INTO odyssage.users (id, name) VALUES ($1, $2)
    `,
      [testUserId, testUserName],
    );

    await pgClient.query(
      `
      INSERT INTO odyssage.scenarios (id, title, user_id) VALUES ($1, $2, $3)
    `,
      [testScenarioId, testScenarioTitle, testUserId],
    );

    // アプリを初期化
    app = new Hono();
    app.route('/api/sessions', sessionRoute);

    // 環境変数を設定
    // app.env('NEON_CONNECTION_STRING', connectionString);
  }, 60000); // コンテナ起動に時間がかかるためタイムアウトを延長

  // テスト終了後にコンテナを停止
  afterAll(async () => {
    await pgClient.end();
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
  });
});
