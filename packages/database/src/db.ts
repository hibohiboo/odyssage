import { neon } from '@neondatabase/serverless';
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
  const sql = neon(connectionString);
  db = drizzle({ client: sql });
  return db;
};
