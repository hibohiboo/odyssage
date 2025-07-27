// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode, getEventNode } from './event';

describe('Event Node Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.close();
  });

  it('should create an event node with all properties', async () => {
    // Arrange
    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'scene-1',
    };

    // Act
    const result = await createEventNode(session, eventData);

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('e');
    expect(node.properties.id).toBe('test-event-1');
    expect(node.properties.title).toBe('奇妙な音');
    expect(node.properties.description).toBe('森の奥から奇妙な音が聞こえる。');
    expect(node.properties.order).toBe(1);
    expect(node.properties.sceneId).toBe('scene-1');
  });

  it('should retrieve an event node by id', async () => {
    // Arrange
    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'scene-1',
    };
    await createEventNode(session, eventData);

    // Act
    const result = await getEventNode(session, 'test-event-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('e');
    expect(node.properties.id).toBe('test-event-1');
    expect(node.properties.title).toBe('奇妙な音');
  });
});