// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function getCompleteScenarioStructure(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
    OPTIONAL MATCH (scene)-[:HAS_EVENT]->(event:Event)
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    RETURN 
      scenario,
      collect(DISTINCT scene) as scenes,
      collect(DISTINCT event) as events,
      collect(DISTINCT message) as messages
  `;

  return session.run(query, { scenarioId });
}

export async function getScenarioFlowPaths(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    MATCH path = (scenario)-[:HAS_SCENE*]->(scene:Scene)-[:HAS_EVENT*]->(event:Event)
    OPTIONAL MATCH choicePath = (event)-[:HAS_MESSAGE]->(message:Message)-[:CHOICE]->(nextEvent:Event)
    RETURN path, choicePath
  `;

  return session.run(query, { scenarioId });
}

export async function getScenarioHierarchy(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
    OPTIONAL MATCH (scene)-[:HAS_EVENT]->(event:Event)
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[choice:CHOICE]->(nextEvent:Event)
    RETURN 
      scenario,
      scene,
      event,
      message,
      choice,
      nextEvent
    ORDER BY scene.order, event.order, message.order
  `;

  return session.run(query, { scenarioId });
}

export async function getScenarioStats(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
    OPTIONAL MATCH (scene)-[:HAS_EVENT]->(event:Event)
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[:CHOICE]->(nextEvent:Event)
    RETURN 
      scenario.id as scenarioId,
      count(DISTINCT scene) as sceneCount,
      count(DISTINCT event) as eventCount,
      count(DISTINCT message) as messageCount,
      count(DISTINCT nextEvent) as choiceCount
  `;

  return session.run(query, { scenarioId });
}

export async function findShortestPath(
  session: Session,
  startEventId: string,
  endEventId: string,
): Promise<Result> {
  const query = `
    MATCH (start:Event {id: $startEventId})
    MATCH (end:Event {id: $endEventId})
    MATCH path = shortestPath((start)-[*]->(end))
    RETURN path, length(path) as pathLength
  `;

  return session.run(query, { startEventId, endEventId });
}

export async function getAllPossiblePaths(
  session: Session,
  scenarioId: string,
  maxDepth: number = 10,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)-[:HAS_EVENT]->(startEvent:Event)
    WHERE NOT EXISTS((startEvent)<-[:CHOICE]-())
    MATCH path = (startEvent)-[:HAS_MESSAGE|CHOICE*0..${maxDepth}]-(node)
    RETURN path, length(path) as pathLength
    ORDER BY pathLength
  `;

  return session.run(query, { scenarioId });
}