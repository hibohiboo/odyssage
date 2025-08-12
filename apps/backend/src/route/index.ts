import { vValidator } from '@hono/valibot-validator';
import {
  getScenarios,
  getScenariosByid,
  getPublicScenarios,
} from '@odyssage/database/src/queries/select';
import { idSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';
import { authorsRoute } from './authors';
import { gameMastersRoute } from './gameMasters';
import { graphScenarioRoute } from './graphScenario';
import { graphSceneRoute } from './graphScene';
import { sessionRoute } from './session';
import { user } from './user';

const route = new Hono<Env>()
  .get('/', (c) => c.text('Hello Cloudflare Workers!'))
  .use('/users/*', authorizeMiddleware)
  .route('/users', user)
  .route('/authors', authorsRoute) // シナリオ作成者文脈ルーターを統合
  .route('/sessions', sessionRoute) // セッションルーターを統合
  .route('/game-masters', gameMastersRoute) // ゲームマスター文脈ルーターを統合
  .route('/graph-scenarios', graphScenarioRoute) // GraphDBシナリオルーターを統合
  .route('/graph-scenes', graphSceneRoute) // GraphDBシーンルーターを統合
  .get('/scenarios', async (c) => {
    const data = await getScenarios(c.env.NEON_CONNECTION_STRING);

    return c.json(data);
  })
  .get('/scenarios/public', async (c) => {
    const data = await getPublicScenarios(c.env.NEON_CONNECTION_STRING);

    return c.json(data);
  })
  // 新API（推奨）- RESTful統一
  .get('/scenarios/:id', vValidator('param', idSchema), async (c) => {
    const param = c.req.valid('param');
    const [data] = await getScenariosByid(
      c.env.NEON_CONNECTION_STRING,
      param.id,
    );
    if (!data) {
      return c.text('Not Found', 404);
    }
    return c.json(data);
  });
export default route;
