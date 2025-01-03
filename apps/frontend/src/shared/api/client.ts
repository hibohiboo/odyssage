import type { AppType } from '@odyssage/backend/index';
import { hc } from 'hono/client';
import { getIdToken } from '../lib/auth/firebaseAuth';
import { BACKEND_DOMAIN } from '../lib/config';

export const apiClient = hc<AppType>(BACKEND_DOMAIN, {
  headers: async () => ({ authorization: `Bearer ${await getIdToken()}` }),
});
export type ApiClient = typeof apiClient;
