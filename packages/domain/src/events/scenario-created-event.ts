// @copilot-context naming

import type { DomainEvent } from './domain-event';

/**
 * シナリオ作成イベント
 */
export class ScenarioCreatedEvent implements DomainEvent {
  readonly eventId: string;

  readonly occurredAt: Date;

  readonly eventType = 'ScenarioCreated';

  readonly version = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly visibility: string,
  ) {
    this.eventId = ScenarioCreatedEvent.generateEventId();
    this.occurredAt = new Date();
  }

  private static generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}