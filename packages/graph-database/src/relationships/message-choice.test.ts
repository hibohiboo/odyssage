// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { TestCleanupHelper } from '../test-utils/test-helpers';
import { createMessageChoiceRelation, getMessageChoices } from './message-choice';

describe('Message-Choice Relationship Operations', () => {
  let session: any;
  let cleanup: TestCleanupHelper;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
    
    // テスト開始前にクリーンアップを実行
    await cleanup.cleanup();
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should create a CHOICE relationship between message and target event', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('msg-choice-create');

    const eventData1 = {
      id: testIds.eventId,
      title: '最初のイベント',
      description: '最初のイベントです。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    const eventData2 = {
      id: testIds.eventId2!,
      title: '選択先のイベント',
      description: '選択肢で移動する先のイベントです。',
      order: 2,
      sceneId: testIds.sceneId,
    };

    const messageData = {
      id: testIds.messageId,
      text: 'どちらに進みますか？',
      order: 1,
      eventId: testIds.eventId,
    };

    await createEventNode(session, eventData1);
    await createEventNode(session, eventData2);
    await createMessageNode(session, messageData);

    // Act
    const result = await createMessageChoiceRelation(
      session, 
      testIds.messageId, 
      testIds.eventId2!,
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
    const testIds = cleanup.generateTestSpecificIdSet('msg-choice-get');

    const eventData1 = {
      id: testIds.eventId,
      title: '最初のイベント',
      description: '最初のイベントです。',
      order: 1,
      sceneId: testIds.sceneId,
    };

    const eventData2 = {
      id: testIds.eventId2!,
      title: '選択先のイベント',
      description: '選択肢で移動する先のイベントです。',
      order: 2,
      sceneId: testIds.sceneId,
    };

    const messageData = {
      id: testIds.messageId,
      text: 'どちらに進みますか？',
      order: 1,
      eventId: testIds.eventId,
    };

    await createEventNode(session, eventData1);
    await createEventNode(session, eventData2);
    await createMessageNode(session, messageData);
    await createMessageChoiceRelation(session, testIds.messageId, testIds.eventId2!, '森の奥へ進む');

    // Act
    const result = await getMessageChoices(session, testIds.messageId);

    // Assert
    expect(result.records).toHaveLength(1);
    const choice = result.records[0];
    expect(choice.get('choice').properties.text).toBe('森の奥へ進む');
    expect(choice.get('event').properties.id).toBe(testIds.eventId2!);
  });
});