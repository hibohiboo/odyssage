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

  private _title: string;

  private _description: string;

  private _order: number;

  private _messages: Message[];

  readonly createdAt: Date;

  private _updatedAt: Date;

  constructor(props: EventProps) {
    this.id = props.id;
    this.sceneId = props.sceneId;
    this._title = props.title;
    this._description = props.description;
    this._order = props.order;
    this._messages = props.messages || [];
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

  get messages(): Message[] {
    return [...this._messages];
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

  addMessage(message: Message): void {
    this._messages.push(message);
    this._updatedAt = new Date();
  }

  removeMessage(messageId: string): void {
    this._messages = this._messages.filter(
      (message) => message.id !== messageId,
    );
    this._updatedAt = new Date();
  }
}
