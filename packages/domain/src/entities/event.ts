// @copilot-context naming
import { Message } from './message';

export interface EventProps {
  id: string;
  title: string;
  description: string;
  order: number;
  sceneId: string;
  messages?: Message[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Event {
  readonly id: string;

  readonly sceneId: string;

  #title: string;

  #description: string;

  #order: number;

  #messages: Message[];

  readonly createdAt: Date;

  #updatedAt: Date;

  constructor(props: EventProps) {
    this.id = props.id;
    this.sceneId = props.sceneId;
    this.#title = props.title;
    this.#description = props.description;
    this.#order = props.order;
    this.#messages = props.messages || [];
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

  get messages(): Message[] {
    return [...this.#messages];
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

  addMessage(message: Message): void {
    this.#messages.push(message);
    this.#updatedAt = new Date();
  }

  removeMessage(messageId: string): void {
    this.#messages = this.#messages.filter(
      (message) => message.id !== messageId,
    );
    this.#updatedAt = new Date();
  }
}
