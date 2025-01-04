import { Auth, WorkersKVStoreSingle } from 'firebase-auth-cloudflare-workers';

import type { KVNamespace } from '@cloudflare/workers-types';
import type { EmulatorEnv, FirebaseIdToken } from 'firebase-auth-cloudflare-workers';

interface Bindings extends EmulatorEnv {
	FIREBASE_PROJECT_ID: string;
	PUBLIC_JWK_CACHE_KEY: string;
	PUBLIC_JWK_CACHE_KV: KVNamespace;
	FIREBASE_AUTH_EMULATOR_HOST: string;
}

export const verifyJWT = async (authorization: string | null | undefined, env: Bindings): Promise<FirebaseIdToken | null> => {
	if (authorization == null) {
		console.warn('No authorization header');
		return null;
	}

	const jwt = authorization.replace(/Bearer\s+/i, '');
	try {
		const auth = Auth.getOrInitialize(
			env.FIREBASE_PROJECT_ID,
			WorkersKVStoreSingle.getOrInitialize(env.PUBLIC_JWK_CACHE_KEY, env.PUBLIC_JWK_CACHE_KV),
		);
		const ret = await auth.verifyIdToken(jwt, false, env);
		return ret;
	} catch (e) {
		console.warn('FirebaseIdToken error');
		console.warn(e);
		return null;
	}
};
