import { getDb } from '../db';
import {
  InsertScenario,
  InsertUser,
  scenariosTable,
  usersTable,
} from '../schema';

export async function upsertUser(connectionString: string, data: InsertUser) {
  const db = getDb(connectionString);
  await db
    .insert(usersTable)
    .values(data)
    .onConflictDoUpdate({ target: usersTable.id, set: { name: data.name } });
}
export async function createScenario(
  connectionString: string,
  data: InsertScenario,
) {
  const db = getDb(connectionString);
  await db.insert(scenariosTable).values(data);
}
