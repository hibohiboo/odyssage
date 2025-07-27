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

  private _text: string;

  private _order: number;

  private _choices: Choice[];

  readonly createdAt: Date;

  private _updatedAt: Date;

  constructor(props: MessageProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this._text = props.text;
    this._order = props.order;
    this._choices = props.choices || [];
    this.createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get text(): string {
    return this._text;
  }

  get order(): number {
    return this._order;
  }

  get choices(): Choice[] {
    return [...this._choices];
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateText(text: string): void {
    this._text = text;
    this._updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this._order = order;
    this._updatedAt = new Date();
  }

  addChoice(choice: Choice): void {
    this._choices.push(choice);
    this._updatedAt = new Date();
  }

  removeChoice(choiceId: string): void {
    this._choices = this._choices.filter((choice) => choice.id !== choiceId);
    this._updatedAt = new Date();
  }

  updateChoice(choiceId: string, updates: Partial<Omit<Choice, 'id'>>): void {
    const choice = this._choices.find((c) => c.id === choiceId);
    if (choice) {
      Object.assign(choice, updates);
      this._updatedAt = new Date();
    }
  }
}
