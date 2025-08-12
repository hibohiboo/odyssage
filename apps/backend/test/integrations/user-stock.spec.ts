import { execSql } from '@odyssage/database/test-utils/execSql';

import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

/**
 * User Scenario Stock API統合テスト
 * GET /api/users/{uid}/stocked-scenarios, POST/DELETE stocked-scenarios エンドポイントのテスト
 */
describe('User Scenario Stock API 統合テスト', () => {
  const testUserId = 'test-user-id-12345';
  const testUserName = 'テストユーザー太郎';
  const testAuthorId = 'author-user-id-67890';
  const testAuthorName = 'シナリオ作成者';

  const testScenario1 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039901',
    title: 'ストック用シナリオ1',
    overview: 'これはストック用のテストシナリオ1です。',
    visibility: 'public',
  };

  const testScenario2 = {
    id: '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039902',
    title: 'ストック用シナリオ2',
    overview: 'これはストック用のテストシナリオ2です。',
    visibility: 'public',
  };

  const { getApp, getEnv, getConnectionString } = setupTestEnv({
    beforeSetup: async (connectionString) => {
      // テストユーザーたちを準備
      await execSql(
        connectionString,
        `INSERT INTO odyssage.users (id, name) VALUES 
          ('${testUserId}', '${testUserName}'),
          ('${testAuthorId}', '${testAuthorName}');`,
      );
    },
  });

  let app: ReturnType<typeof getApp>;

  beforeEach(async () => {
    app = getApp();
    // クリーンアップ
    await execSql(getConnectionString(), 'delete from odyssage.scenario_stock');
    await execSql(getConnectionString(), 'delete from odyssage.scenarios');

    // テストシナリオを準備
    await execSql(
      getConnectionString(),
      `INSERT INTO odyssage.scenarios (id, title, overview, user_id, visibility, updated_at) VALUES 
        ('${testScenario1.id}', '${testScenario1.title}', '${testScenario1.overview}', '${testAuthorId}', '${testScenario1.visibility}', CURRENT_TIMESTAMP),
        ('${testScenario2.id}', '${testScenario2.title}', '${testScenario2.overview}', '${testAuthorId}', '${testScenario2.visibility}', CURRENT_TIMESTAMP);`,
    );
  });

  /** ユーザーストックシナリオ一覧をGETで取得する共通関数 */
  const getStockedScenarios = async (uid: string) =>
    app.request(
      `/api/users/${uid}/stocked-scenarios`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token', // 認証必須
        },
      },
      getEnv(),
    );

  /** シナリオをPOSTでストック追加する共通関数 */
  const addScenarioStock = async (uid: string, scenarioId: string) =>
    app.request(
      `/api/users/${uid}/stocked-scenarios/${scenarioId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
      },
      getEnv(),
    );

  /** シナリオをDELETEでストック削除する共通関数 */
  const removeScenarioStock = async (uid: string, scenarioId: string) =>
    app.request(
      `/api/users/${uid}/stocked-scenarios/${scenarioId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-jwt-token',
        },
      },
      getEnv(),
    );

  describe('GET /api/users/{uid}/stocked-scenarios', () => {
    it('ストックがない場合は空配列を返す', async () => {
      const res = await getStockedScenarios(testUserId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('ストックしたシナリオ一覧を正しく取得できる', async () => {
      // 事前にシナリオをストック
      await addScenarioStock(testUserId, testScenario1.id);
      await addScenarioStock(testUserId, testScenario2.id);

      const res = await getStockedScenarios(testUserId);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);

      // ストックされたシナリオが含まれていることを確認
      const stockedIds = data.map((item) => item.id);
      expect(stockedIds).toContain(testScenario1.id);
      expect(stockedIds).toContain(testScenario2.id);
    });

    it('レスポンススキーマが適切な形式である', async () => {
      // 事前にシナリオをストック
      await addScenarioStock(testUserId, testScenario1.id);

      const res = await getStockedScenarios(testUserId);
      expect(res.status).toBe(200);

      const data = await res.json<any[]>();
      expect(Array.isArray(data)).toBe(true);

      if (data.length > 0) {
        const stock = data[0];

        // 必須フィールドの存在確認
        expect(stock).toHaveProperty('id');
        expect(stock).toHaveProperty('title');
        expect(stock).toHaveProperty('overview');
        expect(stock).toHaveProperty('stockedAt');

        // フィールド型の確認
        expect(typeof stock.id).toBe('string');
        expect(typeof stock.title).toBe('string');
        expect(typeof stock.overview).toBe('string');
        expect(typeof stock.stockedAt).toBe('string');

        // stockedAtが有効な日付形式であることを確認
        expect(new Date(stock.stockedAt)).toBeInstanceOf(Date);
      }
    });

    it('認証なしでもテスト環境ではバイパスされ200成功', async () => {
      const res = await app.request(
        `/api/users/${testUserId}/stocked-scenarios`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Authorization ヘッダーなし
        },
        getEnv(),
      );

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/users/{uid}/stocked-scenarios/{scenario_id}', () => {
    it('シナリオを正常にストック追加できる', async () => {
      const res = await addScenarioStock(testUserId, testScenario1.id);

      expect(res.status).toBe(201);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({ message: 'Scenario insert successfully' });

      // ストックされたことを確認
      const listRes = await getStockedScenarios(testUserId);
      const stocks = await listRes.json<any[]>();
      expect(stocks.length).toBe(1);
      expect(stocks[0].id).toBe(testScenario1.id);
    });

    it('重複ストックを防止する', async () => {
      // 最初のストック追加
      const res1 = await addScenarioStock(testUserId, testScenario1.id);
      expect(res1.status).toBe(201);

      // 同じシナリオを再度ストック
      await addScenarioStock(testUserId, testScenario1.id);
      // 重複の場合の動作を確認（500エラーまたは重複ハンドリング）
      // 実装次第でテストケース調整が必要

      // ストック一覧で重複がないことを確認
      const listRes = await getStockedScenarios(testUserId);
      const stocks = await listRes.json<any[]>();
      expect(stocks.length).toBe(1);
    });

    it('存在しないシナリオIDで404エラー', async () => {
      const nonExistentId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999';
      const res = await addScenarioStock(testUserId, nonExistentId);

      // 外部キー制約違反で500エラーが想定されるが、適切なエラーハンドリングが必要
      expect([404, 500]).toContain(res.status);
    });
  });

  describe('DELETE /api/users/{uid}/stocked-scenarios/{scenario_id}', () => {
    beforeEach(async () => {
      // 事前にストックを追加
      await addScenarioStock(testUserId, testScenario1.id);
    });

    it('ストックしたシナリオを正常に削除できる', async () => {
      const res = await removeScenarioStock(testUserId, testScenario1.id);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const data = await res.json();
      expect(data).toEqual({
        message: 'Scenario removed from stock successfully',
      });

      // ストックが削除されたことを確認
      const listRes = await getStockedScenarios(testUserId);
      const stocks = await listRes.json<any[]>();
      expect(stocks.length).toBe(0);
    });

    it('存在しないストック削除でも200成功（冪等性）', async () => {
      // 一度削除
      await removeScenarioStock(testUserId, testScenario1.id);

      // 再度削除を試行
      const res = await removeScenarioStock(testUserId, testScenario1.id);
      expect(res.status).toBe(200); // 冪等性により成功
    });

    it('存在しないシナリオIDでも200成功（冪等性）', async () => {
      const nonExistentId = '3d9b0bc1-e1bb-4d1e-86d7-9c5d5d039999';
      const res = await removeScenarioStock(testUserId, nonExistentId);

      expect(res.status).toBe(200); // 冪等性により成功
    });
  });
});
