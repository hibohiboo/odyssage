// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function createScenarioSceneRelation(
  session: Session,
  scenarioId: string,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    MATCH (scene:Scene {id: $sceneId})
    CREATE (scenario)-[r:HAS_SCENE]->(scene)
    RETURN r
  `;

  return await session.run(query, {
    scenarioId,
    sceneId,
  });
}

export async function getScenarioScenes(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)
    RETURN scene
    ORDER BY scene.order
  `;

  return await session.run(query, { scenarioId });
}

export async function deleteScenarioSceneRelation(
  session: Session,
  scenarioId: string,
  sceneId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})-[r:HAS_SCENE]->(scene:Scene {id: $sceneId})
    DELETE r
  `;

  return await session.run(query, {
    scenarioId,
    sceneId,
  });
}

export async function getScenarioWithScenes(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
    RETURN scenario, collect(scene) as scenes
  `;

  return await session.run(query, { scenarioId });
}