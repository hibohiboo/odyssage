// @copilot-context testing
import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { createEventMessageRelation } from '../relationships/event-message';
import { createMessageChoiceRelation } from '../relationships/message-choice';
import { createScenarioSceneRelation } from '../relationships/scenario-scene';
import { createSceneEventRelation } from '../relationships/scene-event';
import { TestCleanupHelper } from '../test-utils/test-helpers';
import { getCompleteScenarioStructure, getScenarioFlowPaths } from './scenario-structure';

describe('Scenario Structure Queries', () => {
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

  it('should retrieve complete scenario structure with all nested elements', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('scenario-structure-complete');

    const scenarioData = {
      id: testIds.scenarioId,
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };

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

    const messageData = {
      id: testIds.messageId,
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: testIds.eventId,
    };

    // ノードとリレーションを作成
    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);

    await createScenarioSceneRelation(session, testIds.scenarioId, testIds.sceneId);
    await createSceneEventRelation(session, testIds.sceneId, testIds.eventId);
    await createEventMessageRelation(session, testIds.eventId, testIds.messageId);

    // Act
    const result = await getCompleteScenarioStructure(session, testIds.scenarioId);

    // Assert
    expect(result.records).toHaveLength(1);
    const record = result.records[0];
    const scenario = record.get('scenario');
    const scenes = record.get('scenes');
    const events = record.get('events');
    const messages = record.get('messages');

    expect(scenario.properties.id).toBe(testIds.scenarioId);
    expect(scenes).toHaveLength(1);
    expect(events).toHaveLength(1);
    expect(messages).toHaveLength(1);
  });

  it('should retrieve all possible flow paths in a scenario', async () => {
    // Arrange - 分岐のあるシナリオ構造を作成
    const testIds = cleanup.generateTestSpecificIdSet('scenario-structure-paths');

    const scenarioData = {
      id: testIds.scenarioId,
      title: '分岐テストシナリオ',
      overview: '選択肢によって分岐するシナリオ',
      userId: 'user-1',
      visibility: 'private',
    };

    const sceneData = {
      id: testIds.sceneId,
      title: '分岐点',
      description: '道が二つに分かれている。',
      order: 1,
      scenarioId: testIds.scenarioId,
    };

    const event1Data = {
      id: testIds.eventId,
      title: '選択イベント',
      description: 'どちらの道を選びますか？',
      order: 1,
      sceneId: testIds.sceneId,
    };

    const event2Data = {
      id: testIds.eventId2!,
      title: '結果イベント',
      description: '選択の結果です。',
      order: 2,
      sceneId: testIds.sceneId,
    };

    const messageData1 = {
      id: testIds.messageId,
      text: '分かれ道に到着しました。どちらに進みますか？',
      order: 1,
      eventId: testIds.eventId,
    };

    const messageData2 = {
      id: testIds.messageId2!,
      text: '道を選んだ結果です。',
      order: 1,
      eventId: testIds.eventId2!,
    };

    // ノードとリレーションを作成
    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createEventNode(session, event1Data);
    await createEventNode(session, event2Data);
    await createMessageNode(session, messageData1);
    await createMessageNode(session, messageData2);

    await createScenarioSceneRelation(session, testIds.scenarioId, testIds.sceneId);
    await createSceneEventRelation(session, testIds.sceneId, testIds.eventId);
    await createSceneEventRelation(session, testIds.sceneId, testIds.eventId2!);
    await createEventMessageRelation(session, testIds.eventId, testIds.messageId);
    await createEventMessageRelation(session, testIds.eventId2!, testIds.messageId2!);
    await createMessageChoiceRelation(session, testIds.messageId, testIds.eventId2!, '右の道へ進む');

    // Act
    const result = await getScenarioFlowPaths(session, testIds.scenarioId);

    // Assert
    expect(result.records.length).toBeGreaterThan(0);
    const paths = result.records.map(record => record.get('path'));
    expect(paths.length).toBeGreaterThan(0);
  });
});