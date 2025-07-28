// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function createEventMessageRelation(
  session: Session,
  eventId: string,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (event:Event {id: $eventId})
    MATCH (message:Message {id: $messageId})
    CREATE (event)-[r:HAS_MESSAGE]->(message)
    RETURN r
  `;

  return session.run(query, {
    eventId,
    messageId,
  });
}

export async function getEventMessages(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (event:Event {id: $eventId})-[:HAS_MESSAGE]->(message:Message)
    RETURN message
    ORDER BY message.order
  `;

  return session.run(query, { eventId });
}

export async function deleteEventMessageRelation(
  session: Session,
  eventId: string,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (event:Event {id: $eventId})-[r:HAS_MESSAGE]->(message:Message {id: $messageId})
    DELETE r
  `;

  return session.run(query, {
    eventId,
    messageId,
  });
}

export async function getEventWithMessages(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (event:Event {id: $eventId})
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    RETURN event, collect(message) as messages
  `;

  return session.run(query, { eventId });
}