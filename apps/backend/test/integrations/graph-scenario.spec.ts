import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * GraphDBシナリオ関連のエンドポイントに対する統合テスト
 * Neo4jのテストコンテナを使用してGraphDB操作を含む統合テストを実行します  
 */
describe('GraphDBシナリオ統合テスト', () => {
  // テストシナリオの情報
  const testScenarioId = '550e8400-e29b-41d4-a716-446655440000';
  const testScenarioData = {
    title: 'テストシナリオ',
    overview: 'これはテスト用のシナリオです。GraphDBに保存されます。',
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

  // テストケース：GraphDBシナリオを作成できることを確認
  it('GraphDBにシナリオを作成できること', async () => {
    const app = getApp();

    // PUT リクエストでGraphDBシナリオを作成
    const response = await app.request(
      `/api/graph-scenarios/${testScenarioId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testScenarioData),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンスボディを確認
    const responseData = await response.json();
    expect(responseData).toEqual({
      id: testScenarioId,
      title: testScenarioData.title,
      overview: testScenarioData.overview,
    });
  });

  // テストケース：GraphDBシナリオを更新できることを確認
  it('GraphDBシナリオを更新できること', async () => {
    const app = getApp();

    // 最初にシナリオを作成
    await app.request(
      `/api/graph-scenarios/${testScenarioId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testScenarioData),
      },
      getEnv(),
    );

    // 更新データ
    const updatedData = {
      title: '更新されたテストシナリオ',
      overview: 'これは更新されたシナリオの概要です。',
    };

    // PUT リクエストでシナリオを更新
    const response = await app.request(
      `/api/graph-scenarios/${testScenarioId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンスボディを確認
    const responseData = await response.json();
    expect(responseData).toEqual({
      id: testScenarioId,
      title: updatedData.title,
      overview: updatedData.overview,
    });
  });

  // テストケース：バリデーションエラーを正しく処理することを確認
  it('不正なリクエストデータでバリデーションエラーが返ることを確認', async () => {
    const app = getApp();

    // 不正なデータ（titleが空文字）
    const invalidData = {
      title: '',
      overview: 'テスト概要',
    };

    // PUT リクエストで不正なデータを送信
    const response = await app.request(
      `/api/graph-scenarios/${testScenarioId}`,
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

  // テストケース：長すぎるデータでバリデーションエラーが返ることを確認
  it('長すぎるタイトルでバリデーションエラーが返ることを確認', async () => {
    const app = getApp();

    // 長すぎるタイトル（101文字）
    const invalidData = {
      title: 'a'.repeat(101),
      overview: 'テスト概要',
    };

    // PUT リクエストで不正なデータを送信
    const response = await app.request(
      `/api/graph-scenarios/${testScenarioId}`,
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