// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function createSceneEventRelation(
  session: Session,
  sceneId: string,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (scene:Scene {id: $sceneId})
    MATCH (event:Event {id: $eventId})
    CREATE (scene)-[r:HAS_EVENT]->(event)
    RETURN r
  `;

  return await session.run(query, {
    sceneId,
    eventId,
  });
}

export async function getSceneEvents(
  session: Session,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (scene:Scene {id: $sceneId})-[:HAS_EVENT]->(event:Event)
    RETURN event
    ORDER BY event.order
  `;

  return await session.run(query, { sceneId });
}

export async function deleteSceneEventRelation(
  session: Session,
  sceneId: string,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (scene:Scene {id: $sceneId})-[r:HAS_EVENT]->(event:Event {id: $eventId})
    DELETE r
  `;

  return await session.run(query, {
    sceneId,
    eventId,
  });
}

export async function getSceneWithEvents(
  session: Session,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (scene:Scene {id: $sceneId})
    OPTIONAL MATCH (scene)-[:HAS_EVENT]->(event:Event)
    RETURN scene, collect(event) as events
  `;

  return await session.run(query, { sceneId });
}