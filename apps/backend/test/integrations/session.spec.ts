import { execSql } from '@odyssage/database/test-utils/execSql';

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
  const { getApp, getEnv } = setupTestEnv({
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
});
