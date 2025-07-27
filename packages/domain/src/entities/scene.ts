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
  private _title: string;
  private _description: string;
  private _order: number;
  private _events: Event[];
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor(props: SceneProps) {
    this.id = props.id;
    this.scenarioId = props.scenarioId;
    this._title = props.title;
    this._description = props.description;
    this._order = props.order;
    this._events = props.events || [];
    this.createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get order(): number {
    return this._order;
  }

  get events(): Event[] {
    return [...this._events];
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this._order = order;
    this._updatedAt = new Date();
  }

  addEvent(event: Event): void {
    this._events.push(event);
    this._updatedAt = new Date();
  }

  removeEvent(eventId: string): void {
    this._events = this._events.filter(event => event.id !== eventId);
    this._updatedAt = new Date();
  }
}