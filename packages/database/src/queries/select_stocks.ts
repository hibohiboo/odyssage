import { eq, and, desc, count } from 'drizzle-orm';
import { getDb } from '../db';
import { scenarioStockTable, scenariosTable } from '../schema';

/**
 * Gets all scenarios stocked by a user
 */
export async function getScenarioStocksByUserId(
  connectionString: string,
  userId: string,
) {
  const db = getDb(connectionString);
  return db
    .select({
      id: scenariosTable.id,
      title: scenariosTable.title,
      overview: scenariosTable.overview,
      stockedAt: scenarioStockTable.stockedAt,
    })
    .from(scenarioStockTable)
    .innerJoin(
      scenariosTable,
      eq(scenarioStockTable.scenarioId, scenariosTable.id),
    )
    .where(eq(scenarioStockTable.userId, userId))
    .orderBy(desc(scenarioStockTable.stockedAt));
}

/**
 * Checks if a scenario is stocked by a user
 */
export async function isScenarioStockedByUser(
  connectionString: string,
  userId: string,
  scenarioId: string,
) {
  const db = getDb(connectionString);
  const result = await db
    .select({ count: count() })
    .from(scenarioStockTable)
    .where(
      and(
        eq(scenarioStockTable.userId, userId),
        eq(scenarioStockTable.scenarioId, scenarioId),
      ),
    );
  return result[0].count > 0;
}
