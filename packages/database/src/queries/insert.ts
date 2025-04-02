import { getDb } from '../db';
import {
  InsertScenario,
  InsertSession,
  InsertUser,
  scenariosTable,
  sessionsTable,
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

/**
 * GMがセッションを作成するための関数
 * @param connectionString データベース接続文字列
 * @param data セッションデータ
 * @returns 作成されたセッションのID
 */
export async function createSession(
  connectionString: string,
  data: InsertSession,
) {
  const db = getDb(connectionString);
  await db.insert(sessionsTable).values(data);
  return data.id;
}
