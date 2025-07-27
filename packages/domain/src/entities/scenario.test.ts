// @copilot-context testing
import { describe, it, expect } from 'vitest';
import { Scenario } from './scenario';
import { Scene } from './scene';

describe('Scenario Entity', () => {
  it('should create a new scenario with required properties', () => {
    // Arrange
    const scenarioData = {
      id: 'scenario-1',
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private' as const,
    };

    // Act
    const scenario = new Scenario(scenarioData);

    // Assert
    expect(scenario.id).toBe('scenario-1');
    expect(scenario.title).toBe('テストシナリオ');
    expect(scenario.overview).toBe('これはテスト用のシナリオです');
    expect(scenario.userId).toBe('user-1');
    expect(scenario.visibility).toBe('private');
    expect(scenario.scenes).toEqual([]);
  });

  it('should add a scene to the scenario', () => {
    // Arrange
    const scenario = new Scenario({
      id: 'scenario-1',
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです',
      userId: 'user-1',
      visibility: 'private' as const,
    });

    const scene = new Scene({
      id: 'scene-1',
      title: '森の入り口',
      description: '深い森の入り口。木々が鬱蒼と茂っている。',
      order: 1,
      scenarioId: 'scenario-1',
    });

    // Act
    scenario.addScene(scene);

    // Assert
    expect(scenario.scenes).toHaveLength(1);
    expect(scenario.scenes[0].id).toBe('scene-1');
    expect(scenario.scenes[0].title).toBe('森の入り口');
  });
});
