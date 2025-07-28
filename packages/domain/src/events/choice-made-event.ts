// @copilot-context naming

import { IdGenerator } from '../utils/id-generator';
import type { DomainEvent } from './domain-event';

/**
 * 選択実行イベント
 */
export class ChoiceMadeEvent implements DomainEvent {
  readonly eventId: string;

  readonly occurredAt: Date;

  readonly eventType = 'ChoiceMade';

  readonly version = 1;

  constructor(
    public readonly aggregateId: string, // プレイヤー進行状況ID
    public readonly userId: string,
    public readonly scenarioId: string,
    public readonly fromEventId: string,
    public readonly toEventId: string,
    public readonly choiceText: string,
  ) {
    this.eventId = ChoiceMadeEvent.generateEventId();
    this.occurredAt = new Date();
  }

  private static generateEventId(): string {
    return IdGenerator.generateEventId();
  }
}