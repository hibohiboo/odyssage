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

  // テストケース：GraphDBシーンの削除機能
  describe('GraphDBシーン削除機能', () => {
    // テストケース：存在するシーンの削除
    it('存在するシーンを正常に削除できること', async () => {
      const app = getApp();

      // 事前にシーンを作成
      const createResponse = await app.request(
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
      
      // 作成が成功していることを確認
      expect(createResponse.status).toBe(200);

      // DELETEリクエストでシーンを削除
      const deleteResponse = await app.request(
        `/api/graph-scenes/${testSceneId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // 削除成功のステータスを確認
      expect(deleteResponse.status).toBe(204);

      // レスポンスボディが空であることを確認
      const responseText = await deleteResponse.text();
      expect(responseText).toBe('');
    });

    // テストケース：存在しないシーンの削除
    it('存在しないシーンの削除で404エラーを返すこと', async () => {
      const app = getApp();

      // 存在しないシーンIDで削除を試行
      const nonExistentSceneId = '880e8400-e29b-41d4-a716-446655440002';
      
      const response = await app.request(
        `/api/graph-scenes/${nonExistentSceneId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // 404エラーのステータスを確認
      expect(response.status).toBe(404);

      // エラーレスポンスの確認
      const responseData = await response.json();
      expect(responseData).toHaveProperty('error');
      expect(responseData.error).toBe('Scene not found');
    });

    // テストケース：不正なUUID形式での削除
    it('不正なUUID形式の場合400エラーを返すこと', async () => {
      const app = getApp();

      // 不正なUUID形式のシーンID
      const invalidSceneId = 'invalid-uuid';
      
      const response = await app.request(
        `/api/graph-scenes/${invalidSceneId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // UUIDバリデーションエラーで400が返される
      expect(response.status).toBe(400);
    });

    // テストケース：削除後のシーン一覧確認
    it('シーン削除後にシーン一覧から除外されることを確認', async () => {
      const app = getApp();

      // 事前にシーンを作成
      await app.request(
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

      // 作成後のシーン一覧を取得
      const listBeforeDelete = await app.request(
        `/api/graph-scenes/scenario/${testScenarioId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );
      
      const scenesBeforeDelete = await listBeforeDelete.json();
      const sceneCountBefore = scenesBeforeDelete.length;

      // シーンを削除
      await app.request(
        `/api/graph-scenes/${testSceneId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );

      // 削除後のシーン一覧を取得
      const listAfterDelete = await app.request(
        `/api/graph-scenes/scenario/${testScenarioId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        getEnv(),
      );
      
      const scenesAfterDelete = await listAfterDelete.json();

      // シーン数が減っていることを確認
      expect(scenesAfterDelete.length).toBe(sceneCountBefore - 1);

      // 削除したシーンが一覧に含まれていないことを確認
      const deletedSceneExists = scenesAfterDelete.some(
        (scene: any) => scene.id === testSceneId
      );
      expect(deletedSceneExists).toBe(false);
    });
  });
});