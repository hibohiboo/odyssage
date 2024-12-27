import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';

const app = new Hono<{ Bindings: { NEON_CONNECTION_STRING: string } }>();

app.get('/', (c) => c.text('Hello Cloudflare Workers!'));
app.get('/characters', async (c) => {
	const sql = neon(c.env.NEON_CONNECTION_STRING);
	const data = await sql('SELECT * FROM odyssage.character');

	return c.json(data);
});

export default app;
