// filepath: d:\projects\odyssage\apps\backend\test\integrations\test-utils.ts
import { execSql } from '@odyssage/database/test-utils/execSql';
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
      .withDatabase('test')
      .withUsername('test')
      .withPassword('test')
      .withExposedPorts(5432)
      .start();

    // 接続文字列を生成
    connectionString = `postgresql://test:test@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(
      5432,
    )}/test`;

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

/**
 * テスト用にサンプルデータを挿入します
 * @param connectionString データベース接続文字列
 * @param userId テスト用ユーザーID
 * @param userName テスト用ユーザー名
 * @param scenarioId テスト用シナリオID
 * @param scenarioTitle テスト用シナリオタイトル
 */
export const insertSampleData = async (
  connectionString: string,
  userId: string,
  userName: string,
  scenarioId: string,
  scenarioTitle: string,
) => {
  // ユーザー情報を挿入
  await execSql(
    connectionString,
    `INSERT INTO users (uid, display_name, created_at) VALUES ($1, $2, NOW())`,
    [userId, userName],
  );

  // シナリオ情報を挿入
  await execSql(
    connectionString,
    `INSERT INTO scenarios (id, title, author_id, status, created_at, updated_at) 
     VALUES ($1, $2, $3, 'published', NOW(), NOW())`,
    [scenarioId, scenarioTitle, userId],
  );
};
