// @copilot-context naming
import {
  PlayerRepository,
  PlayerProgress,
} from '../repositories/player-repository';
import { ScenarioRepository } from '../repositories/scenario-repository';
import { IdGenerator } from '../utils/id-generator';

/**
 * ゲームプレイの進行状況
 */
export interface GameState {
  currentEventId: string;
  availableChoices: Array<{
    text: string;
    targetEventId: string;
  }>;
  currentMessage: string;
  isCompleted: boolean;
  visitedEvents: string[];
}

/**
 * 選択結果
 */
export interface ChoiceResult {
  success: boolean;
  newGameState?: GameState;
  error?: string;
}

/**
 * ゲームプレイサービス
 * プレイヤーのシナリオ進行を管理するドメインサービス
 */
export class GameplayService {
  constructor(
    private scenarioRepository: ScenarioRepository,
    private playerRepository: PlayerRepository,
  ) {}

  /**
   * ゲームを開始
   */
  async startGame(userId: string, scenarioId: string): Promise<GameState> {
    // シナリオの存在確認
    const scenario =
      await this.scenarioRepository.findByIdWithFullStructure(scenarioId);
    if (!scenario) {
      throw new Error('シナリオが見つかりません');
    }

    // 公開されているシナリオかチェック
    if (scenario.visibility === 'private' && scenario.userId !== userId) {
      throw new Error('このシナリオにはアクセスできません');
    }

    // 既存の進行状況をチェック
    let progress = await this.playerRepository.findProgress(userId, scenarioId);

    if (!progress) {
      // 新規ゲーム開始
      const startEvent = GameplayService.findStartEvent(scenario);
      if (!startEvent) {
        throw new Error('開始イベントが見つかりません');
      }

      progress = {
        id: GameplayService.generateProgressId(),
        userId,
        scenarioId,
        currentEventId: startEvent.id,
        visitedEventIds: [startEvent.id],
        choiceHistory: [],
        startedAt: new Date(),
        lastPlayedAt: new Date(),
        isCompleted: false,
      };

      await this.playerRepository.saveProgress(progress);
    } else {
      // 既存ゲームの再開
      progress.lastPlayedAt = new Date();
      await this.playerRepository.saveProgress(progress);
    }

    return this.buildGameState(scenario, progress);
  }

  /**
   * 選択を実行
   */
  async makeChoice(
    userId: string,
    scenarioId: string,
    choiceText: string,
    targetEventId: string,
  ): Promise<ChoiceResult> {
    try {
      const validationResult = await this.validateChoiceRequest(
        userId,
        scenarioId,
        targetEventId,
      );
      if (!validationResult.success) {
        return { success: false, error: validationResult.error };
      }

      const { progress, scenario } = validationResult;

      await this.executeChoice(userId, scenarioId, progress!, choiceText, targetEventId);

      const updatedProgress = await this.getUpdatedProgress(userId, scenarioId);
      if (!updatedProgress) {
        return { success: false, error: '進行状況の更新に失敗しました' };
      }

      await this.handleGameCompletion(scenario!, targetEventId, updatedProgress);

      const newGameState = this.buildGameState(scenario!, updatedProgress);

      return {
        success: true,
        newGameState,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : '選択の実行に失敗しました',
      };
    }
  }

  private async validateChoiceRequest(
    userId: string,
    scenarioId: string,
    targetEventId: string,
  ): Promise<{
    success: boolean;
    error?: string;
    progress?: PlayerProgress;
    scenario?: { 
      id: string;
      scenes: Array<{ 
        events: Array<{ 
          id: string; 
          messages: Array<{ order: number; text: string }> 
        }> 
      }>;
    };
  }> {
    const progress = await this.playerRepository.findProgress(userId, scenarioId);
    if (!progress) {
      return { success: false, error: 'ゲームが開始されていません' };
    }

    const scenario = await this.scenarioRepository.findByIdWithFullStructure(scenarioId);
    if (!scenario) {
      return { success: false, error: 'シナリオが見つかりません' };
    }

    const isValidChoice = this.validateChoice(
      scenario,
      progress.currentEventId!,
      targetEventId,
    );

    if (!isValidChoice) {
      return { success: false, error: '無効な選択です' };
    }

    return { success: true, progress, scenario };
  }

  private async executeChoice(
    userId: string,
    scenarioId: string,
    progress: PlayerProgress,
    choiceText: string,
    targetEventId: string,
  ): Promise<void> {
    await this.playerRepository.recordChoice(
      userId,
      scenarioId,
      progress.currentEventId!,
      targetEventId,
      choiceText,
    );

    await this.playerRepository.updateCurrentPosition(
      userId,
      scenarioId,
      targetEventId,
    );
  }

  private async getUpdatedProgress(userId: string, scenarioId: string): Promise<PlayerProgress | null> {
    return this.playerRepository.findProgress(userId, scenarioId);
  }

