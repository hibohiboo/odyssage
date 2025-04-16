import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { sessionsTable } from '../schema';

/**
 * セッションのステータスを更新する関数
 * @param connectionString データベース接続文字列
 * @param data セッションID、ステータス情報
 */
export async function updateSessionStatus(
  connectionString: string,
  data: { id: string; status: string },
) {
  const db = getDb(connectionString);
  await db
    .update(sessionsTable)
    .set({ status: data.status })
    .where(eq(sessionsTable.id, data.id));
}
