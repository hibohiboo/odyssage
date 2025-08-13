import { beforeEach, describe, expect, it } from 'vitest';
import { useNeo4J } from './neo4j-test-utils';

describe('GraphDBシーン統合テスト', async () => {
  await useNeo4J(async ({ app, env, driver }) => {
    /** ------------------------------
     * テスト用データ
     * ------------------------------ */
    const VALID_SCENARIO_ID = '550e8400-e29b-41d4-a716-446655440000';
    const VALID_SCENE_ID = '660e8400-e29b-41d4-a716-446655440001';
    const VALID_SCENE_DATA = {
      title: 'テストシーン',
      overview: 'これはテスト用のシーンです。GraphDBに保存されます。',
      scenarioId: VALID_SCENARIO_ID,
      order: 0,
    };

    // const INVALID_UUID = 'invalid-uuid';
    // const NON_EXISTENT_SCENARIO_ID = '770e8400-e29b-41d4-a716-446655440000';
    // const NON_EXISTENT_SCENE_ID = '880e8400-e29b-41d4-a716-446655440002';

    // /** ------------------------------
    //  * 環境セットアップ
    //  * ------------------------------ */
    // const { getApp, getEnv } = setupTestEnv({
    //   beforeSetup: async () => {
    //     // 将来、GraphDBの初期化/クリーンアップをここに実装
    //   },
    // });

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
    const putScene = ({ sceneId, data }: { sceneId: string; data: object }) =>
      app.request(
        `/api/graph-scenes/${sceneId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        env,
      );

    // const getScenesByScenario = (
    //   app: AppType,
    //   env: Record<string, string>,
    //   scenarioId: string,
    // ) =>
    //   app.request(
    //     `/api/graph-scenes/scenario/${scenarioId}`,
    //     { method: 'GET', headers: { 'Content-Type': 'application/json' } },
    //     env,
    //   );

    // const deleteScene = (
    //   app: AppType,
    //   env: Record<string, string>,
    //   sceneId: string,
    // ) =>
    //   app.request(
    //     `/api/graph-scenes/${sceneId}`,
    //     { method: 'DELETE', headers: { 'Content-Type': 'application/json' } },
    //     env,
    //   );

    /** ------------------------------
     * シーン作成テスト
     * ------------------------------ */
    describe('シーン作成', () => {
      it('GraphDBにシーンを作成できる', async () => {
        const res = await putScene({
          sceneId: VALID_SCENE_ID,
          data: VALID_SCENE_DATA,
        });
        expect(res.status).toBe(200);

        const body = await res.json();
        expect(body).toEqual({ id: VALID_SCENE_ID, ...VALID_SCENE_DATA });
      });

      // it('必須フィールド不足で400エラー', async () => {
      //   const invalidData = {
      //     overview: VALID_SCENE_DATA.overview,
      //     scenarioId: VALID_SCENARIO_ID,
      //     order: 0,
      //   };
      //   const res = await putScene(VALID_SCENE_ID, invalidData);
      //   expect(res.status).toBe(400);
      // });

      // it('不正なscenarioId形式で400エラー', async () => {
      //   const invalidData = { ...VALID_SCENE_DATA, scenarioId: INVALID_UUID };
      //   const res = await putScene(VALID_SCENE_ID, invalidData);
      //   expect(res.status).toBe(400);
      // });

      // it('負のorder値で400エラー', async () => {
      //   const invalidData = { ...VALID_SCENE_DATA, order: -1 };
      //   const res = await putScene(VALID_SCENE_ID, invalidData);
      //   expect(res.status).toBe(400);
      // });
    });

    /** ------------------------------
     * シーン一覧取得テスト
     * ------------------------------ */
    // describe('シーン一覧取得', () => {
    //   it('正常に取得できる', async () => {
    //     const res = await getScenesByScenario(VALID_SCENARIO_ID);
    //     expect(res.status).toBe(200);

    //     const body = await res.json<any[]>();
    //     expect(Array.isArray(body)).toBe(true);

    //     if (body.length > 0) {
    //       expect(body[0]).toMatchObject({
    //         id: expect.any(String),
    //         title: expect.any(String),
    //         overview: expect.any(String),
    //         scenarioId: expect.any(String),
    //         order: expect.any(Number),
    //       });
    //     }
    //   });

    //   it('不正なシナリオID形式で400エラー', async () => {
    //     const res = await getScenesByScenario(INVALID_UUID);
    //     expect(res.status).toBe(400);
    //   });

    //   it('存在しないシナリオIDで空配列', async () => {
    //     const res = await getScenesByScenario(NON_EXISTENT_SCENARIO_ID);
    //     expect(res.status).toBe(200);
    //     expect(await res.json()).toEqual([]);
    //   });
    // });

    // /** ------------------------------
    //  * シーン削除テスト
    //  * ------------------------------ */
    // describe('シーン削除', () => {
    //   it('存在するシーンを削除できる', async () => {
    //     expect((await putScene(VALID_SCENE_ID, VALID_SCENE_DATA)).status).toBe(
    //       200,
    //     );

    //     const delRes = await deleteScene(VALID_SCENE_ID);
    //     expect(delRes.status).toBe(204);
    //     expect(await delRes.text()).toBe('');
    //   });

    //   it('存在しないシーン削除で404エラー', async () => {
    //     const res = await deleteScene(NON_EXISTENT_SCENE_ID);
    //     expect(res.status).toBe(404);
    //     expect(await res.json()).toMatchObject({ error: 'Scene not found' });
    //   });

    //   it('不正なUUID形式で400エラー', async () => {
    //     const res = await deleteScene(INVALID_UUID);
    //     expect(res.status).toBe(400);
    //   });

    //   it('削除後に一覧から除外される', async () => {
    //     await putScene(VALID_SCENE_ID, VALID_SCENE_DATA);

    //     const beforeList = await (
    //       await getScenesByScenario(VALID_SCENARIO_ID)
    //     ).json<any[]>();
    //     await deleteScene(VALID_SCENE_ID);
    //     const afterList = await (
    //       await getScenesByScenario(VALID_SCENARIO_ID)
    //     ).json<any[]>();

    //     expect(afterList.length).toBe(beforeList.length - 1);
    //     expect(afterList.some((s: any) => s.id === VALID_SCENE_ID)).toBe(false);
    //   });
    // });
  });
});
