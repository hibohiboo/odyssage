import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createChoiceNode, getChoiceNode, getChoicesByMessage, updateChoiceNode, deleteChoiceNode, createChoiceToEventRelationship, getEventFromChoice } from './choice';
import { createEventNode } from './event';

describe('Choice Node', () => {
  let session: Session;

  beforeEach(async () => {
    session = driver.session();
    // テスト用データをクリーンアップ
    await session.run('MATCH (n) DETACH DELETE n');
  });

  afterEach(async () => {
    await session.close();
  });

  it('正常なデータでChoiceノードが作成できる', async () => {
    // Arrange
    const choiceData = {
      id: 'choice1',
      text: '選択肢1',
      order: 1,
      messageId: 'message1',
      targetEventId: 'event1',
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
});
