// @copilot-context naming

import { IdGenerator } from '../utils/id-generator';
import type { DomainEvent } from './domain-event';

/**
 * シナリオ公開イベント
 */
export class ScenarioPublishedEvent implements DomainEvent {
  readonly eventId: string;

  readonly occurredAt: Date;

  readonly eventType = 'ScenarioPublished';

  readonly version = 1;

  constructor(
    public readonly aggregateId: string,
    public readonly userId: string,
    public readonly title: string,
  ) {
    this.eventId = ScenarioPublishedEvent.generateEventId();
    this.occurredAt = new Date();
  }

  private static generateEventId(): string {
    return IdGenerator.generateEventId();
  }
}