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
});