import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { TestCleanupHelper } from '../test-utils/test-helpers';
import { createChoiceNode, getChoiceNode, getChoicesByMessage, updateChoiceNode, deleteChoiceNode, createChoiceToEventRelationship, getEventFromChoice, getChoicesLeadingToEvent, updateChoiceEventRelationship } from './choice';
import { createEventNode } from './event';

describe('Choice Node', () => {
  let session: Session;
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

  it('正常なデータでChoiceノードが作成できる', async () => {
    // Arrange
    const choiceId = cleanup.generateSuiteSpecificId('choice1');
    cleanup.addTestId(choiceId);
    
    const choiceData = {
      id: choiceId,
      text: '選択肢1',
      order: 1,
      messageId: cleanup.generateSuiteSpecificId('message1'),
      targetEventId: cleanup.generateSuiteSpecificId('event1'),
      conditions: undefined,
    };
    // Act
    const result = await createChoiceNode(session, choiceData);

    const createdChoice = result.records[0].get('c').properties;
    expect(result.records).toHaveLength(1);
    expect(createdChoice.id).toBe(choiceData.id);
    expect(createdChoice.text).toBe(choiceData.text);
    expect(createdChoice.order).toBe(choiceData.order);
    expect(createdChoice.messageId).toBe(choiceData.messageId);
    expect(createdChoice.targetEventId).toBe(choiceData.targetEventId);
    expect(createdChoice.conditions).toBe(choiceData.conditions);
    expect(createdChoice.createdAt).toBeDefined();
    expect(createdChoice.updatedAt).toBeDefined();
  });

  it('作成されたChoiceノードが取得できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice2',
      text: '選択肢2',
      order: 2,
      messageId: 'message2',
      targetEventId: 'event2',
      conditions: '{"requiresItem": "sword"}',
    };

    // 事前にChoiceノードを作成
    await createChoiceNode(session, choiceData);

    // Act
    const result = await getChoiceNode(session, choiceData.id);

    // Assert
    expect(result.records).toHaveLength(1);
    const retrievedChoice = result.records[0].get('c').properties;
    expect(retrievedChoice.id).toBe(choiceData.id);
    expect(retrievedChoice.text).toBe(choiceData.text);
    expect(retrievedChoice.order).toBe(choiceData.order);
    expect(retrievedChoice.messageId).toBe(choiceData.messageId);
    expect(retrievedChoice.targetEventId).toBe(choiceData.targetEventId);
    expect(retrievedChoice.conditions).toBe(choiceData.conditions);
  });

  it('messageIdでChoiceノード一覧が取得できる', async () => {
    // Arrange
    const messageId = 'message_shared';
    const choice1 = {
      id: 'choice3',
      text: '選択肢3',
      order: 1,
      messageId,
      targetEventId: 'event3',
      conditions: undefined,
    };
    const choice2 = {
      id: 'choice4', 
      text: '選択肢4',
      order: 2,
      messageId,
      targetEventId: 'event4',
      conditions: '{"requiresLevel": 5}',
    };

    // 事前に複数のChoiceノードを作成
    await createChoiceNode(session, choice1);
    await createChoiceNode(session, choice2);

    // Act
    const result = await getChoicesByMessage(session, messageId);

    // Assert
    expect(result.records).toHaveLength(2);
    
    // orderでソートされているか確認
    const choices = result.records.map(record => record.get('c').properties);
    expect(choices[0].order).toBe(1);
    expect(choices[1].order).toBe(2);
    
    // 各選択肢の内容確認
    expect(choices[0].id).toBe(choice1.id);
    expect(choices[0].text).toBe(choice1.text);
    expect(choices[1].id).toBe(choice2.id);
    expect(choices[1].text).toBe(choice2.text);
  });

  it('Choiceノードが更新できる', async () => {
    // Arrange
    const originalChoice = {
      id: 'choice5',
      text: '元の選択肢',
      order: 1,
      messageId: 'message5',
      targetEventId: 'event5',
      conditions: '{"original": true}',
    };

    // 事前にChoiceノードを作成
    await createChoiceNode(session, originalChoice);

    const updates = {
      text: '更新された選択肢',
      order: 2,
      conditions: '{"updated": true}',
    };

    // Act
    const updateResult = await updateChoiceNode(session, originalChoice.id, updates);

    // Assert
    expect(updateResult.records).toHaveLength(1);
    const updatedChoice = updateResult.records[0].get('c').properties;
    
    // 更新された値の確認
    expect(updatedChoice.text).toBe(updates.text);
    expect(updatedChoice.order).toBe(updates.order);
    expect(updatedChoice.conditions).toBe(updates.conditions);
    
    // 更新されない値の確認
    expect(updatedChoice.id).toBe(originalChoice.id);
    expect(updatedChoice.messageId).toBe(originalChoice.messageId);
    expect(updatedChoice.targetEventId).toBe(originalChoice.targetEventId);
    
    // updatedAtが更新されていることを確認
    expect(updatedChoice.updatedAt).toBeDefined();
  });

  it('Choiceノードが削除できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice6',
      text: '削除される選択肢',
      order: 1,
      messageId: 'message6',
      targetEventId: 'event6',
      conditions: undefined,
    };

    // 事前にChoiceノードを作成
    await createChoiceNode(session, choiceData);

    // 作成されたことを確認
    const beforeDelete = await getChoiceNode(session, choiceData.id);
    expect(beforeDelete.records).toHaveLength(1);

    // Act
    const deleteResult = await deleteChoiceNode(session, choiceData.id);

    // Assert
    expect(deleteResult.records).toHaveLength(0); // 削除操作は通常レコードを返さない

    // 削除されたことを確認
    const afterDelete = await getChoiceNode(session, choiceData.id);
    expect(afterDelete.records).toHaveLength(0);
  });

  it('Choice-[:LEADS_TO]->Eventリレーションシップが作成できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice7',
      text: 'リレーション用選択肢',
      order: 1,
      messageId: 'message7',
      targetEventId: 'event7',
      conditions: undefined,
    };

    const eventData = {
      id: 'event7',
      title: 'リレーション先イベント',
      description: 'この選択肢の遷移先イベント',
      order: 1,
      sceneId: 'scene7',
    };

    // ChoiceとEventノードを事前に作成
    await createChoiceNode(session, choiceData);
    await createEventNode(session, eventData);

    // Act
    const result = await createChoiceToEventRelationship(session, choiceData.id, eventData.id);

    // Assert
    expect(result.records).toHaveLength(1);
    const record = result.records[0];
    const choice = record.get('c').properties;
    const event = record.get('e').properties;

    expect(choice.id).toBe(choiceData.id);
    expect(event.id).toBe(eventData.id);

    // リレーションシップが実際に作成されているか確認
    const verifyQuery = `
      MATCH (c:Choice {id: $choiceId})-[r:LEADS_TO]->(e:Event {id: $eventId})
      RETURN c, r, e
    `;
    const verifyResult = await session.run(verifyQuery, { 
      choiceId: choiceData.id, 
      eventId: eventData.id 
    });
    
    expect(verifyResult.records).toHaveLength(1);
    const relationship = verifyResult.records[0].get('r');
    expect(relationship.type).toBe('LEADS_TO');
  });

  it('選択肢から遷移先イベントが取得できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice8',
      text: '取得テスト用選択肢',
      order: 1,
      messageId: 'message8',
      targetEventId: 'event8',
      conditions: undefined,
    };

    const eventData = {
      id: 'event8',
      title: '取得テスト用イベント',
      description: 'この選択肢の遷移先イベント',
      order: 1,
      sceneId: 'scene8',
    };

    // ChoiceとEventノードを作成し、リレーションシップを設定
    await createChoiceNode(session, choiceData);
    await createEventNode(session, eventData);
    await createChoiceToEventRelationship(session, choiceData.id, eventData.id);

    // Act
    const result = await getEventFromChoice(session, choiceData.id);

    // Assert
    expect(result.records).toHaveLength(1);
    const record = result.records[0];
    const choice = record.get('c').properties;
    const event = record.get('e').properties;

    expect(choice.id).toBe(choiceData.id);
    expect(event.id).toBe(eventData.id);
    expect(event.title).toBe(eventData.title);
    expect(event.description).toBe(eventData.description);
  });

  it('イベントに向かう選択肢一覧が取得できる', async () => {
    // Arrange
    const eventData = {
      id: 'event9',
      title: '共通遷移先イベント',
      description: '複数の選択肢からアクセス可能なイベント',
      order: 1,
      sceneId: 'scene9',
    };

    const choice1Data = {
      id: 'choice9a',
      text: '左の道を選ぶ',
      order: 1,
      messageId: 'message9a',
      targetEventId: 'event9',
      conditions: undefined,
    };

    const choice2Data = {
      id: 'choice9b',
      text: '右の道を選ぶ',
      order: 2,
      messageId: 'message9b',
      targetEventId: 'event9',
      conditions: undefined,
    };

    // ノードとリレーションシップを作成
    await createEventNode(session, eventData);
    await createChoiceNode(session, choice1Data);
    await createChoiceNode(session, choice2Data);
    await createChoiceToEventRelationship(session, choice1Data.id, eventData.id);
    await createChoiceToEventRelationship(session, choice2Data.id, eventData.id);

    // Act
    const result = await getChoicesLeadingToEvent(session, eventData.id);

    // Assert
    expect(result.records).toHaveLength(2);
    
    // orderでソートされているか確認
    const choices = result.records.map(record => record.get('c').properties);
    expect(choices[0].order).toBe(1);
    expect(choices[1].order).toBe(2);
    
    // 各選択肢の内容確認
    expect(choices[0].id).toBe(choice1Data.id);
    expect(choices[0].text).toBe(choice1Data.text);
    expect(choices[1].id).toBe(choice2Data.id);
    expect(choices[1].text).toBe(choice2Data.text);
    
    // 共通のイベントが返されることを確認
    const events = result.records.map(record => record.get('e').properties);
    expect(events[0].id).toBe(eventData.id);
    expect(events[1].id).toBe(eventData.id);
  });

  it('選択肢の遷移先を変更できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice10',
      text: '遷移先変更テスト選択肢',
      order: 1,
      messageId: 'message10',
      targetEventId: 'event10a',
      conditions: undefined,
    };

    const originalEventData = {
      id: 'event10a',
      title: '元の遷移先イベント',
      description: '最初の遷移先',
      order: 1,
      sceneId: 'scene10',
    };

    const newEventData = {
      id: 'event10b',
      title: '新しい遷移先イベント',
      description: '変更後の遷移先',
      order: 2,
      sceneId: 'scene10',
    };

    // ノードとリレーションシップを作成
    await createChoiceNode(session, choiceData);
    await createEventNode(session, originalEventData);
    await createEventNode(session, newEventData);
    await createChoiceToEventRelationship(session, choiceData.id, originalEventData.id);

    // 初期状態の確認
    const beforeUpdate = await getEventFromChoice(session, choiceData.id);
    expect(beforeUpdate.records).toHaveLength(1);
    expect(beforeUpdate.records[0].get('e').properties.id).toBe(originalEventData.id);

    // Act
    const result = await updateChoiceEventRelationship(session, choiceData.id, newEventData.id);

    // Assert
    expect(result.records).toHaveLength(1);
    const record = result.records[0];
    const updatedChoice = record.get('c').properties;
    const newEvent = record.get('newEvent').properties;

    expect(updatedChoice.id).toBe(choiceData.id);
    expect(updatedChoice.targetEventId).toBe(newEventData.id);
    expect(updatedChoice.updatedAt).toBeDefined();
    expect(newEvent.id).toBe(newEventData.id);

    // 変更後の遷移先が正しいことを確認
    const afterUpdate = await getEventFromChoice(session, choiceData.id);
    expect(afterUpdate.records).toHaveLength(1);
    expect(afterUpdate.records[0].get('e').properties.id).toBe(newEventData.id);
  });
});
