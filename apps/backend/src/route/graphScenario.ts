import { vValidator } from '@hono/valibot-validator';
import { idSchema, graphScenarioRequestSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import type { Neo4jError } from 'neo4j-driver-core';

export const graphScenarioRoute = new Hono<Env>()
  .put('/:id', vValidator('param', idSchema), vValidator('json', graphScenarioRequestSchema), async (c) => {
    const { id } = c.req.valid('param');
    const { title, overview } = c.req.valid('json');

    // vitestが Error: No such module "node:os". というエラーを出すので、いったん動的importで逃げる
    const neo4j = await import('neo4j-driver');
    let driver;
    
    try {
      driver = neo4j.driver(
        c.env.NEO4J_URL,
        neo4j.auth.basic(c.env.NEO4J_USER, c.env.NEO4J_PASSWORD),
      );

      const session = driver.session();
      
      // MERGE文でupsert操作を実行
      const result = await session.run(
        `
        MERGE (s:Scenario {id: $id})
        SET s.title = $title,
            s.overview = $overview,
            s.updatedAt = datetime(),
            s.createdAt = CASE WHEN s.createdAt IS NULL THEN datetime() ELSE s.createdAt END
        RETURN s.id as id, s.title as title, s.overview as overview
        `,
        {
          id,
          title,
          overview,
        }
      );

      await session.close();

      if (result.records.length === 0) {
        return c.json({ error: 'Failed to create or update scenario' }, 500);
      }

      const record = result.records[0];
      const response = {
        id: record.get('id'),
        title: record.get('title'),
        overview: record.get('overview'),
      };

      // 作成か更新かを判定するために、レコードの作成時刻をチェック
      // 簡単のため、常に200を返す（実際のupsert結果の判定は複雑になるため）
      return c.json(response, 200);

    } catch (err) {
      const neo4jError = err as Neo4jError;
      // eslint-disable-next-line no-console
      console.log(`Neo4j error: ${err}\nCause: ${neo4jError.cause}`);
      return c.json({ error: 'Database error' }, 500);
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  });