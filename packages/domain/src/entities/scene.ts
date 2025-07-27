// @copilot-context naming
import { Event } from './event';

export interface SceneProps {
  id: string;
  title: string;
  description: string;
  order: number;
  scenarioId: string;
  events?: Event[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Scene {
  readonly id: string;

  readonly scenarioId: string;

  private title_: string;

  private description_: string;

  private order_: number;

  private events_: Event[];

  readonly createdAt: Date;

  private updatedAt_: Date;

  constructor(props: SceneProps) {
    this.id = props.id;
    this.scenarioId = props.scenarioId;
    this.title_ = props.title;
    this.description_ = props.description;
    this.order_ = props.order;
    this.events_ = props.events || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt_ = props.updatedAt || new Date();
  }

  get title(): string {
    return this.title_;
  }

  get description(): string {
    return this.description_;
  }

  get order(): number {
    return this.order_;
  }

  get events(): Event[] {
    return [...this.events_];
  }

  get updatedAt(): Date {
    return this.updatedAt_;
  }

  updateTitle(title: string): void {
    this.title_ = title;
    this.updatedAt_ = new Date();
  }

  updateDescription(description: string): void {
    this.description_ = description;
    this.updatedAt_ = new Date();
  }

  updateOrder(order: number): void {
    this.order_ = order;
    this.updatedAt_ = new Date();
  }

  addEvent(event: Event): void {
    this.events_.push(event);
    this.updatedAt_ = new Date();
  }

  removeEvent(eventId: string): void {
    this.events_ = this.events_.filter(event => event.id !== eventId);
    this.updatedAt_ = new Date();
  }
}