// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function navigateToEvent(
  session: Session,
  playerId: string,
  eventId: string,
): Promise<Result> {
  const query = `
    MERGE (player:Player {id: $playerId})
    WITH player
    MATCH (event:Event {id: $eventId})
    OPTIONAL MATCH (player)-[existing:VISITED]->()
    WITH player, event, count(existing) as visitCount
    CREATE (player)-[visit:VISITED {
      timestamp: datetime(),
      order: visitCount + 1
    }]->(event)
    RETURN visit, event
  `;

  return await session.run(query, { playerId, eventId });
}

export async function getPlayerPath(
  session: Session,
  playerId: string,
): Promise<Result> {
  const query = `
    MATCH (player:Player {id: $playerId})-[visit:VISITED]->(event:Event)
    RETURN event, visit
    ORDER BY visit.order
  `;

  return await session.run(query, { playerId });
}

export async function getAvailableChoices(
  session: Session,
  playerId: string,
): Promise<Result> {
  const query = `
    MATCH (player:Player {id: $playerId})-[lastVisit:VISITED]->(currentEvent:Event)
    WHERE NOT EXISTS((player)-[:VISITED {order: lastVisit.order + 1}]->())
    MATCH (currentEvent)-[:HAS_MESSAGE]->(message:Message)-[choice:CHOICE]->(nextEvent:Event)
    RETURN choice, nextEvent, message
    ORDER BY choice.text
  `;

  return await session.run(query, { playerId });
}

export async function getCurrentPlayerPosition(
  session: Session,
  playerId: string,
): Promise<Result> {
  const query = `
    MATCH (player:Player {id: $playerId})-[visit:VISITED]->(event:Event)
    WITH event, visit
    ORDER BY visit.order DESC
    LIMIT 1
    RETURN event as currentEvent, visit
  `;

  return await session.run(query, { playerId });
}

export async function validateStoryPath(
  session: Session,
  eventIds: string[],
): Promise<Result> {
  if (eventIds.length === 0) {
    return await session.run('RETURN false as isValid');
  }

  if (eventIds.length === 1) {
    const query = `
      OPTIONAL MATCH (event:Event {id: $eventId})
      RETURN event IS NOT NULL as isValid
    `;
    return await session.run(query, { eventId: eventIds[0] });
  }

  // 全イベントが存在するかチェック
  const checkEventsQuery = `
    WITH $eventIds as eventIds
    UNWIND eventIds as eventId
    OPTIONAL MATCH (event:Event {id: eventId})
    WITH collect(event) as events, size(eventIds) as expectedCount
    RETURN size([e IN events WHERE e IS NOT NULL]) = expectedCount as allEventsExist
  `;
  
  const eventsResult = await session.run(checkEventsQuery, { eventIds });
  if (!eventsResult.records[0].get('allEventsExist')) {
    return await session.run('RETURN false as isValid');
  }

  // パスの接続性をチェック
  const query = `
    WITH $eventIds as eventIds
    UNWIND range(0, size(eventIds) - 2) as i
    MATCH (current:Event {id: eventIds[i]})
    MATCH (next:Event {id: eventIds[i + 1]})
    OPTIONAL MATCH path = (current)-[:HAS_MESSAGE]->(message:Message)-[:CHOICE]->(next)
    WITH collect(path IS NOT NULL) as pathExists, size(eventIds) - 1 as expectedConnections
    RETURN size([p IN pathExists WHERE p = true]) = expectedConnections as isValid
  `;

  return await session.run(query, { eventIds });
}

export async function getReachableEvents(
  session: Session,
  startEventId: string,
  maxDepth: number = 5,
): Promise<Result> {
  const query = `
    MATCH (start:Event {id: $startEventId})
    MATCH path = (start)-[:HAS_MESSAGE|CHOICE*0..${maxDepth}]->(reachable:Event)
    RETURN DISTINCT reachable, length(path) as distance
    ORDER BY distance, reachable.title
  `;

  return await session.run(query, { startEventId });
}

export async function findPlayerChoiceHistory(
  session: Session,
  playerId: string,
): Promise<Result> {
  const query = `
    MATCH (player:Player {id: $playerId})-[visit:VISITED]->(event:Event)
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)-[choice:CHOICE]->(nextEvent:Event)
    WHERE EXISTS((player)-[:VISITED]->(nextEvent))
    RETURN event, message, choice, nextEvent, visit.order as visitOrder
    ORDER BY visit.order
  `;

  return await session.run(query, { playerId });
}