  private async handleGameCompletion(
    scenario: { 
      id: string;
      scenes: Array<{ 
        events: Array<{ 
          id: string; 
          messages: Array<{ order: number; text: string }> 
        }> 
      }>;
    },
    targetEventId: string,
    updatedProgress: PlayerProgress,
  ): Promise<void> {
    const isCompleted = this.checkGameCompletion(scenario, targetEventId);
    if (isCompleted) {
      const completedProgress: PlayerProgress = {
        ...updatedProgress,
        isCompleted: true,
      };
      await this.playerRepository.saveProgress(completedProgress);
    }
  }

  /**
   * 現在のゲーム状態を取得
   */
  async getGameState(
    userId: string,
    scenarioId: string,
  ): Promise<GameState | null> {
    const progress = await this.playerRepository.findProgress(
      userId,
      scenarioId,
    );
    if (!progress) {
      return null;
    }

    const scenario =
      await this.scenarioRepository.findByIdWithFullStructure(scenarioId);
    if (!scenario) {
      return null;
    }

    return this.buildGameState(scenario, progress);
  }

  /**
   * ゲームをリセット
   */
  async resetGame(userId: string, scenarioId: string): Promise<void> {
    await this.playerRepository.deleteProgress(userId, scenarioId);
  }

  /**
   * プレイヤーの進行状況統計を取得
   */
  async getPlayerStats(userId: string): Promise<{
    totalGamesStarted: number;
    totalGamesCompleted: number;
    completionRate: number;
    favoriteScenarios: string[];
  }> {
    const allProgress =
      await this.playerRepository.findProgressByUserId(userId);

    const totalGamesStarted = allProgress.length;
    const totalGamesCompleted = allProgress.filter((p) => p.isCompleted).length;
    const completionRate =
      totalGamesStarted > 0 ? totalGamesCompleted / totalGamesStarted : 0;

    // お気に入りシナリオ（完了したゲームまたは長時間プレイしたゲーム）
    const favoriteScenarios = allProgress
      .filter((p) => p.isCompleted || p.visitedEventIds.length > 5)
      .map((p) => p.scenarioId);

    return {
      totalGamesStarted,
      totalGamesCompleted,
      completionRate,
      favoriteScenarios: [...new Set(favoriteScenarios)],
    };
  }

  private static findStartEvent(scenario: {
    scenes: Array<{ order: number; events: Array<{ order: number; id: string }> }>;
  }): { id: string } | null {
    // 最初のシーンの最初のイベントを開始イベントとする
    if (scenario.scenes.length === 0) return null;

    const firstScene = scenario.scenes.sort(
      (a, b) => a.order - b.order,
    )[0];
    if (firstScene.events.length === 0) return null;

    return firstScene.events.sort((a, b) => a.order - b.order)[0];
  }

  private buildGameState(
    scenario: {
      scenes: Array<{
        events: Array<{
          id: string;
          messages: Array<{ order: number; text: string }>;
        }>;
      }>;
    },
    progress: PlayerProgress,
  ): GameState {
    const currentEvent = this.findEventById(scenario, progress.currentEventId!);
    if (!currentEvent) {
      throw new Error('現在のイベントが見つかりません');
    }

    // 利用可能な選択肢を取得
    const availableChoices = this.getAvailableChoices(
      scenario,
      currentEvent.id,
    );

    // 現在のメッセージを取得
    const currentMessage = currentEvent.messages
      .sort((a, b) => a.order - b.order)
      .map((m) => m.text)
      .join('\n');

    return {
      currentEventId: currentEvent.id,
      availableChoices,
      currentMessage,
      isCompleted: progress.isCompleted,
      visitedEvents: progress.visitedEventIds,
    };
  }

  // TODO: 将来的にキャッシュ機能やログ機能でthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private findEventById(
    scenario: {
      scenes: Array<{ events: Array<{ id: string; messages: Array<{ order: number; text: string }> }> }>;
    },
    eventId: string,
  ): { id: string; messages: Array<{ order: number; text: string }> } | null {
    const foundEvent = scenario.scenes
      .flatMap((scene) => scene.events)
      .find((event) => event.id === eventId);
    return foundEvent || null;
  }

  // TODO: 将来的に設定やルールエンジンでthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private getAvailableChoices(
    _scenario: unknown,
    _eventId: string,
  ): Array<{ text: string; targetEventId: string }> {
    // この部分は実際のシナリオ構造に基づいて実装
    // 現在は簡易実装
    return [];
  }

  // TODO: 将来的にバリデーターやログ機能でthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private validateChoice(
    _scenario: unknown,
    _fromEventId: string,
    _toEventId: string,
  ): boolean {
    // 選択の妥当性を検証
    // 現在は簡易実装
    return true;
  }

  private checkGameCompletion(_scenario: unknown, currentEventId: string): boolean {
    // ゲーム完了条件をチェック
    // 終了イベントに到達したか、または選択肢がないかなど
    const availableChoices = this.getAvailableChoices(_scenario, currentEventId);
    return availableChoices.length === 0;
  }

  private static generateProgressId(): string {
    return IdGenerator.generateProgressId();
  }
}
