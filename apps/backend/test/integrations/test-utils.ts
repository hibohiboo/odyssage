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
    process.env.DATABASE_URL = connectionString;
    process.env.NEON_CONNECTION_STRING = connectionString;
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
  };
};
