import { getScenarios } from '@odyssage/database/src/queries/select';
import { scenarioResponseSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver } from 'hono-openapi/valibot';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';
import { user } from './user';
import type { Neo4jError } from 'neo4j-driver-core';

const route = new Hono<Env>()
	.get('/', (c) => c.text('Hello Cloudflare Workers!'))
	.use('/user/*', authorizeMiddleware)
	.route('/user', user)
	.get(
		'/scenarios',
		describeRoute({
			description: 'シナリオの一覧を取得',
			responses: {
				200: {
					description: 'Successful response',
					content: {
						'application/json': { schema: resolver(scenarioResponseSchema) },
					},
				},
			},
		}),
		async (c) => {
			const data = await getScenarios(c.env.NEON_CONNECTION_STRING);

			return c.json(data);
		},
	)
	.get('/graph-scenarios', async (c) => {
		// vitestが Error: No such module "node:os". というエラーを出すので、いったん動的importで逃げる
		const neo4j = await import('neo4j-driver');
		let driver;
		try {
			console.log(c.env);
			driver = neo4j.driver(c.env.NEO4J_URL, neo4j.auth.basic(c.env.NEO4J_USER, c.env.NEO4J_PASSWORD));
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
