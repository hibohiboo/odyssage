import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { scenariosTable } from '../schema';

export async function updateScenario(
  connectionString: string,
  data: { id: string; title: string; overview: string },
) {
  const db = getDb(connectionString);
  await db
    .update(scenariosTable)
    .set({ title: data.title, overview: data.overview })
    .where(eq(scenariosTable.id, data.id));
}
