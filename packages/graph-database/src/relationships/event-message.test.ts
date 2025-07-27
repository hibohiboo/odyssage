// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createEventMessageRelation, getEventMessages } from './event-message';

describe('Event-Message Relationship Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (e:Event {id: $eventId})-[r:HAS_MESSAGE]->(m:Message {id: $messageId}) 
      DELETE r
    `, { eventId: 'test-event-1', messageId: 'test-message-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (e:Event {id: $eventId})-[r:HAS_MESSAGE]->(m:Message {id: $messageId}) 
      DELETE r
    `, { eventId: 'test-event-1', messageId: 'test-message-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
    await session.close();
  });

  it('should create a HAS_MESSAGE relationship between event and message', async () => {
    // Arrange
    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'test-event-1',
    };

    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);

    // Act
    const result = await createEventMessageRelation(session, 'test-event-1', 'test-message-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_MESSAGE');
  });

  it('should retrieve all messages for an event', async () => {
    // Arrange
    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'test-event-1',
    };

    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);
    await createEventMessageRelation(session, 'test-event-1', 'test-message-1');

    // Act
    const result = await getEventMessages(session, 'test-event-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const message = result.records[0].get('message');
    expect(message.properties.id).toBe('test-message-1');
    expect(message.properties.text).toBe('あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。');
  });
});