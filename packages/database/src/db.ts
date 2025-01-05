import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonQueryFunction } from '@neondatabase/serverless';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type NeonDBClient = NeonHttpDatabase<Record<string, never>> & {
  $client: NeonQueryFunction<false, false>;
};

let db: NeonDBClient | null = null;

export const getDb = (
  connectionString = process.env.NEON_CONNECTION_STRING!,
) => {
  if (db != null) {
    return db;
  }
  if (
    connectionString ===
    'postgres://postgres:postgres@db.localtest.me:5432/main'
  ) {
    neonConfig.fetchEndpoint = `http://db.localtest.me:4444/sql`;
    neonConfig.useSecureWebSocket = false;
  }
  const sql = neon(connectionString);
  db = drizzle({ client: sql });
  return db;
};
