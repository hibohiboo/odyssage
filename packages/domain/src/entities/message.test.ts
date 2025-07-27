// @copilot-context testing
import { describe, it, expect } from 'vitest';
import { Message } from './message';

describe('Message Entity', () => {
  it('should create a new message with required properties', () => {
    // Arrange
    const messageData = {
      id: 'message-1',
      text: 'あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。',
      order: 1,
      eventId: 'event-1',
    };

    // Act
    const message = new Message(messageData);

    // Assert
    expect(message.id).toBe('message-1');
    expect(message.text).toBe('あなたは森の入り口に立っています。奥から奇妙な音が聞こえます。');
    expect(message.order).toBe(1);
    expect(message.eventId).toBe('event-1');
    expect(message.choices).toEqual([]);
  });
});