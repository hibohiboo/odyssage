// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export interface ChoiceNodeData {
  id: string;
  text: string;
  order: number;
  messageId: string;
  targetEventId: string;
  conditions?: string; // JSON文字列での条件設定
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createChoiceNode(
  session: Session,
  data: ChoiceNodeData,
): Promise<Result> {
  const query = `
    CREATE (c:Choice {
      id: $id,
      text: $text,
      order: $order,
      messageId: $messageId,
      targetEventId: $targetEventId,
      conditions: $conditions,
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN c
  `;

  return await session.run(query, {
    id: data.id,
    text: data.text,
    order: data.order,
    messageId: data.messageId,
    targetEventId: data.targetEventId,
    conditions: data.conditions || null,
  });
}

export async function getChoiceNode(
  session: Session,
  choiceId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $id})
    RETURN c
  `;

  return await session.run(query, { id: choiceId });
}

export async function getChoicesByMessage(
  session: Session,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {messageId: $messageId})
    RETURN c
    ORDER BY c.order
  `;

  return await session.run(query, { messageId });
}

export async function updateChoiceNode(
  session: Session,
  choiceId: string,
  updates: Partial<ChoiceNodeData>,
): Promise<Result> {
  const setClause = Object.keys(updates)
    .map((key) => `c.${key} = $${key}`)
    .join(', ');

  const query = `
    MATCH (c:Choice {id: $id})
    SET ${setClause}, c.updatedAt = datetime()
    RETURN c
  `;

  return await session.run(query, { id: choiceId, ...updates });
}

export async function deleteChoiceNode(
  session: Session,
  choiceId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $id})
    DETACH DELETE c
  `;

  return await session.run(query, { id: choiceId });
}

export async function createChoiceToEventRelationship(
  session: Session,
  choiceId: string,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})
    MATCH (e:Event {id: $eventId})
    CREATE (c)-[:LEADS_TO]->(e)
    RETURN c, e
  `;

  return await session.run(query, { choiceId, eventId });
}

export async function getEventFromChoice(
  session: Session,
  choiceId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})-[:LEADS_TO]->(e:Event)
    RETURN c, e
  `;

  return await session.run(query, { choiceId });
}

export async function getChoicesLeadingToEvent(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice)-[:LEADS_TO]->(e:Event {id: $eventId})
    RETURN c, e
    ORDER BY c.order
  `;

  return await session.run(query, { eventId });
}

export async function updateChoiceEventRelationship(
  session: Session,
  choiceId: string,
  newEventId: string,
): Promise<Result> {
  const query = `
    MATCH (c:Choice {id: $choiceId})
    MATCH (newEvent:Event {id: $newEventId})
    OPTIONAL MATCH (c)-[oldRel:LEADS_TO]->()
    DELETE oldRel
    CREATE (c)-[:LEADS_TO]->(newEvent)
    SET c.targetEventId = $newEventId, c.updatedAt = datetime()
    RETURN c, newEvent
  `;

  return await session.run(query, { choiceId, newEventId });
}
