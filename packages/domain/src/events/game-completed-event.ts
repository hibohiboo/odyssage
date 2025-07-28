// @copilot-context naming

import { IdGenerator } from '../utils/id-generator';
import type { DomainEvent } from './domain-event';

/**
 * ゲーム完了イベント
 */
export class GameCompletedEvent implements DomainEvent {
  readonly eventId: string;

  readonly occurredAt: Date;

  readonly eventType = 'GameCompleted';

  readonly version = 1;

  constructor(
    public readonly aggregateId: string, // プレイヤー進行状況ID
    public readonly userId: string,
    public readonly scenarioId: string,
    public readonly finalEventId: string,
    public readonly playDuration: number, // ミリ秒
  ) {
    this.eventId = GameCompletedEvent.generateEventId();
    this.occurredAt = new Date();
  }

  private static generateEventId(): string {
    return IdGenerator.generateEventId();
  }
}