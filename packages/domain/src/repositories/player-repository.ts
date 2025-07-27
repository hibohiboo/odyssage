// @copilot-context naming

/**
 * プレイヤーの進行状況を表すエンティティ
 */
export interface PlayerProgress {
  id: string;
  userId: string;
  scenarioId: string;
  currentEventId?: string;
  visitedEventIds: string[];
  choiceHistory: Array<{
    fromEventId: string;
    toEventId: string;
    choiceText: string;
    timestamp: Date;
  }>;
  startedAt: Date;
  lastPlayedAt: Date;
  isCompleted: boolean;
}

/**
 * プレイヤーリポジトリインターフェース
 * プレイヤーの進行状況とゲームプレイデータを管理
 */
export interface PlayerRepository {
  /**
   * プレイヤーの進行状況を保存
   */
  saveProgress(progress: PlayerProgress): Promise<void>;

  /**
   * ユーザーとシナリオでプレイヤー進行状況を取得
   */
  findProgress(
    userId: string,
    scenarioId: string,
  ): Promise<PlayerProgress | null>;

  /**
   * ユーザーの全進行状況を取得
   */
  findProgressByUserId(userId: string): Promise<PlayerProgress[]>;

  /**
   * プレイヤーがイベントを訪問済みかチェック
   */
  hasVisitedEvent(
    userId: string,
    scenarioId: string,
    eventId: string,
  ): Promise<boolean>;

  /**
   * プレイヤーの選択履歴を記録
   */
  recordChoice(
    userId: string,
    scenarioId: string,
    fromEventId: string,
    toEventId: string,
    choiceText: string,
  ): Promise<void>;

  /**
   * プレイヤーの現在位置を更新
   */
  updateCurrentPosition(
    userId: string,
    scenarioId: string,
    eventId: string,
  ): Promise<void>;

  /**
   * プレイヤーの進行状況を削除
   */
  deleteProgress(userId: string, scenarioId: string): Promise<void>;

  /**
   * シナリオの統計情報を取得
   */
  getScenarioStats(scenarioId: string): Promise<{
    totalPlayers: number;
    completedPlayers: number;
    averagePlayTime: number;
    popularChoices: Array<{
      fromEventId: string;
      toEventId: string;
      choiceText: string;
      count: number;
    }>;
  }>;
}
