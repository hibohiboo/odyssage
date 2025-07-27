// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createScenarioSceneRelation } from '../relationships/scenario-scene';
import { createSceneEventRelation } from '../relationships/scene-event';
import { createEventMessageRelation } from '../relationships/event-message';
import { createMessageChoiceRelation } from '../relationships/message-choice';
import { getCompleteScenarioStructure, getScenarioFlowPaths } from './scenario-structure';

describe('Scenario Structure Queries', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (s:Scenario {id: 'test-scenario-1'})
      DETACH DELETE s
    `);
    await session.run(`
      MATCH (sc:Scene {id: 'test-scene-1'})
      DETACH DELETE sc
    `);
    await session.run(`
      MATCH (e:Event {id: 'test-event-1'})
      DETACH DELETE e
    `);
    await session.run(`
      MATCH (e:Event {id: 'test-event-2'})
      DETACH DELETE e
    `);
    await session.run(`
      MATCH (m:Message {id: 'test-message-1'})
      DETACH DELETE m
    `);
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (s:Scenario {id: 'test-scenario-1'})
      DETACH DELETE s
    `);
    await session.run(`
      MATCH (sc:Scene {id: 'test-scene-1'})
      DETACH DELETE sc
    `);
    await session.run(`
      MATCH (e:Event {id: 'test-event-1'})
      DETACH DELETE e
    `);
    await session.run(`
      MATCH (e:Event {id: 'test-event-2'})
      DETACH DELETE e
    `);
    await session.run(`
      MATCH (m:Message {id: 'test-message-1'})
      DETACH DELETE m
    `);
    await session.close();
  });

  it('should retrieve complete scenario structure with all nested elements', async () => {
    // Arrange - 完全なシナリオ構造を作成
    const scenarioData = {
      id: 'test-scenario-1',
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };

    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'test-scenario-1',
    };

    const eventData = {
      id: 'test-event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'test-scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'test-event-1',
    };

    // ノードとリレーションを作成
    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData);
    await createMessageNode(session, messageData);

    await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');
    await createSceneEventRelation(session, 'test-scene-1', 'test-event-1');
    await createEventMessageRelation(session, 'test-event-1', 'test-message-1');

    // Act
    const result = await getCompleteScenarioStructure(session, 'test-scenario-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const record = result.records[0];
    const scenario = record.get('scenario');
    const scenes = record.get('scenes');
    const events = record.get('events');
    const messages = record.get('messages');

    expect(scenario.properties.id).toBe('test-scenario-1');
    expect(scenes).toHaveLength(1);
    expect(events).toHaveLength(1);
    expect(messages).toHaveLength(1);
  });

  it('should retrieve all possible flow paths in a scenario', async () => {
    // Arrange - 分岐のあるシナリオ構造を作成
    const scenarioData = {
      id: 'test-scenario-1',
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };

    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'test-scenario-1',
    };

    const eventData1 = {
      id: 'test-event-1',
      title: '選択の瞬間',
      description: '道が二股に分かれています。',
      order: 1,
      sceneId: 'test-scene-1',
    };

    const eventData2 = {
      id: 'test-event-2',
      title: '右の道',
      description: '右の道を進んだ結果。',
      order: 2,
      sceneId: 'test-scene-1',
    };

    const messageData = {
      id: 'test-message-1',
      text: 'どちらの道を選びますか？',
      order: 1,
      eventId: 'test-event-1',
    };

    // ノードとリレーションを作成
    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createEventNode(session, eventData1);
    await createEventNode(session, eventData2);
    await createMessageNode(session, messageData);

    await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');
    await createSceneEventRelation(session, 'test-scene-1', 'test-event-1');
    await createSceneEventRelation(session, 'test-scene-1', 'test-event-2');
    await createEventMessageRelation(session, 'test-event-1', 'test-message-1');
    await createMessageChoiceRelation(session, 'test-message-1', 'test-event-2', '右の道へ進む');

    // Act
    const result = await getScenarioFlowPaths(session, 'test-scenario-1');

    // Assert
    expect(result.records.length).toBeGreaterThan(0);
    const paths = result.records.map(record => record.get('path'));
    expect(paths.some(path => path.length > 1)).toBe(true); // 複数ノードからなるパスが存在
  });
});