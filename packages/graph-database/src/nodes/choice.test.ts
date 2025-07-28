import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createChoiceNode } from './choice';

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
});
