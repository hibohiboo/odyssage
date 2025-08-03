import { describe, expect, it } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * GraphDBシーン一括更新エンドポイントに対する統合テスト
 * Neo4jのテストコンテナを使用してバッチ更新機能を含む統合テストを実行します
 */
describe('GraphDBシーン一括更新統合テスト', () => {
  // テストシナリオの情報
  const testScenarioId = '550e8400-e29b-41d4-a716-446655440000';
  const testScenesData = [
    {
      title: 'オープニング',
      overview: '冒険の始まり',
      order: 0,
    },
    {
      title: '戦闘シーン',
      overview: 'モンスターとの戦い',
      order: 1,
    },
    {
      title: 'エンディング',
      overview: '冒険の終わり',
      order: 2,
    },
  ];

  // テスト環境のセットアップ（Neo4j用）
  const { getApp, getEnv } = setupTestEnv({
    beforeSetup: async () => {
      // GraphDBのクリーンアップは各テストケース内で実行
    },
  });

  // beforeEachでのクリーンアップは他のテストに影響するため削除
  // 各テスト内で必要に応じてクリーンアップを実行

  // テストケース：GraphDBシーン一括更新が正常に動作することを確認
  it('GraphDBシーンを一括更新できること', async () => {
    const app = getApp();

    // PUT リクエストでGraphDBシーンを一括更新
    const response = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: testScenesData }),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンスボディを確認
    const responseData = await response.json();
    expect(responseData).toHaveProperty('scenes');
    expect(responseData).toHaveProperty('summary');

    // シーン配列の確認
    expect(Array.isArray(responseData.scenes)).toBe(true);
    expect(responseData.scenes).toHaveLength(3);

    // 各シーンの構造確認
    responseData.scenes.forEach((scene: any, index: number) => {
      expect(scene).toHaveProperty('id');
      expect(scene).toHaveProperty('title');
      expect(scene).toHaveProperty('overview');
      expect(scene).toHaveProperty('order');
      expect(scene).toHaveProperty('scenarioId');
      expect(scene).toHaveProperty('createdAt');
      expect(scene).toHaveProperty('updatedAt');

      // データ内容の確認
      expect(scene.title).toBe(testScenesData[index].title);
      expect(scene.overview).toBe(testScenesData[index].overview);
      expect(scene.order).toBe(testScenesData[index].order);
      expect(scene.scenarioId).toBe(testScenarioId);
      expect(typeof scene.id).toBe('string');
    });

    // サマリー情報の確認
    expect(responseData.summary.totalScenes).toBe(3);
    expect(responseData.summary.message).toContain('3個のシーンが正常に一括更新されました');
  });

  // テストケース：空配列での一括更新
  it('空のシーン配列で一括更新した場合、既存シーンが全削除されること', async () => {
    const app = getApp();

    // 先に複数シーンを作成
    await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: testScenesData }),
      },
      getEnv(),
    );

    // 空配列で一括更新
    const response = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: [] }),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンス内容の確認
    const responseData = await response.json();
    expect(responseData.scenes).toHaveLength(0);
    expect(responseData.summary.totalScenes).toBe(0);
  });

  // テストケース：必須フィールドが不足している場合のバリデーション
  it('必須フィールドが不足している場合400エラーを返すこと', async () => {
    const app = getApp();

    // titleフィールドを欠いたシーンデータ
    const invalidScenesData = [
      {
        overview: 'テスト概要',
        order: 0,
      },
    ];

    const response = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: invalidScenesData }),
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：不正なシナリオIDでの一括更新
  it('不正なシナリオIDの場合400エラーを返すこと', async () => {
    const app = getApp();

    // 不正なUUID形式のシナリオID
    const invalidScenarioId = 'invalid-uuid';

    const response = await app.request(
      `/api/graph-scenes/scenario/${invalidScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: testScenesData }),
      },
      getEnv(),
    );

    // バリデーションエラーのステータスを確認
    expect(response.status).toBe(400);
  });

  // テストケース：存在しないシナリオIDでの一括更新
  it('存在しないシナリオIDの場合404エラーを返すこと', async () => {
    const app = getApp();

    // 存在しないが正しい形式のUUID
    const nonExistentScenarioId = '770e8400-e29b-41d4-a716-446655440000';

    const response = await app.request(
      `/api/graph-scenes/scenario/${nonExistentScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: testScenesData }),
      },
      getEnv(),
    );

    // 404エラーのステータスを確認
    expect(response.status).toBe(404);

    // エラーレスポンスの確認
    const responseData = await response.json();
    expect(responseData).toHaveProperty('error');
    expect(responseData.error).toBe('Scenario not found');
  });

  // テストケース：一括更新後の個別取得での確認
  it('一括更新後に個別シーン取得で正しいデータが取得できること', async () => {
    const app = getApp();

    // 一括更新実行
    const batchResponse = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: testScenesData }),
      },
      getEnv(),
    );

    expect(batchResponse.status).toBe(200);

    // 一覧取得で同じデータが取得できることを確認
    const listResponse = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      getEnv(),
    );

    expect(listResponse.status).toBe(200);

    const batchData = await batchResponse.json();
    const listData = await listResponse.json();

    // 一括更新のレスポンスと一覧取得のレスポンスが一致することを確認
    expect(listData).toHaveLength(batchData.scenes.length);
    expect(listData[0].title).toBe(batchData.scenes[0].title);
    expect(listData[1].title).toBe(batchData.scenes[1].title);
    expect(listData[2].title).toBe(batchData.scenes[2].title);
  });

  // テストケース：大量データでの一括更新パフォーマンステスト
  it('大量シーンデータ（50個）での一括更新が正常に動作すること', async () => {
    const app = getApp();

    // 50個のシーンデータを生成
    const largeScenesData = Array.from({ length: 50 }, (_, index) => ({
      title: `シーン${index + 1}`,
      overview: `シーン${index + 1}の概要説明`,
      order: index,
    }));

    const response = await app.request(
      `/api/graph-scenes/scenario/${testScenarioId}/batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenes: largeScenesData }),
      },
      getEnv(),
    );

    // レスポンスステータスを確認
    expect(response.status).toBe(200);

    // レスポンス内容の確認
    const responseData = await response.json();
    expect(responseData.scenes).toHaveLength(50);
    expect(responseData.summary.totalScenes).toBe(50);

    // 順序が正しく保持されていることを確認
    responseData.scenes.forEach((scene: any, index: number) => {
      expect(scene.order).toBe(index);
      expect(scene.title).toBe(`シーン${index + 1}`);
    });
  });
});