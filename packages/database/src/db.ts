import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as nodePostgresDrizzle } from 'drizzle-orm/postgres-js';
import type { NeonQueryFunction } from '@neondatabase/serverless';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

type NeonDBClient = NeonHttpDatabase<Record<string, never>> & {
  $client: NeonQueryFunction<false, false>;
};

let db: NeonDBClient | null = null;

export const getDb = (
  connectionString = process.env.NEON_CONNECTION_STRING!,
) => {
  if (connectionString.startsWith('postgres://test_user')) {
    console.log('testcontainersで起動したPostgreSQLコンテナを使用します');
    return nodePostgresDrizzle(connectionString) as unknown as NeonDBClient;
  }
  if (db != null) {
    return db;
  }
  if (
    connectionString ===
    'postgres://postgres:postgres@db.localtest.me:5432/main'
  ) {
    console.log('ローカルのPostgreSQLコンテナを使用します');
    neonConfig.fetchEndpoint = `http://db.localtest.me:4444/sql`;
    neonConfig.useSecureWebSocket = false;
  }
  if (connectionString.endsWith('5432/odyssage_rdb')) {
    console.log('Neon Localを使用します');
    neonConfig.fetchEndpoint = `http://db.localtest.me:5432/sql`;
  }
  const sql = neon(connectionString);
  db = drizzle({ client: sql });
  return db;
};
