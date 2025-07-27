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

  #title: string;

  #description: string;

  #order: number;

  #events: Event[];

  readonly createdAt: Date;

  #updatedAt: Date;

  constructor(props: SceneProps) {
    this.id = props.id;
    this.scenarioId = props.scenarioId;
    this.#title = props.title;
    this.#description = props.description;
    this.#order = props.order;
    this.#events = props.events || [];
    this.createdAt = props.createdAt || new Date();
    this.#updatedAt = props.updatedAt || new Date();
  }

  get title(): string {
    return this.#title;
  }

  get description(): string {
    return this.#description;
  }

  get order(): number {
    return this.#order;
  }

  get events(): Event[] {
    return [...this.#events];
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  updateTitle(title: string): void {
    this.#title = title;
    this.#updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.#description = description;
    this.#updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this.#order = order;
    this.#updatedAt = new Date();
  }

  addEvent(event: Event): void {
    this.#events.push(event);
    this.#updatedAt = new Date();
  }

  removeEvent(eventId: string): void {
    this.#events = this.#events.filter(event => event.id !== eventId);
    this.#updatedAt = new Date();
  }
}