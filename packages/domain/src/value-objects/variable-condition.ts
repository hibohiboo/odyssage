// @copilot-context naming

import type { ChoiceCondition, PlayerState } from './player-state';

/**
 * 変数条件
 */
export class VariableCondition implements ChoiceCondition {
  constructor(
    private variableName: string,
    private operator: '>' | '<' | '>=' | '<=' | '==' | '!=',
    private value: number,
  ) {}

  // eslint-disable-next-line complexity
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
