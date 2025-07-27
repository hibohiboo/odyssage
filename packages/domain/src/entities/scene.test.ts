// @copilot-context testing
import { describe, it, expect } from 'vitest';
import { Scene } from './scene';

describe('Scene Entity', () => {
  it('should create a new scene with required properties', () => {
    // Arrange
    const sceneData = {
      id: 'scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    };

    // Act
    const scene = new Scene(sceneData);

    // Assert
    expect(scene.id).toBe('scene-1');
    expect(scene.title).toBe('森の入り口');
    expect(scene.description).toBe('深い森の入り口。木々が鬱蒼と茂っている。');
    expect(scene.order).toBe(1);
    expect(scene.scenarioId).toBe('scenario-1');
    expect(scene.events).toEqual([]);
  });
});