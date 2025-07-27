// @copilot-context testing
import { describe, it, expect } from 'vitest';
import { Scenario } from './scenario';

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
});
