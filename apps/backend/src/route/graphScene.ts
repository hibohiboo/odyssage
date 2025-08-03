import { vValidator } from '@hono/valibot-validator';
import { getDriver } from '@odyssage/graph-database/src/driver';
import {
  idSchema,
  graphSceneRequestSchema,
  graphSceneBatchRequestSchema,
  object,
  pipe,
  string,
  uuid,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { type Neo4jError } from 'neo4j-driver-core';

export const graphSceneRoute = new Hono<Env>()
  .get(
    '/scenario/:scenarioId',
    vValidator('param', object({ scenarioId: pipe(string(), uuid()) })),
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
)
  .delete(
    '/:id',
    vValidator('param', idSchema),
    async (c) => {
      const { id } = c.req.valid('param');

      // eslint-disable-next-line no-console
      console.log(`GraphDB scene delete request: id=${id}`);

      try {
        const driver = getDriver();
        const session = driver.session();

        // シーンとその関係性を削除
        const result = await session.run(
          `
          MATCH (scene:Scene {id: $id})
          OPTIONAL MATCH (scene)-[r]-()
          DELETE r, scene
          RETURN COUNT(scene) as deletedCount
          `,
          { id }
        );

        await session.close();

        const deletedCount = result.records[0]?.get('deletedCount')?.toNumber() ?? 0;
        
        if (deletedCount === 0) {
          return c.json({ error: 'Scene not found' }, 404);
        }

        return c.body(null, 204);
      } catch (err) {
        const neo4jError = err as Neo4jError;
        // eslint-disable-next-line no-console
        console.log(`Neo4j error: ${err}\nCause: ${neo4jError.cause}`);
        return c.json({ error: 'Database error' }, 500);
      }
    },
  )
  .put(
    '/scenario/:scenarioId/batch',
    vValidator('param', object({ scenarioId: pipe(string(), uuid()) })),
    vValidator('json', graphSceneBatchRequestSchema),
    async (c) => {
      const { scenarioId } = c.req.valid('param');
      const { scenes } = c.req.valid('json');

      // eslint-disable-next-line no-console
      console.log(
        `GraphDB scene batch update request: scenarioId=${scenarioId}, sceneCount=${scenes.length}`,
      );

      try {
        const driver = getDriver();
        const session = driver.session();

        // シナリオ存在確認クエリ
        const scenarioCheckResult = await session.run(
          `MATCH (scenario:Scenario {id: $scenarioId}) RETURN scenario`,
          { scenarioId }
        );

        if (scenarioCheckResult.records.length === 0) {
          await session.close();
          return c.json({ error: 'Scenario not found' }, 404);
        }

        // 既存シーン全削除
        await session.run(
          `
          MATCH (scenario:Scenario {id: $scenarioId})
          OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
          DETACH DELETE scene
          `,
          { scenarioId }
        );

        // 新しいシーンがある場合のみ作成
        let updatedScenes = [];
        if (scenes.length > 0) {
          const result = await session.run(
            `
            MATCH (scenario:Scenario {id: $scenarioId})
            UNWIND $scenes as sceneData
            CREATE (newScene:Scene {
              id: randomUUID(),
              title: sceneData.title,
              overview: sceneData.overview,
              order: sceneData.order,
              scenarioId: $scenarioId,
              createdAt: datetime(),
              updatedAt: datetime()
            })
            CREATE (scenario)-[:HAS_SCENE]->(newScene)
            RETURN newScene.id as id,
                   newScene.title as title,
                   newScene.overview as overview,
                   newScene.order as order,
                   newScene.scenarioId as scenarioId,
                   newScene.createdAt as createdAt,
                   newScene.updatedAt as updatedAt
            ORDER BY newScene.order ASC
            `,
            { scenarioId, scenes }
          );

          updatedScenes = result.records.map(record => ({
            id: record.get('id'),
            title: record.get('title'),
            overview: record.get('overview'),
            order: record.get('order'),
            scenarioId: record.get('scenarioId'),
            createdAt: record.get('createdAt')?.toString(),
            updatedAt: record.get('updatedAt')?.toString(),
          }));
        }

        await session.close();

        // レスポンス構築
        const updatedScenes = result.records.map(record => ({
          id: record.get('id'),
          title: record.get('title'),
          overview: record.get('overview'),
          order: record.get('order'),
          scenarioId: record.get('scenarioId'),
          createdAt: record.get('createdAt')?.toString(),
          updatedAt: record.get('updatedAt')?.toString(),
        }));

        const response = {
          scenes: updatedScenes,
          summary: {
            totalScenes: updatedScenes.length,
            message: `${updatedScenes.length}個のシーンが正常に一括更新されました`,
          },
        };

        return c.json(response, 200);
      } catch (err) {
        const neo4jError = err as Neo4jError;
        // eslint-disable-next-line no-console
        console.log(`Neo4j batch update error: ${err}\nCause: ${neo4jError.cause}`);
        
        // シナリオが存在しない場合の特別処理
        if (neo4jError.code === 'Neo.ClientError.Statement.EntityNotFound') {
          return c.json({ error: 'Scenario not found' }, 404);
        }
        
        return c.json({ error: 'Database error' }, 500);
      }
    },
  );