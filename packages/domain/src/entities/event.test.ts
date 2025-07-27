// @copilot-context testing
import { describe, it, expect } from 'vitest';
import { Event } from './event';

describe('Event Entity', () => {
  it('should create a new event with required properties', () => {
    // Arrange
    const eventData = {
      id: 'event-1',
      title: '奇妙な音',
      description: '森の奥から奇妙な音が聞こえる。',
      order: 1,
      sceneId: 'scene-1',
    };

    // Act
    const event = new Event(eventData);

    // Assert
    expect(event.id).toBe('event-1');
    expect(event.title).toBe('奇妙な音');
    expect(event.description).toBe('森の奥から奇妙な音が聞こえる。');
    expect(event.order).toBe(1);
    expect(event.sceneId).toBe('scene-1');
    expect(event.messages).toEqual([]);
  });
});