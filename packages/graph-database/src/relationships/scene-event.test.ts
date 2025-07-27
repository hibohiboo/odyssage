// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createSceneNode } from '../nodes/scene';
import { createEventNode } from '../nodes/event';
import { createSceneEventRelation, getSceneEvents } from './scene-event';

describe('Scene-Event Relationship Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (s:Scene {id: $sceneId})-[r:HAS_EVENT]->(e:Event {id: $eventId}) 
      DELETE r
    `, { sceneId: 'test-scene-1', eventId: 'test-event-1' });
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (s:Scene {id: $sceneId})-[r:HAS_EVENT]->(e:Event {id: $eventId}) 
      DELETE r
    `, { sceneId: 'test-scene-1', eventId: 'test-event-1' });
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.close();
  });

  it('should create a HAS_EVENT relationship between scene and event', async () => {
    // Arrange
    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    };

    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'test-scene-1',
    };

    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);

    // Act
    const result = await createSceneEventRelation(session, 'test-scene-1', 'test-event-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_EVENT');
  });

  it('should retrieve all events for a scene', async () => {
    // Arrange
    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    };

    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'test-scene-1',
    };

    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);
    await createSceneEventRelation(session, 'test-scene-1', 'test-event-1');

    // Act
    const result = await getSceneEvents(session, 'test-scene-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const event = result.records[0].get('event');
    expect(event.properties.id).toBe('test-event-1');
    expect(event.properties.title).toBe('奇妙な音');
  });
});