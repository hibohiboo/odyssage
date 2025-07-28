// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

/**
 * 選択肢からイベントへの関係性管理
 * フロー制御の核となる重要なリレーションシップ
 */

export async function createChoiceToEventRelationship(
  session: Session,
  choiceId: string,
  targetEventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})
    MATCH (e:Event {id: $targetEventId})
    CREATE (c)-[:LEADS_TO]->(e)
    RETURN c, e
  `;

  return await session.run(query, { choiceId, targetEventId });
}

export async function getTargetEventByChoice(
  session: Session,
  choiceId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})-[:LEADS_TO]->(e:Event)
    RETURN e
  `;

  return await session.run(query, { choiceId });
}

export async function getChoicesLeadingToEvent(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice)-[:LEADS_TO]->(e:Event {id: $eventId})
    RETURN c
    ORDER BY c.order
  `;

  return await session.run(query, { eventId });
}

export async function updateChoiceTarget(
  session: Session,
  choiceId: string,
  newTargetEventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})-[r:LEADS_TO]->()
    DELETE r
    WITH c
    MATCH (e:Event {id: $newTargetEventId})
    CREATE (c)-[:LEADS_TO]->(e)
    RETURN c, e
  `;

  return await session.run(query, { choiceId, newTargetEventId });
}

export async function deleteChoiceToEventRelationships(
  session: Session,
  choiceId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})-[r:LEADS_TO]->()
    DELETE r
    RETURN count(r) as deletedCount
  `;

  return await session.run(query, { choiceId });
}
