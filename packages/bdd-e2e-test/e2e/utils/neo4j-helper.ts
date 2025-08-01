import { expect } from '@playwright/test';
import neo4j, { Driver } from 'neo4j-driver';

/**
 * BDDテストで共通利用するNeo4j操作のユーティリティクラス
 */
export class Neo4jHelper {
  private driver: Driver | null = null;
  private available = true;

  constructor() {
    this.initialize();
  }

  /**
   * Neo4j接続を初期化
   */
  private async initialize() {
    try {
      const NEO4J_URL = process.env.NEO4J_URL || 'bolt://localhost:7687';
      const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
      const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'neo4jpassword';

      this.driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
      await this.driver.verifyConnectivity();
      console.log('Neo4j connection established for BDD tests');
    } catch (error) {
      console.warn('Neo4j not available for BDD tests:', error);
      this.available = false;
    }
  }

  /**
   * Neo4jが利用可能か確認
   */
  isAvailable(): boolean {
    return this.available && this.driver !== null;
  }

  /**
   * GraphDBにシナリオを作成する
   */
  async createScenario(id: string, title: string, overview: string, userId: string) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping scenario creation');
      return;
    }

    const session = this.driver!.session();
    try {
      // シナリオノードを作成
      await session.run(
        `CREATE (scenario:Scenario {
          id: $id,
          title: $title,
          overview: $overview,
          userId: $userId,
          visibility: 'private',
          createdAt: datetime(),
          updatedAt: datetime()
        })`,
        { id, title, overview, userId }
      );

      console.log(`GraphDBにシナリオ「${title}」を作成しました`);
    } catch (error) {
      console.error('Scenario creation failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * シナリオがGraphDBに保存されているか確認
   */
  async verifyScenarioExists(title: string, overview: string) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping scenario verification');
      return;
    }

    const session = this.driver!.session();
    try {
      const result = await session.run(
        'MATCH (s:Scenario {title: $title}) RETURN s.title as title, s.overview as overview',
        { title: title.trim() }
      );
      
      expect(result.records.length).toBeGreaterThan(0);
      const record = result.records[0];
      expect(record.get('title')).toBe(title.trim());
      expect(record.get('overview')).toBe(overview);
      
      console.log(`GraphDBでシナリオ「${title}」を確認しました`);
    } catch (error) {
      console.error('Scenario GraphDB verification failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * GraphDBにシーンを作成する
   */
  async createScene(id: string, title: string, overview: string, scenarioId: string, order: number) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping scene creation');
      return;
    }

    const session = this.driver!.session();
    try {
      // シーンノードを作成
      await session.run(
        `CREATE (scene:Scene {
          id: $id,
          title: $title,
          overview: $overview,
          scenarioId: $scenarioId,
          order: $order,
          createdAt: datetime(),
          updatedAt: datetime()
        })`,
        { id, title, overview, scenarioId, order }
      );

      // シナリオとの関係性を構築
      await session.run(
        `MATCH (scenario:Scenario {id: $scenarioId})
         MATCH (scene:Scene {id: $id})
         CREATE (scenario)-[:HAS_SCENE]->(scene)`,
        { scenarioId, id }
      );

      console.log(`GraphDBにシーン「${title}」を作成しました`);
    } catch (error) {
      console.error('Scene creation failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * シーンがGraphDBに保存されているか確認
   */
  async verifySceneExists(title: string, overview: string, order: number) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping scene verification');
      return;
    }

    const session = this.driver!.session();
    try {
      const result = await session.run(
        'MATCH (scene:Scene {title: $title}) RETURN scene.title as title, scene.overview as overview, scene.order as order',
        { title }
      );
      
      expect(result.records.length).toBeGreaterThan(0);
      const record = result.records[0];
      expect(record.get('title')).toBe(title);
      expect(record.get('overview')).toBe(overview);
      expect(record.get('order').toNumber()).toBe(order);
      
      console.log(`GraphDBでシーン「${title}」を確認しました`);
    } catch (error) {
      console.error('Scene GraphDB verification failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * シナリオとシーンの関係性が構築されているか確認
   */
  async verifyScenarioSceneRelationship(sceneTitle: string) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping relationship verification');
      return;
    }

    const session = this.driver!.session();
    try {
      const result = await session.run(
        'MATCH (scenario:Scenario)-[:HAS_SCENE]->(scene:Scene {title: $sceneTitle}) RETURN scenario.title as scenarioTitle, scene.title as sceneTitle',
        { sceneTitle }
      );
      
      expect(result.records.length).toBeGreaterThan(0);
      const record = result.records[0];
      expect(record.get('sceneTitle')).toBe(sceneTitle);
      
      console.log('GraphDBでシナリオとシーンの関係性を確認しました');
    } catch (error) {
      console.error('Scenario-Scene relationship verification failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * シーンの順序が更新されているか確認
   */
  async verifySceneOrder(sceneTitle: string, expectedOrder: number) {
    if (!this.isAvailable()) {
      console.log('Neo4j not available, skipping scene order verification');
      return;
    }

    const session = this.driver!.session();
    try {
      const result = await session.run(
        'MATCH (scene:Scene {title: $title}) RETURN scene.order as order',
        { title: sceneTitle }
      );
      
      expect(result.records.length).toBeGreaterThan(0);
      const record = result.records[0];
      expect(record.get('order').toNumber()).toBe(expectedOrder);
      
      console.log(`GraphDBでシーン「${sceneTitle}」の順序更新を確認しました`);
    } catch (error) {
      console.error('Scene order verification failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * 接続を閉じる
   */
  async close() {
    if (this.driver) {
      await this.driver.close();
    }
  }
}

// シングルトンインスタンス
export const neo4jHelper = new Neo4jHelper();

// プロセス終了時に接続を閉じる
process.on('exit', async () => {
  await neo4jHelper.close();
});