// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createEventMessageRelation, getEventMessages } from './event-message';
import { TestCleanupHelper, generateTestIdSet } from '../test-utils/test-helpers';

describe('Event-Message Relationship Operations', () => {
  let session: any;
  let cleanup: TestCleanupHelper;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should create a HAS_MESSAGE relationship between event and message', async () => {
    // Arrange
    const testIds = generateTestIdSet('event-msg-create');
    cleanup.addTestIdSet(testIds);
    
    const eventData = {
      id: testIds.eventId,
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    const messageData = {
      id: testIds.messageId,
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: testIds.eventId,
    };

    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);

    // Act
    const result = await createEventMessageRelation(session, testIds.eventId, testIds.messageId);

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_MESSAGE');
  });

  it('should retrieve all messages for an event', async () => {
    // Arrange
    const testIds = generateTestIdSet('event-msg-get');
    cleanup.addTestIdSet(testIds);
    
    const eventData = {
      id: testIds.eventId,
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    const messageData = {
      id: testIds.messageId,
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: testIds.eventId,
    };

    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);
    await createEventMessageRelation(session, testIds.eventId, testIds.messageId);

    // Act
    const result = await getEventMessages(session, testIds.eventId);

    // Assert
    expect(result.records).toHaveLength(1);
    const message = result.records[0].get('message');
    expect(message.properties.id).toBe(testIds.messageId);
    expect(message.properties.text).toBe('あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。');
  });
});