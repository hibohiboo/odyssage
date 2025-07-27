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
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

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
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

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
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

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
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

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
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
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