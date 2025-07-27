// @copilot-context naming
import type { ChoiceCondition, PlayerState } from './choice-conditions';

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
