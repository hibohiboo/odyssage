// @copilot-context naming
export interface Choice {
  id: string;
  text: string;
  nextEventId?: string;
}

export interface MessageProps {
  id: string;
  text: string;
  order: number;
  eventId: string;
  choices?: Choice[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Message {
  readonly id: string;

  readonly eventId: string;

  private text_: string;

  private order_: number;

  private choices_: Choice[];

  readonly createdAt: Date;

  private updatedAt_: Date;

  constructor(props: MessageProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.text_ = props.text;
    this.order_ = props.order;
    this.choices_ = props.choices || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt_ = props.updatedAt || new Date();
  }

  get text(): string {
    return this.text_;
  }

  get order(): number {
    return this.order_;
  }

  get choices(): Choice[] {
    return [...this.choices_];
  }

  get updatedAt(): Date {
    return this.updatedAt_;
  }

  updateText(text: string): void {
    this.text_ = text;
    this.updatedAt_ = new Date();
  }

  updateOrder(order: number): void {
    this.order_ = order;
    this.updatedAt_ = new Date();
  }

  addChoice(choice: Choice): void {
    this.choices_.push(choice);
    this.updatedAt_ = new Date();
  }

  removeChoice(choiceId: string): void {
    this.choices_ = this.choices_.filter((choice) => choice.id !== choiceId);
    this.updatedAt_ = new Date();
  }

  updateChoice(choiceId: string, updates: Partial<Omit<Choice, 'id'>>): void {
    const choice = this.choices_.find((c) => c.id === choiceId);
    if (choice) {
      Object.assign(choice, updates);
      this.updatedAt_ = new Date();
    }
  }
}
