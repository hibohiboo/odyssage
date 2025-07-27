// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export interface ScenarioNodeData {
  id: string;
  title: string;
  overview: string;
  userId: string;
  visibility: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createScenarioNode(
  session: Session,
  data: ScenarioNodeData,
): Promise<Result> {
  const query = `
    CREATE (s:Scenario {
      id: $id,
      title: $title,
      overview: $overview,
      userId: $userId,
      visibility: $visibility,
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN s
  `;

  return await session.run(query, {
    id: data.id,
    title: data.title,
    overview: data.overview,
    userId: data.userId,
    visibility: data.visibility,
  });
}

export async function getScenarioNode(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (s:Scenario {id: $id})
    RETURN s
  `;

  return await session.run(query, { id: scenarioId });
}

export async function updateScenarioNode(
  session: Session,
  scenarioId: string,
  updates: Partial<ScenarioNodeData>,
): Promise<Result> {
  const setClause = Object.keys(updates)
    .map(key => `s.${key} = $${key}`)
    .join(', ');

  const query = `
    MATCH (s:Scenario {id: $id})
    SET ${setClause}, s.updatedAt = datetime()
    RETURN s
  `;

  return await session.run(query, { id: scenarioId, ...updates });
}

export async function deleteScenarioNode(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (s:Scenario {id: $id})
    DETACH DELETE s
  `;

  return await session.run(query, { id: scenarioId });
}