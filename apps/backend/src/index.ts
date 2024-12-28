import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import neo4j from 'neo4j-driver';
import type { Neo4jError } from 'neo4j-driver-core';

// worker-configuration.d.ts で定義されていることをlinterが知らないのでコメントで対応
// eslint-disable-next-line no-undef
const app = new Hono<Env>();

app.get('/', (c) => c.text('Hello Cloudflare Workers!'));
app.get('/characters', async (c) => {
	const sql = neon(c.env.NEON_CONNECTION_STRING);
	const data = await sql('SELECT * FROM odyssage.character');

	return c.json(data);
});
app.get('/scenarios', async (c) => {
	// URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
	const URI = 'neo4j+s://98ff15f9.databases.neo4j.io';
	let driver;

	try {
		console.log(c.env);
		driver = neo4j.driver(URI, neo4j.auth.basic(c.env.NEO4J_USER, c.env.NEO4J_PASSWORD));
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
export default app;
