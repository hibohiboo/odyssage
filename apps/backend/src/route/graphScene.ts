import { vValidator } from '@hono/valibot-validator';
import { getDriver } from '@odyssage/graph-database/src/driver';
import {
  idSchema,
  graphSceneRequestSchema,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { type Neo4jError } from 'neo4j-driver-core';
import * as v from 'valibot';

export const graphSceneRoute = new Hono<Env>()
  .get(
    '/scenario/:scenarioId',
    vValidator('param', v.object({ scenarioId: v.pipe(v.string(), v.uuid()) })),
    async (c) => {
      const { scenarioId } = c.req.valid('param');

      // eslint-disable-next-line no-console
      console.log(`GraphDB scenes list request for scenario: ${scenarioId}`);

      try {
        const driver = getDriver();
        const session = driver.session();

        // シナリオに関連するシーンを順序順で取得
        const result = await session.run(
          `
          MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)
          RETURN scene.id as id,
                 scene.title as title,
                 scene.overview as overview,
                 scene.scenarioId as scenarioId,
                 scene.order as order,
                 scene.createdAt as createdAt,
                 scene.updatedAt as updatedAt
          ORDER BY scene.order ASC
          `,
          { scenarioId }
        );

        await session.close();

        const scenes = result.records.map(record => ({
          id: record.get('id'),
          title: record.get('title'),
          overview: record.get('overview'),
          scenarioId: record.get('scenarioId'),
          order: record.get('order'),
          createdAt: record.get('createdAt')?.toString(),
          updatedAt: record.get('updatedAt')?.toString(),
        }));

        return c.json(scenes, 200);
      } catch (err) {
        const neo4jError = err as Neo4jError;
        // eslint-disable-next-line no-console
        console.log(`Neo4j error: ${err}\nCause: ${neo4jError.cause}`);
        return c.json({ error: 'Database error' }, 500);
      }
    },
  )
  .put(
  '/:id',
  vValidator('param', idSchema),
  vValidator('json', graphSceneRequestSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const { title, overview, scenarioId, order } = c.req.valid('json');

    // eslint-disable-next-line no-console
    console.log(
      `GraphDB scene save request: id=${id}, title="${title}", scenarioId="${scenarioId}", order=${order}`,
    );

    try {
      const driver = getDriver();
      const session = driver.session();

      // MERGE文でupsert操作を実行し、シナリオとの関係性も構築
      const result = await session.run(
        `
        MERGE (scene:Scene {id: $id})
        SET scene.title = $title,
            scene.overview = $overview,
            scene.scenarioId = $scenarioId,
            scene.order = $order,
            scene.updatedAt = datetime(),
            scene.createdAt = CASE WHEN scene.createdAt IS NULL THEN datetime() ELSE scene.createdAt END

        WITH scene
        MATCH (scenario:Scenario {id: $scenarioId})
        MERGE (scenario)-[:HAS_SCENE]->(scene)

        RETURN scene.id as id, 
               scene.title as title, 
               scene.overview as overview,
               scene.scenarioId as scenarioId,
               scene.order as order
        `,
        {
          id,
          title,
          overview,
          scenarioId,
          order,
        },
      );

      await session.close();

      if (result.records.length === 0) {
        return c.json({ error: 'Failed to create or update scene' }, 500);
      }

      const record = result.records[0];
      const response = {
        id: record.get('id'),
        title: record.get('title'),
        overview: record.get('overview'),
        scenarioId: record.get('scenarioId'),
        order: record.get('order'),
      };

      // 作成か更新かを判定するために、レコードの作成時刻をチェック
      // 簡単のため、常に200を返す（実際のupsert結果の判定は複雑になるため）
      return c.json(response, 200);
    } catch (err) {
      const neo4jError = err as Neo4jError;
      // eslint-disable-next-line no-console
      console.log(`Neo4j error: ${err}\nCause: ${neo4jError.cause}`);
      console.log(process.env.NEO4J_URL);
      return c.json({ error: 'Database error' }, 500);
    }
  },
);