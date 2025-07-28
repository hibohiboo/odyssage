// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export interface EventNodeData {
  id: string;
  title: string;
  description: string;
  order: number;
  sceneId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createEventNode(
  session: Session,
  data: EventNodeData,
): Promise<Result> {
  const query = `
    CREATE (e:Event {
      id: $id,
      title: $title,
      description: $description,
      order: $order,
      sceneId: $sceneId,
      createdAt: datetime(),
      updatedAt: datetime()
    })
    RETURN e
  `;

  return session.run(query, {
    id: data.id,
    title: data.title,
    description: data.description,
    order: data.order,
    sceneId: data.sceneId,
  });
}

export async function getEventNode(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (e:Event {id: $id})
    RETURN e
  `;

  return session.run(query, { id: eventId });
}

export async function updateEventNode(
  session: Session,
  eventId: string,
  updates: Partial<EventNodeData>,
): Promise<Result> {
  const setClause = Object.keys(updates)
    .map(key => `e.${key} = $${key}`)
    .join(', ');

  const query = `
    MATCH (e:Event {id: $id})
    SET ${setClause}, e.updatedAt = datetime()
    RETURN e
  `;

  return session.run(query, { id: eventId, ...updates });
}

export async function deleteEventNode(
  session: Session,
  eventId: string,
): Promise<Result> {
  const query = `
    MATCH (e:Event {id: $id})
    DETACH DELETE e
  `;

  return session.run(query, { id: eventId });
}