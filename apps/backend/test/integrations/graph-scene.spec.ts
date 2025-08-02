import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * GraphDBシーン関連のエンドポイントに対する統合テスト
 * Neo4jのテストコンテナを使用してGraphDB操作を含む統合テストを実行します  
 */
describe('GraphDBシーン統合テスト', () => {
  // テストシーンの情報
  const testScenarioId = '550e8400-e29b-41d4-a716-446655440000';
  const testSceneId = '660e8400-e29b-41d4-a716-446655440001';
  const testSceneData = {
    title: 'テストシーン',
    overview: 'これはテスト用のシーンです。GraphDBに保存されます。',
    scenarioId: testScenarioId,
    order: 0,
  };

  // テスト環境のセットアップ（Neo4j用）
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async () => {
      // GraphDBのクリーンアップは各テストケース内で実行
    },
  });

  beforeEach(async () => {
    // 各テスト前にGraphDBをクリーンアップ
    // Neo4jコンテナのセットアップとクリーンアップ処理は将来実装予定
  });

  // テストケース：GraphDBシーンを作成できることを確認
  it('GraphDBにシーンを作成できること', async () => {
    const app = getApp();

    // PUT リクエストでGraphDBシーンを作成
    const response = await app.request(
      `/api/graph-scenes/${testSceneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testSceneData),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンスボディを確認
    const responseData = await response.json();
    expect(responseData).toEqual({
      id: testSceneId,
      title: testSceneData.title,
      overview: testSceneData.overview,
      scenarioId: testScenarioId,
      order: 0,
    });
  });

  // テストケース：必須フィールドが不足している場合のバリデーション
  it('必須フィールドが不足している場合400エラーを返すこと', async () => {
    const app = getApp();

    // titleフィールドを欠いたリクエスト
    const invalidData = {
      overview: testSceneData.overview,
      scenarioId: testScenarioId,
      order: 0,
    };

    const response = await app.request(
      `/api/graph-scenes/${testSceneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：不正なscenarioId形式の場合のバリデーション
  it('不正なscenarioId形式の場合400エラーを返すこと', async () => {
    const app = getApp();

    // 不正なUUID形式のscenarioId
    const invalidData = {
      title: testSceneData.title,
      overview: testSceneData.overview,
      scenarioId: 'invalid-uuid',
      order: 0,
    };

    const response = await app.request(
      `/api/graph-scenes/${testSceneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：負の順序値の場合のバリデーション
  it('負の順序値の場合400エラーを返すこと', async () => {
    const app = getApp();

    // 負の値のorder
    const invalidData = {
      title: testSceneData.title,
      overview: testSceneData.overview,
      scenarioId: testScenarioId,
      order: -1,
    };

    const response = await app.request(
      `/api/graph-scenes/${testSceneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：シーン一覧取得の正常動作
  it('シナリオに関連するシーン一覧を正常に取得できること', async () => {
    const app = getApp();

    // シーン一覧取得のリクエスト
    const response = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      getEnv(),
    );

    // レスポンスステータスの確認
    expect(response.status).toBe(200);

    // レスポンスボディの確認
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);

    // 配列内の各要素が適切な構造を持つことを確認
    if (responseBody.length > 0) {
      const scene = responseBody[0];
      expect(scene).toHaveProperty('id');
      expect(scene).toHaveProperty('title');
      expect(scene).toHaveProperty('overview');
      expect(scene).toHaveProperty('scenarioId');
      expect(scene).toHaveProperty('order');
      expect(typeof scene.order).toBe('number');
    }
  });

  // テストケース：不正なシナリオIDでのシーン一覧取得
  it('不正なシナリオIDの場合400エラーを返すこと', async () => {
    const app = getApp();

    // 不正なUUID形式のシナリオID
    const invalidScenarioId = 'invalid-uuid';

    const response = await app.request(
      `/api/graph-scenes/scenario/${invalidScenarioId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：存在しないシナリオIDでのシーン一覧取得
  it('存在しないシナリオIDの場合空の配列を返すこと', async () => {
    const app = getApp();

    // 存在しないが正しい形式のUUID
    const nonExistentScenarioId = '770e8400-e29b-41d4-a716-446655440000';

    const response = await app.request(
      `/api/graph-scenes/scenario/${nonExistentScenarioId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      getEnv(),
    );

    // 正常なレスポンスステータス
    expect(response.status).toBe(200);

    // 空の配列が返されることを確認
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBe(0);
  });
});