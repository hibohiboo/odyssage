// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

/**
 * イベント間のフロー関係性管理
 * シナリオの分岐・合流・直線進行を制御
 */

export interface FlowRelationshipData {
  relationshipType: 'NEXT' | 'BRANCHES_TO' | 'CONVERGES_TO';
  conditions?: string; // JSON文字列での条件設定
}

export async function createEventFlowRelationship(
  session: Session,
  fromEventId: string,
  toEventId: string,
  data: FlowRelationshipData,
): Promise<Result> {
  const query = `
    MATCH (from:Event {id: $fromEventId})
    MATCH (to:Event {id: $toEventId})
    CREATE (from)-[:${data.relationshipType} {
      conditions: $conditions,
      createdAt: datetime()
    }]->(to)
    RETURN from, to
  `;

  return session.run(query, {
    fromEventId,
    toEventId,
    conditions: data.conditions || null,
  });
}

export async function getNextEvents(
  session: Session,
  currentEventId: string,
): Promise<Result> {
  const query = `
    MATCH (current:Event {id: $currentEventId})-[r:NEXT|BRANCHES_TO]->(next:Event)
    RETURN next, r.conditions as conditions, type(r) as relationshipType
    ORDER BY next.order
  `;

  return session.run(query, { currentEventId });
}

export async function getPreviousEvents(
  session: Session,
  currentEventId: string,
): Promise<Result> {
  const query = `
    MATCH (prev:Event)-[r:NEXT|BRANCHES_TO|CONVERGES_TO]->(current:Event {id: $currentEventId})
    RETURN prev, r.conditions as conditions, type(r) as relationshipType
    ORDER BY prev.order
  `;

  return session.run(query, { currentEventId });
}

export async function getEventPath(
  session: Session,
  startEventId: string,
  endEventId: string,
): Promise<Result> {
  const query = `
    MATCH path = shortestPath(
      (start:Event {id: $startEventId})-[:NEXT|BRANCHES_TO|CONVERGES_TO*]->(end:Event {id: $endEventId})
    )
    RETURN path, length(path) as pathLength
  `;

  return session.run(query, { startEventId, endEventId });
}

export async function getAllPathsFromEvent(
  session: Session,
  startEventId: string,
  maxDepth: number = 10,
): Promise<Result> {
  const query = `
    MATCH path = (start:Event {id: $startEventId})-[:NEXT|BRANCHES_TO|CONVERGES_TO*1..${maxDepth}]->(end:Event)
    WHERE NOT (end)-[:NEXT|BRANCHES_TO|CONVERGES_TO]->()
    RETURN path, length(path) as pathLength
    ORDER BY pathLength
  `;

  return session.run(query, { startEventId });
}

export async function getEventsByReachability(
  session: Session,
  startEventId: string,
  maxHops: number = 5,
): Promise<Result> {
  const query = `
    MATCH (start:Event {id: $startEventId})-[:NEXT|BRANCHES_TO|CONVERGES_TO*0..${maxHops}]->(reachable:Event)
    RETURN DISTINCT reachable, 
           shortestPath((start)-[:NEXT|BRANCHES_TO|CONVERGES_TO*]->(reachable)) as shortestPath
    ORDER BY length(shortestPath)
  `;

  return session.run(query, { startEventId });
}

export async function deleteEventFlowRelationships(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (e:Event {id: $eventId})-[r:NEXT|BRANCHES_TO|CONVERGES_TO]-()
    DELETE r
    RETURN count(r) as deletedCount
  `;

  return session.run(query, { eventId });
}

export async function updateFlowRelationshipConditions(
  session: Session,
  fromEventId: string,
  toEventId: string,
  newConditions: string,
): Promise<Result> {
  const query = `
    MATCH (from:Event {id: $fromEventId})-[r:NEXT|BRANCHES_TO|CONVERGES_TO]->(to:Event {id: $toEventId})
    SET r.conditions = $newConditions, r.updatedAt = datetime()
    RETURN from, to, r
  `;

  return session.run(query, { fromEventId, toEventId, newConditions });
}
