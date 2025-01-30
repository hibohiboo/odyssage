import { vValidator } from '@hono/valibot-validator';
import {
  upsertUser,
  createScenario,
} from '@odyssage/database/src/queries/insert';
import {
  getScenariosByUid,
  getUserById,
} from '@odyssage/database/src/queries/select';
import { updateScenario } from '@odyssage/database/src/queries/update';
import {
  userParamSchema,
  userRequestSchema,
  scenarioRequestSchema,
  scenarioUpdateRequestSchema,
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
    '/:uid/scenario',
    vValidator('param', userParamSchema),
    vValidator('json', scenarioRequestSchema),
    async (c) => {
      const param = c.req.valid('param');
      const json = c.req.valid('json');

      await createScenario(c.env.NEON_CONNECTION_STRING, {
        id: json.id,
        title: json.title,
        userId: param.uid,
        overview: json.overview,
      });
      return c.json({ message: 'Scenario created successfully' }, 201);
    },
  )
  .get('/:uid/scenario', vValidator('param', userParamSchema), async (c) => {
    const param = c.req.valid('param');
    const data = await getScenariosByUid(
      c.env.NEON_CONNECTION_STRING,
      param.uid,
    );
    return c.json(data);
  })

  .put(
    '/:uid/scenario/:id',
    vValidator('param', userScenarioParamSchema),
    vValidator('json', scenarioUpdateRequestSchema),
    async (c) => {
      const param = c.req.valid('param');
      const json = c.req.valid('json');

      await updateScenario(c.env.NEON_CONNECTION_STRING, {
        id: param.id,
        title: json.title,
        overview: json.overview,
      });
      return c.json({ message: 'Scenario updated successfully' }, 200);
    },
  );
