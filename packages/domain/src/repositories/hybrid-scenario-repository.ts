// @copilot-context backend
import { createScenarioNode, getScenarioNode } from '@odyssage/graph-database/src/nodes/scenario';
import { getCompleteScenarioStructure } from '@odyssage/graph-database/src/queries/scenario-structure';
import { Session } from 'neo4j-driver';
import { Scenario, type Visibility } from '../entities/scenario';
import type { ScenarioRepository } from './scenario-repository';

/**
 * ハイブリッドシナリオリポジトリ
 * PostgreSQLとNeo4jの両方を使用してシナリオデータを管理
 * 
 * データ連携方針：レベル1（最小連携）
 * - 基本データ：PostgreSQL（将来実装）
 * - 構造データ：Neo4j（現在実装）
 */
export class HybridScenarioRepository implements ScenarioRepository {
  #session: Session;

  constructor(session: Session) {
    this.#session = session;
  }

  async save(scenario: Scenario): Promise<void> {
    // Neo4jにシナリオノードを作成
    const scenarioData = {
      id: scenario.id,
      title: scenario.title,
      overview: scenario.overview,
      userId: scenario.userId,
      visibility: scenario.visibility,
    };

    await createScenarioNode(this.#session, scenarioData);

    // Scene、Event、Messageも保存（完全な階層構造）
    await this.saveScenarioStructure(scenario);

    // 将来のPostgreSQL連携はここに追加
  }

  private async saveScenarioStructure(scenario: Scenario): Promise<void> {
    // 動的インポートでgraph-databaseパッケージの機能を使用
    const { createSceneNode } = await import('@odyssage/graph-database/src/nodes/scene');
    const { createEventNode } = await import('@odyssage/graph-database/src/nodes/event');
    const { createMessageNode } = await import('@odyssage/graph-database/src/nodes/message');
    const { createScenarioSceneRelation } = await import('@odyssage/graph-database/src/relationships/scenario-scene');
    const { createSceneEventRelation } = await import('@odyssage/graph-database/src/relationships/scene-event');
    const { createEventMessageRelation } = await import('@odyssage/graph-database/src/relationships/event-message');

    // シーンを並列保存
    await Promise.all(scenario.scenes.map(async (scene) => {
      const sceneData = {
        id: scene.id,
        title: scene.title,
        description: scene.description,
        order: scene.order,
        scenarioId: scenario.id,
      };

      await createSceneNode(this.#session, sceneData);
      await createScenarioSceneRelation(this.#session, scenario.id, scene.id);

      // イベントを並列保存
      await Promise.all(scene.events.map(async (event) => {
        const eventData = {
          id: event.id,
          title: event.title,
          description: event.description,
          order: event.order,
          sceneId: scene.id,
        };

        await createEventNode(this.#session, eventData);
        await createSceneEventRelation(this.#session, scene.id, event.id);

        // メッセージを並列保存
        await Promise.all(event.messages.map(async (message) => {
          const messageData = {
            id: message.id,
            text: message.text,
            order: message.order,
            eventId: event.id,
          };

          await createMessageNode(this.#session, messageData);
          await createEventMessageRelation(this.#session, event.id, message.id);
        }));
      }));
    }));
  }

  async findById(id: string): Promise<Scenario | null> {
    const result = await getScenarioNode(this.#session, id);
    
    if (result.records.length === 0) {
      return null;
    }

    const nodeData = result.records[0].get('s').properties;
    
    // Neo4jデータからScenarioエンティティを再構築
    const scenario = new Scenario({
      id: nodeData.id,
      title: nodeData.title,
      overview: nodeData.overview,
      userId: nodeData.userId,
      visibility: nodeData.visibility as Visibility,
    });

    return scenario;
  }

  async findByUserId(userId: string): Promise<Scenario[]> {
    // Neo4jでユーザーIDによるシナリオ検索
    const result = await this.#session.run(
      'MATCH (s:Scenario {userId: $userId}) RETURN s',
      { userId },
    );

    return result.records.map(record => {
      const nodeData = record.get('s').properties;
      return new Scenario({
        id: nodeData.id,
        title: nodeData.title,
        overview: nodeData.overview,
        userId: nodeData.userId,
        visibility: nodeData.visibility as Visibility,
      });
    });
  }

  async findPublicScenarios(
    page: number,
    limit: number,
  ): Promise<{
    scenarios: Scenario[];
    total: number;
    hasNext: boolean;
  }> {
    const skip = (page - 1) * limit;
    
    // 公開シナリオを取得
    const result = await this.#session.run(
      `MATCH (s:Scenario {visibility: 'public'}) 
       RETURN s 
       ORDER BY s.createdAt DESC 
       SKIP $skip LIMIT $limit`,
      { skip: parseInt(skip.toString(), 10), limit: parseInt(limit.toString(), 10) },
    );

    // 総数を取得
    const countResult = await this.#session.run(
      "MATCH (s:Scenario {visibility: 'public'}) RETURN count(s) as total",
    );

    const scenarios = result.records.map(record => {
      const nodeData = record.get('s').properties;
      return new Scenario(
        nodeData.id,
        nodeData.title,
        nodeData.overview,
        nodeData.userId,
        nodeData.visibility as Visibility,
      );
    });

    const total = countResult.records[0].get('total').toNumber();
    const hasNext = skip + limit < total;

    return { scenarios, total, hasNext };
  }

  async delete(id: string): Promise<void> {
    // Neo4jからシナリオとその関連データを削除
    await this.#session.run(
      'MATCH (s:Scenario {id: $id}) DETACH DELETE s',
      { id },
    );

    // 将来のPostgreSQL連携を予定
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.#session.run(
      'MATCH (s:Scenario {id: $id}) RETURN count(s) > 0 as exists',
      { id },
    );

    return result.records[0].get('exists');
  }

  async countByVisibility(visibility: Visibility): Promise<number> {
    const result = await this.#session.run(
      'MATCH (s:Scenario {visibility: $visibility}) RETURN count(s) as count',
      { visibility },
    );

    return result.records[0].get('count').toNumber();
  }

  async searchByTitle(title: string, limit: number): Promise<Scenario[]> {
    const result = await this.#session.run(
      `MATCH (s:Scenario) 
       WHERE toLower(s.title) CONTAINS toLower($title)
       RETURN s 
       LIMIT $limit`,
      { title, limit: parseInt(limit.toString(), 10) },
    );

    return result.records.map(record => {
      const nodeData = record.get('s').properties;
      return new Scenario({
        id: nodeData.id,
        title: nodeData.title,
        overview: nodeData.overview,
        userId: nodeData.userId,
        visibility: nodeData.visibility as Visibility,
      });
    });
  }

  async findByIdWithFullStructure(id: string): Promise<Scenario | null> {
    const result = await getCompleteScenarioStructure(this.#session, id);
    
    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];
    const scenarioData = record.get('scenario').properties;
    
    // 完全なScenarioエンティティを構築（Scene, Event, Message含む）
    const scenario = new Scenario({
      id: scenarioData.id,
      title: scenarioData.title,
      overview: scenarioData.overview,
      userId: scenarioData.userId,
      visibility: scenarioData.visibility as Visibility,
    });

    // 将来的にScene, Event, Messageの復元ロジックを追加予定

    return scenario;
  }
}