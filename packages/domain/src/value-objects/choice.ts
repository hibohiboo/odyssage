// @copilot-context naming

/**
 * 選択肢値オブジェクト
 * プレイヤーが選択できる選択肢を表現
 */
export class Choice {
  readonly text: string;

  readonly targetEventId: string;

  readonly isVisible: boolean;

  readonly conditions?: ChoiceCondition[];

  constructor(props: {
    text: string;
    targetEventId: string;
    isVisible?: boolean;
    conditions?: ChoiceCondition[];
  }) {
    if (!props.text.trim()) {
      throw new Error('選択肢のテキストは必須です');
    }

    if (!props.targetEventId.trim()) {
      throw new Error('選択肢の遷移先イベントIDは必須です');
    }

    this.text = props.text.trim();
    this.targetEventId = props.targetEventId.trim();
    this.isVisible = props.isVisible ?? true;
    this.conditions = props.conditions ?? [];
  }

  /**
   * 条件を満たしているかチェック
   */
  meetsConditions(playerState: PlayerState): boolean {
    if (!this.conditions || this.conditions.length === 0) {
      return true;
    }

    return this.conditions.every((condition) =>
      condition.evaluate(playerState),
    );
  }

  /**
   * 選択肢の等価性をチェック
   */
  equals(other: Choice): boolean {
    return (
      this.text === other.text &&
      this.targetEventId === other.targetEventId &&
      this.isVisible === other.isVisible
    );
  }
}

/**
 * プレイヤーの状態（選択肢条件評価用）
 */
export interface PlayerState {
  visitedEventIds: string[];
  flags: Record<string, boolean>;
  variables: Record<string, number>;
}

/**
 * 選択肢表示条件
 */
export interface ChoiceCondition {
  evaluate(playerState: PlayerState): boolean;
}

/**
 * イベント訪問条件
 */
export class EventVisitedCondition implements ChoiceCondition {
  constructor(
    private eventId: string,
    private mustBeVisited: boolean = true,
  ) {}

  evaluate(playerState: PlayerState): boolean {
    const hasVisited = playerState.visitedEventIds.includes(this.eventId);
    return this.mustBeVisited ? hasVisited : !hasVisited;
  }
}

/**
 * フラグ条件
 */
export class FlagCondition implements ChoiceCondition {
  constructor(
    private flagName: string,
    private expectedValue: boolean,
  ) {}

  evaluate(playerState: PlayerState): boolean {
    return playerState.flags[this.flagName] === this.expectedValue;
  }
}

/**
 * 変数条件
 */
export class VariableCondition implements ChoiceCondition {
  constructor(
    private variableName: string,
    private operator: '>' | '<' | '>=' | '<=' | '==' | '!=',
    private value: number,
  ) {}

  evaluate(playerState: PlayerState): boolean {
    const currentValue = playerState.variables[this.variableName] ?? 0;

    switch (this.operator) {
      case '>':
        return currentValue > this.value;
      case '<':
        return currentValue < this.value;
      case '>=':
        return currentValue >= this.value;
      case '<=':
        return currentValue <= this.value;
      case '==':
        return currentValue === this.value;
      case '!=':
        return currentValue !== this.value;
      default:
        return false;
    }
  }
}
