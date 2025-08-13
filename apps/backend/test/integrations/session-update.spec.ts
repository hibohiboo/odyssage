import { generateUUID } from '@odyssage/lib/index';
import { describe, expect, it, beforeEach } from 'vitest';
import { IntegrationTestApi, TestFixtures } from './helpers';
import { setupTestEnv } from './test-utils';

/**
 * セッション状態更新APIに対する統合テスト
 * PATCH /api/game-masters/{uid}/sessions/{id} エンドポイントのテスト
 */
describe('セッション状態更新 統合テスト', () => {
  // TestFixtures の統一定数を使用
  const testUserId = TestFixtures.TEST_USERS.GM_USER.id;
  const testScenarioId = TestFixtures.TEST_SCENARIOS.PUBLIC_SCENARIO.id;
  let fixtures: TestFixtures;
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let api: IntegrationTestApi;
  let testSessionId: string;

  beforeEach(async () => {
    api = new IntegrationTestApi(getApp(), getEnv());

    // 各テスト用にユニークなセッションIDを生成
    testSessionId = generateUUID();
    await fixtures.createSession(
      testSessionId,
      testUserId,
      testScenarioId,
      'テストセッション',
      '準備中',
    );
  });

  // テストケース1: 正常系 - GMが自身のセッションのステータスを更新できる
  it.each([['進行中'], ['終了']])(
    'GMが自身のセッションのステータスを更新できる',
    async (status) => {
      // APIクライアントを使用してセッションステータスを更新
      const patchResponse = await api.updateSessionStatus(
        testUserId,
        testSessionId,
        status,
      );

      // レスポンスの検証 - 値による直接検証に変更
      expect(patchResponse.status).toBe(200);
      const responseBody = await patchResponse.json();
      expect(responseBody).toEqual({
        id: testSessionId,
        status,
        gm_id: testUserId,
        scenario_id: testScenarioId,
        scenario_title: expect.any(String),
        title: 'テストセッション',
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
    },
  );

  // 異常系
  it.each([
    ['他のGMのセッションは更新できない', 'other-user-id', '終了', 403],
    ['不正なステータス値は更新できない', 'other-user-id', '不正な値', 400],
  ])('%s', async (_, userId, status, expectStatus) => {
    // APIクライアントを使用して他のユーザーのセッション更新を試行
    const patchResponse = await api.updateSessionStatus(
      userId,
      testSessionId,
      status,
    );

    // レスポンスの検証 - 認可エラー(403)が返ること
    expect(patchResponse.status).toBe(expectStatus);
  });
});
