// @copilot-context testing
import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { TestCleanupHelper } from '../test-utils/test-helpers';
import { createScenarioSceneRelation, getScenarioScenes } from './scenario-scene';

describe('Scenario-Scene Relationship Operations', () => {
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

  it('should create a HAS_SCENE relationship between scenario and scene', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('rel-create');
    
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

    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);

    // Act
    const result = await createScenarioSceneRelation(session, testIds.scenarioId, testIds.sceneId);

    // Assert
    expect(result.records).toHaveLength(1);
    const relation = result.records[0].get('r');
    expect(relation.type).toBe('HAS_SCENE');
  });

  it('should retrieve all scenes for a scenario', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('rel-get');
    
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

    await createScenarioNode(session, scenarioData);
    await createSceneNode(session, sceneData);
    await createScenarioSceneRelation(session, testIds.scenarioId, testIds.sceneId);

    // Act
    const result = await getScenarioScenes(session, testIds.scenarioId);

    // Assert
    expect(result.records).toHaveLength(1);
    const scene = result.records[0].get('scene');
    expect(scene.properties.id).toBe(testIds.sceneId);
    expect(scene.properties.title).toBe('森の入り口');
  });
});