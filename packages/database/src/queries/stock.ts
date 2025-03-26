import { eq, and } from 'drizzle-orm';
import { getDb } from '../db';
import { scenarioStockTable } from '../schema';

// シナリオをストックに追加する
export const createScenarioStock = async (
  connectionString: string,
  data: {
    userId: string;
    scenarioId: string;
  },
) => {
  const client = getDb(connectionString);
  await client.insert(scenarioStockTable).values({
    userId: data.userId,
    scenarioId: data.scenarioId,
  });
};

// シナリオをストックから削除する
export const deleteScenarioStock = async (
  connectionString: string,
  data: {
    userId: string;
    scenarioId: string;
  },
) => {
  const client = getDb(connectionString);
  await client
    .delete(scenarioStockTable)
    .where(
      and(
        eq(scenarioStockTable.userId, data.userId),
        eq(scenarioStockTable.scenarioId, data.scenarioId),
      ),
    );
};
