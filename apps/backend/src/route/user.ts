import { vValidator } from '@hono/valibot-validator';
import {
  upsertUser,
} from '@odyssage/database/src/queries/insert';
import {
  getUserById,
} from '@odyssage/database/src/queries/select';
import { getScenarioStocksByUserId } from '@odyssage/database/src/queries/select_stocks';
import {
  createScenarioStock,
  deleteScenarioStock,
} from '@odyssage/database/src/queries/stock';
import {
  userParamSchema,
  userRequestSchema,
  userScenarioParamSchema,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';

export const user = new Hono<Env>()
  .get('/:uid', vValidator('param', userParamSchema), async (c) => {
    const param = c.req.valid('param');
    const [data] = await getUserById(c.env.NEON_CONNECTION_STRING, param.uid);
    if (!data) {
      return c.text('Not Found', 404);
    }
    return c.json(data);
  })
  .put(
    '/:uid',
    vValidator('param', userParamSchema),
    vValidator('json', userRequestSchema),
    async (c) => {
      const param = c.req.valid('param');
      const json = c.req.valid('json');
      await upsertUser(c.env.NEON_CONNECTION_STRING, {
        id: param.uid,
        name: json.name,
      });

      return c.body(null, 204);
    },
  )
  .post(
    '/:uid/stocked-scenarios/:id',
    vValidator('param', userScenarioParamSchema),
    async (c) => {
      const param = c.req.valid('param');
      await createScenarioStock(c.env.NEON_CONNECTION_STRING, {
        userId: param.uid,
        scenarioId: param.id,
      });

      return c.json({ message: 'Scenario insert successfully' }, 201);
    },
  )
  .delete(
    '/:uid/stocked-scenarios/:id',
    vValidator('param', userScenarioParamSchema),
    async (c) => {
      const param = c.req.valid('param');
      await deleteScenarioStock(c.env.NEON_CONNECTION_STRING, {
        userId: param.uid,
        scenarioId: param.id,
      });

      return c.json(
        { message: 'Scenario removed from stock successfully' },
        200,
      );
    },
  )
  .get(
    '/:uid/stocked-scenarios',
    vValidator('param', userParamSchema),
    async (c) => {
      const param = c.req.valid('param');
      const data = await getScenarioStocksByUserId(
        c.env.NEON_CONNECTION_STRING,
        param.uid,
      );
      return c.json(data);
    },
  );
