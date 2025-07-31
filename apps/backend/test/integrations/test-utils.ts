// filepath: d:\projects\odyssage\apps\backend\test\integrations\test-utils.ts
import { setupDb } from '@odyssage/database/test-utils/setupDb';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { afterAll, beforeAll } from 'vitest';
import app from '../../src'; // 実際のHonoアプリケーションをインポート

/**
 * インテグレーションテスト用のセットアップユーティリティ
 * データベースコンテナを起動し、テスト環境を準備します
 */
export interface SetupTestEnvOptions {
  /**
   * テスト前の追加セットアップ処理
   */
  beforeSetup?: (connectionString: string) => Promise<void>;
}

/**
 * テスト環境のセットアップを行います
 * @param options セットアップオプション
 * @returns テスト用のアプリケーションインスタンスと接続文字列を取得する関数
 */
export const setupTestEnv = (options?: SetupTestEnvOptions) => {
  let postgresContainer: StartedPostgreSqlContainer;
  let connectionString: string;
  
  // テスト用Neo4j接続設定
  const NEO4J_TEST_CONFIG = {
    url: 'bolt://localhost:7687',
    user: 'neo4j',
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    password: 'password',
  } as const;

  // テスト開始前にPostgreSQLコンテナを起動
  beforeAll(async () => {
    // PostgreSQLコンテナを起動
    postgresContainer = await new PostgreSqlContainer('postgres:17.4-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    // 接続文字列を生成
    connectionString = postgresContainer.getConnectionUri();

    // データベースをセットアップ（マイグレーション実行）
    await setupDb(connectionString);

    // 追加のセットアップ処理があれば実行
    if (options?.beforeSetup) {
      await options.beforeSetup(connectionString);
    }

    // 環境変数を設定（Honoアプリがデータベース接続できるように）
    process.env.NEON_CONNECTION_STRING = connectionString;
    
    // Neo4j環境変数を設定（テスト用）
    process.env.NEO4J_URL = NEO4J_TEST_CONFIG.url;
    process.env.NEO4J_USER = NEO4J_TEST_CONFIG.user;
    process.env.NEO4J_PASSWORD = NEO4J_TEST_CONFIG.password;
  }, 60000); // 60秒のタイムアウトを設定（コンテナ起動に時間がかかるため）

  // テスト終了後にPostgreSQLコンテナを停止
  afterAll(async () => {
    if (postgresContainer) {
      await postgresContainer.stop();
    }
  });

  return {
    getConnectionString: () => connectionString,
    getApp: () => app,
    getEnv: () => ({
      CLOUDFLARE_ENV: 'test',
      NEON_CONNECTION_STRING: connectionString,
      NEO4J_URL: NEO4J_TEST_CONFIG.url,
      NEO4J_USER: NEO4J_TEST_CONFIG.user,
      NEO4J_PASSWORD: NEO4J_TEST_CONFIG.password,
    }),
  };
};
