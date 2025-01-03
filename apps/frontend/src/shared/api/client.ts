import type { AppType } from '@odyssage/backend/index';
import { hc } from 'hono/client';
import { BACKEND_DOMAIN } from '../lib/config';

export const apiClient = hc<AppType>(BACKEND_DOMAIN);
export type ApiClient = typeof apiClient;
