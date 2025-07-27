// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createScenarioNode, getScenarioNode } from './scenario';

describe('Scenario Node Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run('MATCH (s:Scenario {id: $id}) DELETE s', { id: 'test-scenario-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run('MATCH (s:Scenario {id: $id}) DELETE s', { id: 'test-scenario-1' });
    await session.close();
  });

  it('should create a scenario node with all properties', async () => {
    // Arrange
    const scenarioData = {
      id: 'test-scenario-1',
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
    expect(node.properties.id).toBe('test-scenario-1');
    expect(node.properties.title).toBe('テストシナリオ');
    expect(node.properties.overview).toBe('これはテスト用のシナリオです');
    expect(node.properties.userId).toBe('user-1');
    expect(node.properties.visibility).toBe('private');
  });

  it('should retrieve a scenario node by id', async () => {
    // Arrange
    const scenarioData = {
      id: 'test-scenario-1',
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private',
    };
    await createScenarioNode(session, scenarioData);

    // Act
    const result = await getScenarioNode(session, 'test-scenario-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('s');
    expect(node.properties.id).toBe('test-scenario-1');
    expect(node.properties.title).toBe('テストシナリオ');
  });
});