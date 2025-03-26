import { and, eq } from 'drizzle-orm';
import { getDb } from '../db';
import { InsertScenarioStock, scenarioStockTable } from '../schema';

/**
 * Creates a new scenario stock entry (user stocks a scenario)
 */
export async function createScenarioStock(data: InsertScenarioStock) {
  const db = getDb();
  await db.insert(scenarioStockTable).values(data);
}

/**
 * Removes a scenario stock entry (user unstocks a scenario)
 */
export async function deleteScenarioStock(
  connectionString: string,
  userId: string,
  scenarioId: string,
) {
  const db = getDb(connectionString);
  return db
    .delete(scenarioStockTable)
    .where(
      and(
        eq(scenarioStockTable.userId, userId),
        eq(scenarioStockTable.scenarioId, scenarioId),
      ),
    );
}
