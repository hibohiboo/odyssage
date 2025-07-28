// @copilot-context testing
import { randomUUID } from 'crypto';
import { Session } from 'neo4j-driver';

/**
 * テスト用のユニークIDを生成
 */
export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${randomUUID()}`;
}

/**
 * テスト用のタイムスタンプ付きIDを生成（並列実行対応）
 */
export function generateTimestampedTestId(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = randomUUID().substring(0, 8);
  const processId = process.pid;
  const threadId = Date.now() % 10000; // Math.random()を避ける
  return `${prefix}-${timestamp}-${processId}-${threadId}-${random}`;
}

/**
 * 指定したパターンのノードとリレーションを完全削除
 */
export async function cleanupTestNodes(session: Session, idPattern: string): Promise<void> {
  const query = `
    MATCH (n) 
    WHERE n.id STARTS WITH $idPattern
    DETACH DELETE n
  `;
  
  await session.run(query, { idPattern });
}

/**
 * 特定のテストIDを使用して完全なクリーンアップを実行
 */
export async function cleanupTestData(session: Session, testIds: string[]): Promise<void> {
  await Promise.all(testIds.map(testId => cleanupTestNodes(session, testId)));
}

/**
 * テスト用のシナリオIDセットを生成
 */
export interface TestIdSet {
  scenarioId: string;
  sceneId: string;
  eventId: string;
  messageId: string;
  eventId2?: string;
  messageId2?: string;
}

export function generateTestIdSet(basePrefix: string = 'test'): TestIdSet {
  const uniqueId = generateTimestampedTestId(basePrefix);
  
  return {
    scenarioId: `scenario-${uniqueId}`,
    sceneId: `scene-${uniqueId}`,
    eventId: `event-${uniqueId}`,
    messageId: `message-${uniqueId}`,
    eventId2: `event2-${uniqueId}`,
    messageId2: `message2-${uniqueId}`,
  };
}

/**
 * テスト用のマルチIDセットを生成（複雑な構造用）
 */
export function generateMultiTestIdSet(basePrefix: string = 'test', count: number = 3): {
  scenarioId: string;
  scenes: Array<{ sceneId: string; events: Array<{ eventId: string; messageId: string }> }>;
} {
  const uniqueId = generateTimestampedTestId(basePrefix);
  
  return {
    scenarioId: `scenario-${uniqueId}`,
    scenes: Array.from({ length: count }, (__, sceneIndex) => ({
      sceneId: `scene-${sceneIndex + 1}-${uniqueId}`,
      events: Array.from({ length: 2 }, (___, eventIndex) => ({
        eventId: `event-${sceneIndex + 1}-${eventIndex + 1}-${uniqueId}`,
        messageId: `message-${sceneIndex + 1}-${eventIndex + 1}-${uniqueId}`,
      }))
    }))
  };
}

/**
 * テスト実行前後のクリーンアップヘルパー（並列実行対応）
 */
export class TestCleanupHelper {
  private testIds: string[] = [];

  private session: Session;

  private testSuiteId: string;

  constructor(session: Session) {
    this.session = session;
    this.testSuiteId = generateTimestampedTestId('suite');
  }

  /**
   * 追跡するテストIDを追加
   */
  addTestId(testId: string): void {
    this.testIds.push(testId);
  }

  /**
   * テストIDセットを追加
   */
  addTestIdSet(idSet: TestIdSet): void {
    this.testIds.push(idSet.scenarioId, idSet.sceneId, idSet.eventId, idSet.messageId);
    if (idSet.eventId2) this.testIds.push(idSet.eventId2);
    if (idSet.messageId2) this.testIds.push(idSet.messageId2);
  }

  /**
   * テストスイート固有のIDを生成
   */
  generateSuiteSpecificId(baseId: string): string {
    return `${baseId}-${this.testSuiteId}`;
  }

  /**
   * テストケース固有のIDセットを生成
   */
  generateTestSpecificIdSet(testName: string): TestIdSet {
    const uniqueId = generateTimestampedTestId(`${testName}-${this.testSuiteId}`);
    
    const idSet: TestIdSet = {
      scenarioId: `scenario-${uniqueId}`,
      sceneId: `scene-${uniqueId}`,
      eventId: `event-${uniqueId}`,
      messageId: `message-${uniqueId}`,
      eventId2: `event2-${uniqueId}`,
      messageId2: `message2-${uniqueId}`,
    };

    // 自動的に追跡リストに追加
    this.addTestIdSet(idSet);
    
    return idSet;
  }

  /**
   * すべての追跡されたテストデータをクリーンアップ
   */
  async cleanup(): Promise<void> {
    if (this.testIds.length === 0) return;

    try {
      // より確実なクリーンアップのため、個別IDでの削除を追加
      await Promise.all(this.testIds.map(testId => this.cleanupSingleTestId(testId)));

      // 従来の接頭辞ベースクリーンアップも実行
      const prefixes = [...new Set(this.testIds.map(id => {
        const parts = id.split('-');
        return parts.length >= 3 ? `${parts[0]}-${parts[1]}` : parts[0];
      }))];

      await Promise.all(prefixes.map(prefix => cleanupTestNodes(this.session, prefix)));

      this.testIds = [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('クリーンアップ中にエラーが発生:', error);
      // エラーが発生してもテストは続行
    }
  }

  /**
   * 単一のテストIDでの確実なクリーンアップ
   */
  private async cleanupSingleTestId(testId: string): Promise<void> {
    const query = `
      MATCH (n {id: $testId})
      DETACH DELETE n
    `;
    
    await this.session.run(query, { testId });
  }
}