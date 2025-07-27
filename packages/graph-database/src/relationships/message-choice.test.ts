// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createMessageChoiceRelation, getMessageChoices } from './message-choice';

describe('Message-Choice Relationship Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (m1:Message {id: $messageId1})-[r:CHOICE]->(e:Event {id: $eventId}) 
      DELETE r
    `, { messageId1: 'test-message-1', eventId: 'test-event-2' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-2' });
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (m1:Message {id: $messageId1})-[r:CHOICE]->(e:Event {id: $eventId}) 
      DELETE r
    `, { messageId1: 'test-message-1', eventId: 'test-event-2' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-1' });
    await session.run('MATCH (e:Event {id: $id}) DELETE e', { id: 'test-event-2' });
    await session.run('MATCH (m:Message {id: $id}) DELETE m', { id: 'test-message-1' });
    await session.close();
  });

  it('should create a CHOICE relationship between message and target event', async () => {
    // Arrange
    const eventData1 = {
      id: 'test-event-1',
      title: '最初のイベント',
      description: '最初のイベントです。',
      order: 1,
      sceneId: 'scene-1',
    };

    const eventData2 = {
      id: 'test-event-2',
      title: '選択先のイベント',
      description: '選択肢で移動する先のイベントです。',
      order: 2,
      sceneId: 'scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'どちらに進みますか？',
      order: 1,
      eventId: 'test-event-1',
    };

    await createEventNode(session, eventData1);
    await createEventNode(session, eventData2);
    await createMessageNode(session, messageData);

    // Act
    const result = await createMessageChoiceRelation(
      session, 
      'test-message-1', 
      'test-event-2',
      '森の奥へ進む'
    );

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('CHOICE');
    expect(relation.properties.text).toBe('森の奥へ進む');
  });

  it('should retrieve all choice targets for a message', async () => {
    // Arrange
    const eventData1 = {
      id: 'test-event-1',
      title: '最初のイベント',
      description: '最初のイベントです。',
      order: 1,
      sceneId: 'scene-1',
    };

    const eventData2 = {
      id: 'test-event-2',
      title: '選択先のイベント',
      description: '選択肢で移動する先のイベントです。',
      order: 2,
      sceneId: 'scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'どちらに進みますか？',
      order: 1,
      eventId: 'test-event-1',
    };

    await createEventNode(session, eventData1);
    await createEventNode(session, eventData2);
    await createMessageNode(session, messageData);
    await createMessageChoiceRelation(session, 'test-message-1', 'test-event-2', '森の奥へ進む');

    // Act
    const result = await getMessageChoices(session, 'test-message-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const choice = result.records[0];
    expect(choice.get('choice').properties.text).toBe('森の奥へ進む');
    expect(choice.get('event').properties.id).toBe('test-event-2');
  });
});