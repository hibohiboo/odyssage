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

  private title_: string;

  private description_: string;

  private order_: number;

  private messages_: Message[];

  readonly createdAt: Date;

  private updatedAt_: Date;

  constructor(props: EventProps) {
    this.id = props.id;
    this.sceneId = props.sceneId;
    this.title_ = props.title;
    this.description_ = props.description;
    this.order_ = props.order;
    this.messages_ = props.messages || [];
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

  get messages(): Message[] {
    return [...this.messages_];
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

  addMessage(message: Message): void {
    this.messages_.push(message);
    this.updatedAt_ = new Date();
  }

  removeMessage(messageId: string): void {
    this.messages_ = this.messages_.filter(
      (message) => message.id !== messageId,
    );
    this.updatedAt_ = new Date();
  }
}
