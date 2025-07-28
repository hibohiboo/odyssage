// @copilot-context naming

/**
 * ドメインイベントの基底インターフェース
 */
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly version: number;
}

/**
 * ドメインイベントパブリッシャー
 */
export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishMany(events: DomainEvent[]): Promise<void>;
}

/**
 * ドメインイベントハンドラー
 */
export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

/**
 * イベントストア（永続化用インターフェース）
 */
export interface EventStore {
  append(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getAllEvents(eventTypes?: string[]): Promise<DomainEvent[]>;
}