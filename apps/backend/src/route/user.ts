import { upsertUser } from '@odyssage/database/src/queries/insert';
import { getUserById } from '@odyssage/database/src/queries/select';
import { userParamSchema, userSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator as vValidator } from 'hono-openapi/valibot';

export const user = new Hono<Env>()
	.get(
		'/:uid',
		describeRoute({
			description: '指定したユーザを取得',
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': { schema: resolver(userSchema) },
					},
				},
			},
		}),
		vValidator('param', userParamSchema),
		async (c) => {
			const param = c.req.valid('param');
			const [data] = await getUserById(c.env.NEON_CONNECTION_STRING, param.uid);
			if (!data) {
				return c.text('Not Found', 404);
			}
			return c.json(data);
		},
	)
	.put(
		'/:uid',
		describeRoute({
			description: '指定したユーザを登録',
			responses: {
				204: {
					description: 'Successful response',
				},
			},
		}),
		vValidator('param', userParamSchema),
		async (c) => {
			const param = c.req.valid('param');
			await upsertUser(c.env.NEON_CONNECTION_STRING, { id: param.uid });

			return c.body(null, 204);
		},
	);
