// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function createMessageChoiceRelation(
  session: Session,
  messageId: string,
  targetEventId: string,
  choiceText: string,
): Promise<Result> {
  const query = `
    MATCH (message:Message {id: $messageId})
    MATCH (event:Event {id: $targetEventId})
    CREATE (message)-[r:CHOICE {text: $choiceText}]->(event)
    RETURN r
  `;

  return session.run(query, {
    messageId,
    targetEventId,
    choiceText,
  });
}

export async function getMessageChoices(
  session: Session,
  messageId: string,
): Promise<Result> {
  const query = `
    MATCH (message:Message {id: $messageId})-[choice:CHOICE]->(event:Event)
    RETURN choice, event
    ORDER BY choice.text
  `;

  return session.run(query, { messageId });
}

export async function deleteMessageChoiceRelation(
  session: Session,
  messageId: string,
  targetEventId: string,
): Promise<Result> {
  const query = `
    MATCH (message:Message {id: $messageId})-[r:CHOICE]->(event:Event {id: $targetEventId})
    DELETE r
  `;

  return session.run(query, {
    messageId,
    targetEventId,
  });
}

export async function updateChoiceText(
  session: Session,
  messageId: string,
  targetEventId: string,
  newText: string,
): Promise<Result> {
  const query = `
    MATCH (message:Message {id: $messageId})-[r:CHOICE]->(event:Event {id: $targetEventId})
    SET r.text = $newText
    RETURN r
  `;

  return session.run(query, {
    messageId,
    targetEventId,
    newText,
  });
}