// @copilot-context naming

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

    if (this.operator === '>') {
      return currentValue > this.value;
    }
    if (this.operator === '<') {
      return currentValue < this.value;
    }
    if (this.operator === '>=') {
      return currentValue >= this.value;
    }
    if (this.operator === '<=') {
      return currentValue <= this.value;
    }
    if (this.operator === '==') {
      return currentValue === this.value;
    }
    if (this.operator === '!=') {
      return currentValue !== this.value;
    }
    return false;
  }
}