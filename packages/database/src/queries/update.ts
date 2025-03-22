import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { scenariosTable } from '../schema';

export async function updateScenario(
  connectionString: string,
  data: { id: string; title: string; overview: string; visibility?: string },
) {
  const db = getDb(connectionString);
  const updateData: {
    title: string;
    overview: string;
    visibility?: string;
  } = {
    title: data.title,
    overview: data.overview,
  };

  if (data.visibility) {
    updateData.visibility = data.visibility;
  }

  await db
    .update(scenariosTable)
    .set(updateData)
    .where(eq(scenariosTable.id, data.id));
}
