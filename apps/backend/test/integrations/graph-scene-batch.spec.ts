import { beforeEach, describe, expect, it } from 'vitest';
import { useNeo4J } from './neo4j-test-utils';

describe('GraphDBシーン一括更新統合テスト', async () => {
  await useNeo4J(async ({ app, env, driver }) => {
    /** ------------------------------
     * テスト用データ
     * ------------------------------ */
    const VALID_SCENARIO_ID = '550e8400-e29b-41d4-a716-446655440000';
    const DEFAULT_SCENES = [
      { title: 'オープニング', overview: '冒険の始まり', order: 0 },
      { title: '戦闘シーン', overview: 'モンスターとの戦い', order: 1 },
      { title: 'エンディング', overview: '冒険の終わり', order: 2 },
    ];

    beforeEach(async () => {
      const session = driver.session();
      await session.run(
        `
        MERGE (s:Scenario {id: $id})
        SET s.title = $title,
            s.overview = $overview,
            s.updatedAt = datetime(),
            s.createdAt = CASE WHEN s.createdAt IS NULL THEN datetime() ELSE s.createdAt END
        RETURN s.id as id, s.title as title, s.overview as overview
        `,
        {
          id: VALID_SCENARIO_ID,
          title: 'テスト',
          overview: 'テスト用',
        },
      );
      session.close();
    });

    /** ------------------------------
     * API呼び出しヘルパー
     * ------------------------------ */
    const batchUpdateScenes = (scenarioId: string, scenes: any[]) =>
      app.request(
        `/api/graph-scenes/scenario/${scenarioId}/batch`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenes }),
        },
        env,
      );

    const getScenes = (scenarioId: string) =>
      app.request(
        `/api/graph-scenes/scenario/${scenarioId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
        env,
      );

    const generateScenes = (count: number) =>
      Array.from({ length: count }, (_, i) => ({
        title: `シーン${i + 1}`,
        overview: `シーン${i + 1}の概要説明`,
        order: i,
      }));

    /** ------------------------------
     * シーン一括更新テスト
     * ------------------------------ */
    it('正常に一括更新できる', async () => {
      const res = await batchUpdateScenes(VALID_SCENARIO_ID, DEFAULT_SCENES);
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.scenes).toHaveLength(3);
      expect(data.summary.totalScenes).toBe(3);

      data.scenes.forEach((scene: any, i: number) => {
        expect(scene.title).toBe(DEFAULT_SCENES[i].title);
        expect(scene.order).toBe(DEFAULT_SCENES[i].order);
        expect(scene.scenarioId).toBe(VALID_SCENARIO_ID);
      });
    });

    it('空配列で更新すると全削除される', async () => {
      await batchUpdateScenes(VALID_SCENARIO_ID, DEFAULT_SCENES);
      const res = await batchUpdateScenes(VALID_SCENARIO_ID, []);
      const data = (await res.json()) as any;
      expect(data.scenes).toHaveLength(0);
      expect(data.summary.totalScenes).toBe(0);
    });

    it('必須フィールド不足は400エラー', async () => {
      const res = await batchUpdateScenes(VALID_SCENARIO_ID, [
        { overview: '概要', order: 0 },
      ]);
      expect(res.status).toBe(400);
    });

    it('不正なUUIDは400エラー', async () => {
      const res = await batchUpdateScenes('invalid-uuid', DEFAULT_SCENES);
      expect(res.status).toBe(400);
    });

    it('存在しないシナリオIDは404エラー', async () => {
      const id = '770e8400-e29b-41d4-a716-446655440000';
      const res = await batchUpdateScenes(id, DEFAULT_SCENES);
      const data = (await res.json()) as any;
      expect(res.status).toBe(404);
      expect(data.error).toBe('Scenario not found');
    });

    it('一括更新後に個別取得で一致する', async () => {
      const batchRes = await batchUpdateScenes(VALID_SCENARIO_ID, DEFAULT_SCENES);
      const listRes = await getScenes(VALID_SCENARIO_ID);

      const batchData = (await batchRes.json()) as any;
      const listData = (await listRes.json()) as any;

      expect(listData).toHaveLength(batchData.scenes.length);
      expect(listData.map((s: any) => s.title)).toEqual(
        batchData.scenes.map((s: any) => s.title),
      );
    });

    it('50件でも正常に更新でき順序も保持される', async () => {
      const largeScenes = generateScenes(50);
      const res = await batchUpdateScenes(VALID_SCENARIO_ID, largeScenes);
      const data = (await res.json()) as any;

      expect(data.scenes).toHaveLength(50);
      data.scenes.forEach((scene: any, i: number) => {
        expect(scene.order).toBe(i);
        expect(scene.title).toBe(`シーン${i + 1}`);
      });
    });
  });
});
