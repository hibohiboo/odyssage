import { getDb } from '../db';
import {
  InsertScenario,
  InsertUser,
  scenariosTable,
  usersTable,
} from '../schema';

export async function createUser(data: InsertUser) {
  const db = getDb();
  await db.insert(usersTable).values(data);
}
export async function createScenario(data: InsertScenario) {
  const db = getDb();
  await db.insert(scenariosTable).values(data);
}
