// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export interface SceneNodeData {
  id: string;
  title: string;
  description: string;
  order: number;
  scenarioId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createSceneNode(
  session: Session,
  data: SceneNodeData,
): Promise<Result> {
  const query = `
    CREATE (s:Scene {
      id: $id,
      title: $title,
      description: $description,
      order: $order,
      scenarioId: $scenarioId,
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN s
  `;

  return session.run(query, {
    id: data.id,
    title: data.title,
    description: data.description,
    order: data.order,
    scenarioId: data.scenarioId,
  });
}

export async function getSceneNode(
  session: Session,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (s:Scene {id: $id})
    RETURN s
  `;

  return session.run(query, { id: sceneId });
}

export async function updateSceneNode(
  session: Session,
  sceneId: string,
  updates: Partial<SceneNodeData>,
): Promise<Result> {
  const setClause = Object.keys(updates)
    .map(key => `s.${key} = $${key}`)
    .join(', ');

  const query = `
    MATCH (s:Scene {id: $id})
    SET ${setClause}, s.updatedAt = datetime()
    RETURN s
  `;

  return session.run(query, { id: sceneId, ...updates });
}

export async function deleteSceneNode(
  session: Session,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (s:Scene {id: $id})
    DETACH DELETE s
  `;

  return session.run(query, { id: sceneId });
}