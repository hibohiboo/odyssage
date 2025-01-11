import { vValidator } from '@hono/valibot-validator';
import { upsertUser, createScenario } from '@odyssage/database/src/queries/insert';
import { getUserById } from '@odyssage/database/src/queries/select';
import { userParamSchema, userRequestSchema, scenarioRequestSchema } from '@odyssage/schema/src/schema';
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
	.put('/:uid', vValidator('param', userParamSchema), vValidator('json', userRequestSchema), async (c) => {
		const param = c.req.valid('param');
		const json = c.req.valid('json');
		await upsertUser(c.env.NEON_CONNECTION_STRING, { id: param.uid, name: json.name });

		return c.body(null, 204);
	})
	.post('/:uid/scenario', vValidator('param', userParamSchema), vValidator('json', scenarioRequestSchema), async (c) => {
		const param = c.req.valid('param');
		const json = c.req.valid('json');
		try {
			await createScenario({ id: json.id, title: json.title, userId: param.uid, overview: json.overview });
			return c.json({ message: 'Scenario created successfully' }, 201);
		} catch (error) {
			return c.json({ message: 'Failed to create scenario', error: error.message }, 400);
		}
	});
