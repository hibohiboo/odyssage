import * as path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

export async function setupDb(connectionString: string) {
  const db = drizzle(connectionString);

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../migrations'), // drizzle.config.tsで指定したものと同じ
  });
}
