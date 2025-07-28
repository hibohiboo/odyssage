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