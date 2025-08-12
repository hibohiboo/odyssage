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

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // 統一フィクスチャーを使用
      const fixtures = new TestFixtures(connectionString);
      await fixtures.setupBasicTestData();
    },
  });

  let app: ReturnType<typeof getApp>;
  let api: IntegrationTestApi;
  let fixtures: TestFixtures;
  let testSessionId: string;

  beforeEach(async () => {
    app = getApp();
    api = new IntegrationTestApi(app, getEnv());
    fixtures = new TestFixtures(getConnectionString());
    
    // 各テスト用にユニークなセッションIDを生成
    testSessionId = generateUUID();
    await fixtures.createSession(
      testSessionId,
      testUserId,
      testScenarioId,
      'テストセッション',
      '準備中'
    );
  });

  // テストケース1: 正常系 - GMが自身のセッションのステータスを更新できる
  it('GMが自身のセッションのステータスを更新できる', async () => {
    // APIクライアントを使用してセッションステータスを更新
    const patchResponse = await api.updateSessionStatus(testUserId, testSessionId, '進行中');

    // レスポンスの検証 - 値による直接検証に変更
    expect(patchResponse.status).toBe(200);
    const responseBody = await patchResponse.json();
    expect(responseBody).toEqual({
      id: testSessionId,
      status: '進行中',
      gm_id: testUserId,
      scenario_id: testScenarioId,
      scenario_title: expect.any(String),
      title: 'テストセッション',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  // テストケース2: 異常系 - 他のGMのセッションは更新できない
  it('他のGMのセッションは更新できない', async () => {
    const otherUserId = 'other-user-id';

    // APIクライアントを使用して他のユーザーのセッション更新を試行
    const patchResponse = await api.updateSessionStatus(otherUserId, testSessionId, '終了');

    // レスポンスの検証 - 認可エラー(403)が返ること
    expect(patchResponse.status).toBe(403);
  });

  // テストケース3: 異常系 - 不正なステータス値は更新できない
  it('不正なステータス値は更新できない', async () => {
    // APIクライアントを使用して不正なステータスでの更新を試行
    const patchResponse = await api.updateSessionStatus(testUserId, testSessionId, '不正な値');

    // レスポンスの検証 - バリデーションエラー(400)が返ること
    expect(patchResponse.status).toBe(400);
  });

  // テストケース4: セッション終了ステータスの正常系テスト
  it('セッションを終了ステータスに変更できる', async () => {
    // APIクライアントを使用してセッションを終了状態に更新
    const patchResponse = await api.updateSessionStatus(testUserId, testSessionId, '終了');

    // レスポンスの検証 - 終了ステータスが正しく設定されること
    expect(patchResponse.status).toBe(200);
    const responseBody = await patchResponse.json();
    expect(responseBody).toEqual({
      id: testSessionId,
      status: '終了',
      gm_id: testUserId,
      scenario_id: testScenarioId,
      scenario_title: expect.any(String),
      title: 'テストセッション',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
});
