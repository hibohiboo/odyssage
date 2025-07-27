// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createSceneNode } from '../nodes/scene';
import { createEventNode } from '../nodes/event';
import { createSceneEventRelation, getSceneEvents } from './scene-event';
import { TestCleanupHelper, generateTestIdSet } from '../test-utils/test-helpers';

describe('Scene-Event Relationship Operations', () => {
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

  it('should create a HAS_EVENT relationship between scene and event', async () => {
    // Arrange
    const testIds = generateTestIdSet('scene-event-create');
    cleanup.addTestIdSet(testIds);
    
    const sceneData = {
      id: testIds.sceneId,
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: testIds.scenarioId,
    };

    const eventData = {
      id: testIds.eventId,
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);

    // Act
    const result = await createSceneEventRelation(session, testIds.sceneId, testIds.eventId);

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_EVENT');
  });

  it('should retrieve all events for a scene', async () => {
    // Arrange
    const testIds = generateTestIdSet('scene-event-get');
    cleanup.addTestIdSet(testIds);
    
    const sceneData = {
      id: testIds.sceneId,
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: testIds.scenarioId,
    };

    const eventData = {
      id: testIds.eventId,
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);
    await createSceneEventRelation(session, testIds.sceneId, testIds.eventId);

    // Act
    const result = await getSceneEvents(session, testIds.sceneId);

    // Assert
    expect(result.records).toHaveLength(1);
    const event = result.records[0].get('event');
    expect(event.properties.id).toBe(testIds.eventId);
    expect(event.properties.title).toBe('奇妙な音');
  });
});