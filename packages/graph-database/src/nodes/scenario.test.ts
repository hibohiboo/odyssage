// @copilot-context testing
import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { TestCleanupHelper, generateTestIdSet } from '../test-utils/test-helpers';
import { createScenarioNode, getScenarioNode } from './scenario';

describe('Scenario Node Operations', () => {
  let session: Session;
  let cleanup: TestCleanupHelper;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should create a scenario node with all properties', async () => {
    // Arrange
    const testIds = generateTestIdSet('scenario-create');
    cleanup.addTestId(testIds.scenarioId);
    
    const scenarioData = {
      id: testIds.scenarioId,
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };

    // Act
    const result = await createScenarioNode(session, scenarioData);

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('s');
    expect(node.properties.id).toBe(testIds.scenarioId);
    expect(node.properties.title).toBe('テストシナリオ');
    expect(node.properties.overview).toBe('これはテスト用のシナリオです');
    expect(node.properties.userId).toBe('user-1');
    expect(node.properties.visibility).toBe('private');
  });

  it('should retrieve a scenario node by id', async () => {
    // Arrange
    const testIds = generateTestIdSet('scenario-get');
    cleanup.addTestId(testIds.scenarioId);
    
    const scenarioData = {
      id: testIds.scenarioId,
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };
    await createScenarioNode(session, scenarioData);

    // Act
    const result = await getScenarioNode(session, testIds.scenarioId);

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('s');
    expect(node.properties.id).toBe(testIds.scenarioId);
    expect(node.properties.title).toBe('テストシナリオ');
  });
});