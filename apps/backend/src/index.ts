import { getScenarios } from '@odyssage/database/src/queries/select';
import { scenarioResponseSchema } from '@odyssage/schema/src/schema';
import { apiReference } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { describeRoute, openAPISpecs } from 'hono-openapi';
import { resolver } from 'hono-openapi/valibot';
import type { Neo4jError } from 'neo4j-driver-core';

// worker-configuration.d.ts で定義されていることをlinterが知らないのでコメントで対応
// eslint-disable-next-line no-undef
const app = new Hono<Env>();

app.get('/', (c) => c.text('Hello Cloudflare Workers!'));
app.get(
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
);
app.get('/graph-scenarios', async (c) => {
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
app.get(
	'/openapi',
	openAPISpecs(app, {
		documentation: {
			info: { title: 'Odyssage API', version: '0.0.0', description: 'Odyssage Backend API' },
			servers: [{ url: 'http://127.0.0.1:8787', description: 'Local Server' }],
		},
	}),
);
app.get(
	'/docs',
	apiReference({
		theme: 'saturn',
		spec: { url: '/openapi' },
	}),
);
export default app;
