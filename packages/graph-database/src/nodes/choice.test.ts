import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createChoiceNode, getChoiceNode, getChoicesByMessage } from './choice';

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
});
