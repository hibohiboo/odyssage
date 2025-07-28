// @copilot-context naming

import { IdGenerator } from '../utils/id-generator';
import type { DomainEvent } from './domain-event';

/**
 * ゲーム開始イベント
 */
export class GameStartedEvent implements DomainEvent {
  readonly eventId: string;

  readonly occurredAt: Date;

  readonly eventType = 'GameStarted';

  readonly version = 1;

  constructor(
    public readonly aggregateId: string, // プレイヤー進行状況ID
    public readonly userId: string,
    public readonly scenarioId: string,
    public readonly startEventId: string,
  ) {
    this.eventId = GameStartedEvent.generateEventId();
    this.occurredAt = new Date();
  }

  private static generateEventId(): string {
    return IdGenerator.generateEventId();
  }
}