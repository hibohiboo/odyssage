// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { createScenarioSceneRelation, getScenarioScenes } from './scenario-scene';

describe('Scenario-Scene Relationship Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (s:Scenario {id: $scenarioId})-[r:HAS_SCENE]->(sc:Scene {id: $sceneId}) 
      DELETE r
    `, { scenarioId: 'test-scenario-1', sceneId: 'test-scene-1' });
    await session.run('MATCH (s:Scenario {id: $id}) DELETE s', { id: 'test-scenario-1' });
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (s:Scenario {id: $scenarioId})-[r:HAS_SCENE]->(sc:Scene {id: $sceneId}) 
      DELETE r
    `, { scenarioId: 'test-scenario-1', sceneId: 'test-scene-1' });
    await session.run('MATCH (s:Scenario {id: $id}) DELETE s', { id: 'test-scenario-1' });
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
    await session.close();
  });

  it('should create a HAS_SCENE relationship between scenario and scene', async () => {
    // Arrange
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

    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);

    // Act
    const result = await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_SCENE');
  });

  it('should retrieve all scenes for a scenario', async () => {
    // Arrange
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

    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');

    // Act
    const result = await getScenarioScenes(session, 'test-scenario-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const scene = result.records[0].get('scene');
    expect(scene.properties.id).toBe('test-scene-1');
    expect(scene.properties.title).toBe('森の入り口');
  });
});