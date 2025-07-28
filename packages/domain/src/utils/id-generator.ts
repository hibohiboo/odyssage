// @copilot-context naming

import { v4 as uuidv4 } from 'uuid';

/**
 * ID生成ユーティリティ
 * 将来的にUUIDライブラリの差し替えや生成方式の変更を容易にするためのラッパー
 */
export class IdGenerator {
  /**
   * イベントID生成
   */
  static generateEventId(): string {
    return `event_${uuidv4()}`;
  }

  /**
   * シナリオID生成
   */
  static generateScenarioId(): string {
    return `scenario_${uuidv4()}`;
  }

  /**
   * シーンID生成
   */
  static generateSceneId(): string {
    return `scene_${uuidv4()}`;
  }

  /**
   * メッセージID生成
   */
  static generateMessageId(): string {
    return `message_${uuidv4()}`;
  }

  /**
   * プレイヤー進行状況ID生成
   */
  static generateProgressId(): string {
    return `progress_${uuidv4()}`;
  }

  /**
   * 基本UUID生成（プレフィックスなし）
   */
  static generateUuid(): string {
    return uuidv4();
  }
}