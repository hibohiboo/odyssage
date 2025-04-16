import { createMiddleware } from 'hono/factory';
import { verifyJWT } from '../utils/verifyJWT';

// eslint-disable-next-line consistent-return
export const authorizeMiddleware = createMiddleware(async (c, next) => {
  if (c.env.CI === 'true') {
    console.log('CI mode: login as anonymous user');
    await next();
  } else if (c.env.CLOUDFLARE_ENV === 'test') {
    console.log('Test environment: bypassing authorization');
    await next();
  } else {
    const token = await verifyJWT(c.req.header('Authorization'), c.env);

    if (token == null) {
      return c.body('Unauthorized', 401);
    }
    // c.req.path = /api/user/hoge -- split --> ["", "api", "user", "hoge"]
    const [, , , uid] = c.req.path.split('/');

    if (!uid) {
      throw new Error('uid not found');
    }
    if (token.uid !== uid) {
      throw new Error(
        `uid does not match: param.uid:${uid}, token.uid: ${token.uid}`,
      );
    }
    await next();
  }
});
