// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createSceneNode, getSceneNode } from './scene';

describe('Scene Node Operations', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run('MATCH (s:Scene {id: $id}) DELETE s', { id: 'test-scene-1' });
    await session.close();
  });

  it('should create a scene node with all properties', async () => {
    // Arrange
    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    };

    // Act
    const result = await createSceneNode(session, sceneData);

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('s');
    expect(node.properties.id).toBe('test-scene-1');
    expect(node.properties.title).toBe('森の入り口');
    expect(node.properties.description).toBe('深い森の入り口。木々が鬱蒼と茂っている。');
    expect(node.properties.order).toBe(1);
    expect(node.properties.scenarioId).toBe('scenario-1');
  });

  it('should retrieve a scene node by id', async () => {
    // Arrange
    const sceneData = {
      id: 'test-scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    };
    await createSceneNode(session, sceneData);

    // Act
    const result = await getSceneNode(session, 'test-scene-1');

    // Assert
    expect(result.records).toHaveLength(1);
    const node = result.records[0].get('s');
    expect(node.properties.id).toBe('test-scene-1');
    expect(node.properties.title).toBe('森の入り口');
  });
});