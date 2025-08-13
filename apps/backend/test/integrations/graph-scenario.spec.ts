import { describe, expect, it } from 'vitest';
import { useNeo4J } from './neo4j-test-utils';

describe('GraphDBシナリオ統合テスト', async () => {
  await useNeo4J(async ({ app, env, driver }) => {
    /** ------------------------------
     * テスト用データ
     * ------------------------------ */
    const VALID_SCENARIO_ID = '550e8400-e29b-41d4-a716-446655440000';
    const VALID_SCENARIO_DATA = {
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです。GraphDBに保存されます。',
    };
    const UPDATED_SCENARIO_DATA = {
      title: '更新されたテストシナリオ',
      overview: 'これは更新されたシナリオの概要です。',
    };

    /** ------------------------------
     * API呼び出しヘルパー
     * ------------------------------ */
    const putScenario = ({
      scenarioId,
      data,
    }: {
      scenarioId: string;
      data: object;
    }) =>
      app.request(
        `/api/graph-scenarios/${scenarioId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        env,
      );

    /** ------------------------------
     * シナリオテスト
     * ------------------------------ */
    it('GraphDBにシナリオを作成できる', async () => {
      const res = await putScenario({
        scenarioId: VALID_SCENARIO_ID,
        data: VALID_SCENARIO_DATA,
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        id: VALID_SCENARIO_ID,
        ...VALID_SCENARIO_DATA,
      });
    });

    it('GraphDBシナリオを更新できる', async () => {
      await putScenario({
        scenarioId: VALID_SCENARIO_ID,
        data: VALID_SCENARIO_DATA,
      }); // 事前作成
      const res = await putScenario({
        scenarioId: VALID_SCENARIO_ID,
        data: UPDATED_SCENARIO_DATA,
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        id: VALID_SCENARIO_ID,
        ...UPDATED_SCENARIO_DATA,
      });
    });

    it('空タイトルでバリデーションエラー', async () => {
      const res = await putScenario({
        scenarioId: VALID_SCENARIO_ID,
        data: { title: '', overview: 'テスト概要' },
      });
      expect(res.status).toBe(400);
    });

    it('長すぎるタイトルでバリデーションエラー', async () => {
      const res = await putScenario({
        scenarioId: VALID_SCENARIO_ID,
        data: {
          title: 'a'.repeat(101),
          overview: 'テスト概要',
        },
      });
      expect(res.status).toBe(400);
    });
  });
});
