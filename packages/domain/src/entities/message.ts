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

  #text: string;

  #order: number;

  #choices: Choice[];

  readonly createdAt: Date;

  #updatedAt: Date;

  constructor(props: MessageProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.#text = props.text;
    this.#order = props.order;
    this.#choices = props.choices || [];
    this.createdAt = props.createdAt || new Date();
    this.#updatedAt = props.updatedAt || new Date();
  }

  get text(): string {
    return this.#text;
  }

  get order(): number {
    return this.#order;
  }

  get choices(): Choice[] {
    return [...this.#choices];
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  updateText(text: string): void {
    this.#text = text;
    this.#updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this.#order = order;
    this.#updatedAt = new Date();
  }

  addChoice(choice: Choice): void {
    this.#choices.push(choice);
    this.#updatedAt = new Date();
  }

  removeChoice(choiceId: string): void {
    this.#choices = this.#choices.filter((choice) => choice.id !== choiceId);
    this.#updatedAt = new Date();
  }

  updateChoice(choiceId: string, updates: Partial<Omit<Choice, 'id'>>): void {
    const choice = this.#choices.find((c) => c.id === choiceId);
    if (choice) {
      Object.assign(choice, updates);
      this.#updatedAt = new Date();
    }
  }
}
