import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export const getDb = (
  connectionString = process.env.NEON_CONNECTION_STRING!,
) => {
  const sql = neon(connectionString);
  const db = drizzle({ client: sql });
  return db;
};
