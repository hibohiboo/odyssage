import {
  asc,
  desc,
  between,
  count,
  eq,
  getTableColumns,
  sql,
} from 'drizzle-orm';
import { getDb } from '../db';
import {
  SelectUser,
  usersTable,
  scenariosTable,
  sessionsTable,
} from '../schema';

export async function getUserById(
  connectionString: string,
  id: SelectUser['id'],
): Promise<Array<SelectUser>> {
  const db = getDb(connectionString);
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithScenariosCount(
  page = 1,
  pageSize = 5,
): Promise<
  Array<{
    scenariosCount: number;
    id: string;
  }>
> {
  const db = getDb();
  return db
    .select({
      ...getTableColumns(usersTable),
      scenariosCount: count(scenariosTable.id),
    })
    .from(usersTable)
    .leftJoin(scenariosTable, eq(usersTable.id, scenariosTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
export async function getScenariosForLast24Hours(
  page = 1,
  pageSize = 5,
): Promise<
  Array<{
    id: string;
    title: string;
  }>
> {
  const db = getDb();
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
    })
    .from(scenariosTable)
    .where(
      between(
        scenariosTable.createdAt,
        sql`now() - interval '1 day'`,
        sql`now()`,
      ),
    )
    .orderBy(asc(scenariosTable.title), asc(scenariosTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getScenarios(connectionString: string) {
  const db = getDb(connectionString);
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
    })
    .from(scenariosTable)
    .orderBy(asc(scenariosTable.userId), asc(scenariosTable.title));
}

export async function getScenariosByUid(connectionString: string, uid: string) {
  const db = getDb(connectionString);
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      overview: scenariosTable.overview,
      visibility: scenariosTable.visibility,
      updatedAt: scenariosTable.updatedAt,
    })
    .from(scenariosTable)
    .where(eq(scenariosTable.userId, uid))
    .orderBy(asc(scenariosTable.userId), asc(scenariosTable.title));
}

export async function getScenariosByid(connectionString: string, id: string) {
  const db = getDb(connectionString);
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      overview: scenariosTable.overview,
      visibility: scenariosTable.visibility,
      updatedAt: scenariosTable.updatedAt,
    })
    .from(scenariosTable)
    .where(eq(scenariosTable.id, id));
}

export async function getPublicScenarios(connectionString: string) {
  const db = getDb(connectionString);
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      overview: scenariosTable.overview,
      updatedAt: scenariosTable.updatedAt,
    })
    .from(scenariosTable)
    .where(eq(scenariosTable.visibility, 'public'))
    .orderBy(desc(scenariosTable.updatedAt));
}

export async function getSessionsByGmId(
  connectionString: string,
  gmId: string,
) {
  const db = getDb(connectionString);
  return db
    .select({
      id: sessionsTable.id,
      title: sessionsTable.title,
      status: sessionsTable.status,
      scenarioId: sessionsTable.scenarioId,
      createdAt: sessionsTable.createdAt,
      updatedAt: sessionsTable.updatedAt,
      scenarioTitle: scenariosTable.title,
    })
    .from(sessionsTable)
    .innerJoin(scenariosTable, eq(sessionsTable.scenarioId, scenariosTable.id))
    .where(eq(sessionsTable.gmId, gmId))
    .orderBy(desc(sessionsTable.updatedAt));
}

export async function getSessionById(connectionString: string, id: string) {
  const db = getDb(connectionString);
  return db
    .select({
      id: sessionsTable.id,
      title: sessionsTable.title,
      status: sessionsTable.status,
      gmId: sessionsTable.gmId,
      scenarioId: sessionsTable.scenarioId,
      createdAt: sessionsTable.createdAt,
      updatedAt: sessionsTable.updatedAt,
      scenarioTitle: scenariosTable.title,
    })
    .from(sessionsTable)
    .innerJoin(scenariosTable, eq(sessionsTable.scenarioId, scenariosTable.id))
    .where(eq(sessionsTable.id, id));
}
