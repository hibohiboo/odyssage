// @copilot-context naming
import type { Visibility, Scenario } from '../entities/scenario';

/**
 * シナリオリポジトリインターフェース
 * データアクセスを抽象化し、ドメイン層をインフラ層から分離
 */
export interface ScenarioRepository {
  /**
   * シナリオを保存（新規作成・更新）
   */
  save(scenario: Scenario): Promise<void>;

  /**
   * IDでシナリオを取得
   */
  findById(id: string): Promise<Scenario | null>;

  /**
   * ユーザーIDでシナリオ一覧を取得
   */
  findByUserId(userId: string): Promise<Scenario[]>;

  /**
   * 公開されているシナリオ一覧を取得（ページネーション付き）
   */
  findPublicScenarios(
    page: number,
    limit: number,
  ): Promise<{
    scenarios: Scenario[];
    total: number;
    hasNext: boolean;
  }>;

  /**
   * シナリオを削除
   */
  delete(id: string): Promise<void>;

  /**
   * シナリオの存在確認
   */
  exists(id: string): Promise<boolean>;

  /**
   * 指定した可視性のシナリオ数を取得
   */
  countByVisibility(visibility: Visibility): Promise<number>;

  /**
   * タイトル部分一致でシナリオを検索
   */
  searchByTitle(title: string, limit: number): Promise<Scenario[]>;

  /**
   * 完全なシナリオ構造（Scene, Event, Message含む）を取得
   */
  findByIdWithFullStructure(id: string): Promise<Scenario | null>;
}
