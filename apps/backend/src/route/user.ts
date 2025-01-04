import { vValidator } from '@hono/valibot-validator';
import { upsertUser } from '@odyssage/database/src/queries/insert';
import { getUserById } from '@odyssage/database/src/queries/select';
import { userParamSchema } from '@odyssage/schema/src/schema';
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
	.put('/:uid', vValidator('param', userParamSchema), async (c) => {
		const param = c.req.valid('param');
		await upsertUser(c.env.NEON_CONNECTION_STRING, { id: param.uid });

		return c.body(null, 204);
	});
