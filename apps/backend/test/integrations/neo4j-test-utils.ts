// filepath: d:\projects\odyssage\apps\backend\test\integrations\neo4j-test-utils.ts
import { Neo4jContainer, StartedNeo4jContainer } from '@testcontainers/neo4j';
import { afterAll, beforeAll } from 'vitest';
import app from '../../src'; // 実際のHonoアプリケーションをインポート

/**
 * Neo4jテスト用のセットアップユーティリティ
 * Neo4j Testcontainerを起動し、テスト環境を準備します
 */
export interface SetupNeo4jTestEnvOptions {
  /**
   * テスト前の追加セットアップ処理
   */
  beforeSetup?: (neo4jConfig: Neo4jConfig) => Promise<void>;
}

export interface Neo4jConfig {
  url: string;
  user: string;
  password: string;
}

/**
 * Neo4jテスト環境のセットアップを行います
 * @param options セットアップオプション
 * @returns テスト用のアプリケーションインスタンスとNeo4j設定を取得する関数
 */
export const setupNeo4jTestEnv = (options?: SetupNeo4jTestEnvOptions) => {
  let neo4jContainer: StartedNeo4jContainer;
  let neo4jConfig: Neo4jConfig;

  // テスト開始前にNeo4jコンテナを起動
  beforeAll(async () => {
    // Neo4jコンテナを起動
    neo4jContainer = await new Neo4jContainer('neo4j:5.27-community')
      .withPassword('test-password')
      .withApoc()
      .start();

    // Neo4j接続設定を生成
    neo4jConfig = {
      url: neo4jContainer.getBoltUri(),
      user: 'neo4j',
      password: 'test-password',
    };

    // 追加のセットアップ処理があれば実行
    if (options?.beforeSetup) {
      await options.beforeSetup(neo4jConfig);
    }

    // Neo4j環境変数を設定（Honoアプリが接続できるように）
    process.env.NEO4J_URL = neo4jConfig.url;
    process.env.NEO4J_USER = neo4jConfig.user;
    process.env.NEO4J_PASSWORD = neo4jConfig.password;
  }, 60000); // 60秒のタイムアウトを設定（コンテナ起動に時間がかかるため）

  // テスト終了後にNeo4jコンテナを停止
  afterAll(async () => {
    if (neo4jContainer) {
      await neo4jContainer.stop();
    }
  });

  return {
    getNeo4jConfig: () => neo4jConfig,
    getApp: () => app,
    getEnv: () => ({
      CLOUDFLARE_ENV: 'test',
      NEO4J_URL: neo4jConfig.url,
      NEO4J_USER: neo4jConfig.user,
      NEO4J_PASSWORD: neo4jConfig.password,
    }),
  };
};
