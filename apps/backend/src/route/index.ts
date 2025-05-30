import { vValidator } from '@hono/valibot-validator';
import {
  getScenarios,
  getScenariosByid,
  getPublicScenarios,
} from '@odyssage/database/src/queries/select';
import { idSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';
import { gmRoute } from './gm';
import { sessionRoute } from './session';
import { user } from './user';
import type { Neo4jError } from 'neo4j-driver-core';

const route = new Hono<Env>()
  .get('/', (c) => c.text('Hello Cloudflare Workers!'))
  .use('/users/*', authorizeMiddleware)
  .route('/users', user)
  .route('/sessions', sessionRoute) // セッションルーターを統合
  .route('/gm', gmRoute) // GM管理ルーターを統合
  .get('/scenarios', async (c) => {
    const data = await getScenarios(c.env.NEON_CONNECTION_STRING);

    return c.json(data);
  })
  .get('/scenarios/public', async (c) => {
    const data = await getPublicScenarios(c.env.NEON_CONNECTION_STRING);

    return c.json(data);
  })
  .get('/scenario/:id', vValidator('param', idSchema), async (c) => {
    const param = c.req.valid('param');
    const [data] = await getScenariosByid(
      c.env.NEON_CONNECTION_STRING,
      param.id,
    );
    return c.json(data);
  })
  .get('/graph-scenarios', async (c) => {
    // vitestが Error: No such module "node:os". というエラーを出すので、いったん動的importで逃げる
    const neo4j = await import('neo4j-driver');
    let driver;
    try {
      console.log(c.env);
      driver = neo4j.driver(
        c.env.NEO4J_URL,
        neo4j.auth.basic(c.env.NEO4J_USER, c.env.NEO4J_PASSWORD),
      );
      const serverInfo = await driver.getServerInfo();
      console.log('Connection established');
      console.log(serverInfo);
      const session = driver.session();
      const result = await session.run('match (s:Scenario) return (s)');
      const data = result.records.map((record) => record.get('s').properties);

      return c.json(data);
    } catch (err) {
      const neo4jError = err as Neo4jError;
      console.log(`Connection error\n${err}\nCause: ${neo4jError.cause}`);

      return c.text('Server Error', 500);
    } finally {
      if (driver) {
        await driver.close();
      }
    }
  });
export default route;
