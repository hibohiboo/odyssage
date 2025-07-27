// @copilot-context naming
import { Scene } from '../entities/scene';

/**
 * シーンリポジトリインターフェース
 * シーンのデータアクセスを抽象化
 */
export interface SceneRepository {
  /**
   * シーンを保存（新規作成・更新）
   */
  save(scene: Scene): Promise<void>;

  /**
   * IDでシーンを取得
   */
  findById(id: string): Promise<Scene | null>;

  /**
   * シナリオIDでシーン一覧を取得（表示順序でソート）
   */
  findByScenarioId(scenarioId: string): Promise<Scene[]>;

  /**
   * シーンを削除
   */
  delete(id: string): Promise<void>;

  /**
   * シーンの存在確認
   */
  exists(id: string): Promise<boolean>;

  /**
   * 指定シナリオの最後の表示順序を取得
   */
  getLastOrderInScenario(scenarioId: string): Promise<number>;

  /**
   * 完全なシーン構造（Event, Message含む）を取得
   */
  findByIdWithEvents(id: string): Promise<Scene | null>;

  /**
   * 複数シーンを一括保存
   */
  saveMany(scenes: Scene[]): Promise<void>;
}
