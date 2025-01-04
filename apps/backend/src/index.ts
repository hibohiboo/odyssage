import { apiReference } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { openAPISpecs } from 'hono-openapi';
import route from './route';

const app = new Hono<Env>()
	.use(
		'/api/*',
		cors({
			origin: ['*'],
			allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'Authorization'],
		}),
	)
	.route('/api', route);

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
export type AppType = typeof app;
