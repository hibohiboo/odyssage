import { Hono } from 'hono';
import { cors } from 'hono/cors';

import route from './route';

const app = new Hono<Env>()
	.use(
		'/api/*',
		cors({
			origin: ['https://odyssage.pages.dev', 'http://localhost:5173'],
			allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	.route('/api', route);

export default app;
export type AppType = typeof app;
