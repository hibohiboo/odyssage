// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export interface MessageNodeData {
  id: string;
  text: string;
  order: number;
  eventId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createMessageNode(
  session: Session,
  data: MessageNodeData,
): Promise<Result> {
  const query = `
    CREATE (m:Message {
      id: $id,
      text: $text,
      order: $order,
      eventId: $eventId,
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN m
  `;

  return await session.run(query, {
    id: data.id,
    text: data.text,
    order: data.order,
    eventId: data.eventId,
  });
}

export async function getMessageNode(
  session: Session,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (m:Message {id: $id})
    RETURN m
  `;

  return await session.run(query, { id: messageId });
}

export async function updateMessageNode(
  session: Session,
  messageId: string,
  updates: Partial<MessageNodeData>,
): Promise<Result> {
  const setClause = Object.keys(updates)
    .map(key => `m.${key} = $${key}`)
    .join(', ');

  const query = `
    MATCH (m:Message {id: $id})
    SET ${setClause}, m.updatedAt = datetime()
    RETURN m
  `;

  return await session.run(query, { id: messageId, ...updates });
}

export async function deleteMessageNode(
  session: Session,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (m:Message {id: $id})
    DETACH DELETE m
  `;

  return await session.run(query, { id: messageId });
}