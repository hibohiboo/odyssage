import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

export async function execSql(connectionString: string, sqlText: string) {
  const db = drizzle(connectionString);
  await db.execute(sql.raw(sqlText));
}
