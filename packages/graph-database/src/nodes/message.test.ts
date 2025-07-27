// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createMessageNode, getMessageNode } from './message';

describe('Message Node Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
    await session.close();
  });

  it('should create a message node with all properties', async () => {
    // Arrange
    const messageData = {
      id: 'test-message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'event-1',
    };

    // Act
    const result = await createMessageNode(session, messageData);

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('m');
    expect(node.properties.id).toBe('test-message-1');
    expect(node.properties.text).toBe('あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。');
    expect(node.properties.order).toBe(1);
    expect(node.properties.eventId).toBe('event-1');
  });

  it('should retrieve a message node by id', async () => {
    // Arrange
    const messageData = {
      id: 'test-message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'event-1',
    };
    await createMessageNode(session, messageData);

    // Act
    const result = await getMessageNode(session, 'test-message-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('m');
    expect(node.properties.id).toBe('test-message-1');
    expect(node.properties.text).toBe('あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。');
  });
});