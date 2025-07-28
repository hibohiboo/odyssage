// @copilot-context naming

import type { ChoiceCondition, PlayerState } from './player-state';

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