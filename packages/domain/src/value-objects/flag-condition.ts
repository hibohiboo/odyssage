// @copilot-context naming

import type { ChoiceCondition, PlayerState } from './player-state';

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