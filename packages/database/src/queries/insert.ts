import { getDb } from '../db';
import {
  InsertScenario,
  InsertUser,
  scenariosTable,
  usersTable,
} from '../schema';

export async function upsertUser(connectionString: string, data: InsertUser) {
  const db = getDb(connectionString);
  await db.insert(usersTable).values(data).onConflictDoNothing();
}
export async function createScenario(data: InsertScenario) {
  const db = getDb();
  await db.insert(scenariosTable).values(data);
}
