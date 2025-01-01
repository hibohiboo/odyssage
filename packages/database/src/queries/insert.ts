import { db } from '../db';
import {
  InsertScenario,
  InsertUser,
  scenariosTable,
  usersTable,
} from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
export async function createScenario(data: InsertScenario) {
  await db.insert(scenariosTable).values(data);
}
