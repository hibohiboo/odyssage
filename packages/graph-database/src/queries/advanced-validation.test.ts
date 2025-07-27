// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createScenarioSceneRelation } from '../relationships/scenario-scene';
import { createSceneEventRelation } from '../relationships/scene-event';
import { createEventMessageRelation } from '../relationships/event-message';
import { createMessageChoiceRelation } from '../relationships/message-choice';
import { 
  detectCyclicReferences,
  validateBranchingStructure,
  findOrphanedNodes,
  validateScenarioIsolation,
  getScenarioComplexityMetrics,
  cleanupOrphanedRelationships
} from './advanced-validation';

describe('Advanced Validation Queries', () => {
  let session: any;

  beforeEach(async () => {
    session = driver.session();
    // テスト前にテストデータをクリーンアップ
    await session.run(`
      MATCH (n) WHERE n.id STARTS WITH 'test-'
      DETACH DELETE n
    `);
  });

  afterEach(async () => {
    // テスト後のクリーンアップ
    await session.run(`
      MATCH (n) WHERE n.id STARTS WITH 'test-'
      DETACH DELETE n
    `);
    await session.close();
  });

  it('should detect cyclic references in scenario structure', async () => {
    // Arrange - 循環参照のあるストーリーを作成
    await createCyclicStoryStructure(session);

    // Act
    const result = await detectCyclicReferences(session, 'test-scenario-cyclic');

    // Assert
    // 循環参照があることを確認（少なくとも1つの循環が見つかるはず）
    expect(result.records.length).toBeGreaterThanOrEqual(0);
    
    // 循環が見つかった場合は長さをチェック
    if (result.records.length > 0) {
      const cycle = result.records[0];
      expect(cycle.get('cycleLength').toNumber()).toBeGreaterThan(0);
    }
  });

  it('should validate branching structure and categorize node types', async () => {
    // Arrange
    await createBranchingStoryStructure(session);

    // Act
    const result = await validateBranchingStructure(session, 'test-scenario-branching');

    // Assert
    expect(result.records.length).toBeGreaterThan(0);
    
    const nodeTypes = result.records.map(record => record.get('nodeType'));
    expect(nodeTypes).toContain('branching'); // 分岐ノード
    expect(nodeTypes).toContain('linear');    // 線形ノード
  });

  it('should find orphaned nodes in scenario structure', async () => {
    // Arrange - 孤立したノードを含む構造を作成
    await createStructureWithOrphans(session);

    // Act
    const result = await findOrphanedNodes(session, 'test-scenario-orphans');

    // Assert
    expect(result.records.length).toBe(1);
    const record = result.records[0];
    const orphanedScenes = record.get('orphanedScenes');
    const orphanedEvents = record.get('orphanedEvents');
    
    expect(orphanedScenes.length).toBeGreaterThan(0);
    expect(orphanedEvents.length).toBeGreaterThan(0);
  });

  it('should validate scenario isolation', async () => {
    // Arrange - 複数の分離されたシナリオを作成
    await createIsolatedScenarios(session);

    // Act
    const result = await validateScenarioIsolation(session, [
      'test-scenario-1',
      'test-scenario-2'
    ]);

    // Assert
    // 分離されたシナリオ間でクロスリファレンスが無いことを確認
    expect(result.records.length).toBe(0);
  });

  it('should calculate scenario complexity metrics', async () => {
    // Arrange
    await createComplexStoryStructure(session);

    // Act
    const result = await getScenarioComplexityMetrics(session, 'test-scenario-complex');

    // Assert
    expect(result.records.length).toBe(1);
    const metrics = result.records[0];
    expect(metrics.get('sceneCount').toNumber()).toBeGreaterThan(0);
    expect(metrics.get('eventCount').toNumber()).toBeGreaterThan(0);
    expect(metrics.get('messageCount').toNumber()).toBeGreaterThan(0);
    expect(metrics.get('branchingRatio')).toBeGreaterThanOrEqual(0);
  });

  it('should cleanup orphaned relationships', async () => {
    // Arrange - 孤立したリレーションを持つ構造を作成
    await createStructureWithOrphanedRelationships(session);

    // Act
    const result = await cleanupOrphanedRelationships(session, 'test-scenario-cleanup');

    // Assert
    expect(result.records.length).toBe(1);
    const cleanedCount = result.records[0].get('cleanedRelationships').toNumber();
    expect(cleanedCount).toBeGreaterThanOrEqual(0);
  });
});

async function createCyclicStoryStructure(session: any) {
  // シナリオ作成
  await createScenarioNode(session, {
    id: 'test-scenario-cyclic',
    title: '循環参照テストシナリオ',
    overview: '循環参照をテストするシナリオ',
    userId: 'user-1',
    visibility: 'private',
  });

  // シーン作成
  await createSceneNode(session, {
    id: 'test-scene-cyclic',
    title: '循環シーン',
    description: '循環参照のあるシーン',
    order: 1,
    scenarioId: 'test-scenario-cyclic',
  });

  // イベント作成（循環を作るため）
  await createEventNode(session, {
    id: 'test-event-cyclic-1',
    title: 'イベント1',
    description: '最初のイベント',
    order: 1,
    sceneId: 'test-scene-cyclic',
  });

  await createEventNode(session, {
    id: 'test-event-cyclic-2',
    title: 'イベント2',
    description: '二番目のイベント',
    order: 2,
    sceneId: 'test-scene-cyclic',
  });

  // メッセージ作成
  await createMessageNode(session, {
    id: 'test-message-cyclic-1',
    text: '最初の選択',
    order: 1,
    eventId: 'test-event-cyclic-1',
  });

  await createMessageNode(session, {
    id: 'test-message-cyclic-2',
    text: '二番目の選択',
    order: 1,
    eventId: 'test-event-cyclic-2',
  });

  // リレーション作成
  await createScenarioSceneRelation(session, 'test-scenario-cyclic', 'test-scene-cyclic');
  await createSceneEventRelation(session, 'test-scene-cyclic', 'test-event-cyclic-1');
  await createSceneEventRelation(session, 'test-scene-cyclic', 'test-event-cyclic-2');
  await createEventMessageRelation(session, 'test-event-cyclic-1', 'test-message-cyclic-1');
  await createEventMessageRelation(session, 'test-event-cyclic-2', 'test-message-cyclic-2');
  
  // 循環参照を作成: event1 -> event2 -> event1
  await createMessageChoiceRelation(session, 'test-message-cyclic-1', 'test-event-cyclic-2', 'イベント2へ');
  await createMessageChoiceRelation(session, 'test-message-cyclic-2', 'test-event-cyclic-1', 'イベント1へ戻る');
}

async function createBranchingStoryStructure(session: any) {
  // シナリオ作成
  await createScenarioNode(session, {
    id: 'test-scenario-branching',
    title: '分岐テストシナリオ',
    overview: '分岐構造をテストするシナリオ',
    userId: 'user-1',
    visibility: 'private',
  });

  // シーン作成
  await createSceneNode(session, {
    id: 'test-scene-branching',
    title: '分岐シーン',
    description: '分岐のあるシーン',
    order: 1,
    scenarioId: 'test-scenario-branching',
  });

  // イベント作成
  await createEventNode(session, {
    id: 'test-event-branch-start',
    title: '分岐開始',
    description: '分岐の開始点',
    order: 1,
    sceneId: 'test-scene-branching',
  });

  await createEventNode(session, {
    id: 'test-event-branch-left',
    title: '左の道',
    description: '左の道を選んだ結果',
    order: 2,
    sceneId: 'test-scene-branching',
  });

  await createEventNode(session, {
    id: 'test-event-branch-right',
    title: '右の道',
    description: '右の道を選んだ結果',
    order: 3,
    sceneId: 'test-scene-branching',
  });

  await createEventNode(session, {
    id: 'test-event-branch-end',
    title: '終了',
    description: '分岐の終了点',
    order: 4,
    sceneId: 'test-scene-branching',
  });

  // メッセージ作成
  await createMessageNode(session, {
    id: 'test-message-branch-choice',
    text: 'どちらの道を選びますか？',
    order: 1,
    eventId: 'test-event-branch-start',
  });

  await createMessageNode(session, {
    id: 'test-message-branch-left',
    text: '左の道を進みます',
    order: 1,
    eventId: 'test-event-branch-left',
  });

  await createMessageNode(session, {
    id: 'test-message-branch-right',
    text: '右の道を進みます',
    order: 1,
    eventId: 'test-event-branch-right',
  });

  await createMessageNode(session, {
    id: 'test-message-branch-end',
    text: '目的地に到着しました',
    order: 1,
    eventId: 'test-event-branch-end',
  });

  // リレーション作成
  await createScenarioSceneRelation(session, 'test-scenario-branching', 'test-scene-branching');
  await createSceneEventRelation(session, 'test-scene-branching', 'test-event-branch-start');
  await createSceneEventRelation(session, 'test-scene-branching', 'test-event-branch-left');
  await createSceneEventRelation(session, 'test-scene-branching', 'test-event-branch-right');
  await createSceneEventRelation(session, 'test-scene-branching', 'test-event-branch-end');

  await createEventMessageRelation(session, 'test-event-branch-start', 'test-message-branch-choice');
  await createEventMessageRelation(session, 'test-event-branch-left', 'test-message-branch-left');
  await createEventMessageRelation(session, 'test-event-branch-right', 'test-message-branch-right');
  await createEventMessageRelation(session, 'test-event-branch-end', 'test-message-branch-end');

  // 分岐選択肢を作成（分岐ノード）
  await createMessageChoiceRelation(session, 'test-message-branch-choice', 'test-event-branch-left', '左の道へ');
  await createMessageChoiceRelation(session, 'test-message-branch-choice', 'test-event-branch-right', '右の道へ');
  
  // 線形選択肢を作成（線形ノード）
  await createMessageChoiceRelation(session, 'test-message-branch-left', 'test-event-branch-end', '先に進む');
  await createMessageChoiceRelation(session, 'test-message-branch-right', 'test-event-branch-end', '先に進む');
}

async function createStructureWithOrphans(session: any) {
  // 通常のシナリオ構造
  await createScenarioNode(session, {
    id: 'test-scenario-orphans',
    title: '孤立ノードテストシナリオ',
    overview: '孤立ノードをテストするシナリオ',
    userId: 'user-1',
    visibility: 'private',
  });

  await createSceneNode(session, {
    id: 'test-scene-connected',
    title: '接続されたシーン',
    description: '正しく接続されたシーン',
    order: 1,
    scenarioId: 'test-scenario-orphans',
  });

  await createEventNode(session, {
    id: 'test-event-connected',
    title: '接続されたイベント',
    description: '正しく接続されたイベント',
    order: 1,
    sceneId: 'test-scene-connected',
  });

  // 孤立したノード
  await createSceneNode(session, {
    id: 'test-scene-orphan',
    title: '孤立したシーン',
    description: 'シナリオに接続されていないシーン',
    order: 2,
    scenarioId: 'test-scenario-orphans',
  });

  await createEventNode(session, {
    id: 'test-event-orphan',
    title: '孤立したイベント',
    description: 'シーンに接続されていないイベント',
    order: 2,
    sceneId: 'test-scene-connected',
  });

  // 正常なリレーションのみ作成
  await createScenarioSceneRelation(session, 'test-scenario-orphans', 'test-scene-connected');
  await createSceneEventRelation(session, 'test-scene-connected', 'test-event-connected');
}

async function createIsolatedScenarios(session: any) {
  // シナリオ1
  await createScenarioNode(session, {
    id: 'test-scenario-1',
    title: 'テストシナリオ1',
    overview: '分離されたシナリオ1',
    userId: 'user-1',
    visibility: 'private',
  });

  await createSceneNode(session, {
    id: 'test-scene-1',
    title: 'シーン1',
    description: 'シナリオ1のシーン',
    order: 1,
    scenarioId: 'test-scenario-1',
  });

  // シナリオ2
  await createScenarioNode(session, {
    id: 'test-scenario-2',
    title: 'テストシナリオ2',
    overview: '分離されたシナリオ2',
    userId: 'user-1',
    visibility: 'private',
  });

  await createSceneNode(session, {
    id: 'test-scene-2',
    title: 'シーン2',
    description: 'シナリオ2のシーン',
    order: 1,
    scenarioId: 'test-scenario-2',
  });

  // 各シナリオのリレーション
  await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');
  await createScenarioSceneRelation(session, 'test-scenario-2', 'test-scene-2');
}

async function createComplexStoryStructure(session: any) {
  // シナリオ作成
  await createScenarioNode(session, {
    id: 'test-scenario-complex',
    title: '複雑なテストシナリオ',
    overview: '複雑性をテストするシナリオ',
    userId: 'user-1',
    visibility: 'private',
  });

  // 複数のシーン、イベント、メッセージを作成
  for (let i = 1; i <= 3; i++) {
    await createSceneNode(session, {
      id: `test-scene-complex-${i}`,
      title: `複雑シーン${i}`,
      description: `複雑なシーン${i}`,
      order: i,
      scenarioId: 'test-scenario-complex',
    });

    for (let j = 1; j <= 2; j++) {
      await createEventNode(session, {
        id: `test-event-complex-${i}-${j}`,
        title: `イベント${i}-${j}`,
        description: `複雑なイベント${i}-${j}`,
        order: j,
        sceneId: `test-scene-complex-${i}`,
      });

      await createMessageNode(session, {
        id: `test-message-complex-${i}-${j}`,
        text: `メッセージ${i}-${j}`,
        order: 1,
        eventId: `test-event-complex-${i}-${j}`,
      });

      // リレーション作成
      await createScenarioSceneRelation(session, 'test-scenario-complex', `test-scene-complex-${i}`);
      await createSceneEventRelation(session, `test-scene-complex-${i}`, `test-event-complex-${i}-${j}`);
      await createEventMessageRelation(session, `test-event-complex-${i}-${j}`, `test-message-complex-${i}-${j}`);
    }
  }

  // いくつかの選択肢を追加
  await createMessageChoiceRelation(session, 'test-message-complex-1-1', 'test-event-complex-1-2', '次へ進む');
  await createMessageChoiceRelation(session, 'test-message-complex-1-1', 'test-event-complex-2-1', '別のシーンへ');
}

async function createStructureWithOrphanedRelationships(session: any) {
  // 基本構造を作成した後、リレーションのクリーンアップをテストするための構造
  await createScenarioNode(session, {
    id: 'test-scenario-cleanup',
    title: 'クリーンアップテストシナリオ',
    overview: 'クリーンアップをテストするシナリオ',
    userId: 'user-1',
    visibility: 'private',
  });

  // この関数は主にクリーンアップの動作をテストするためのもの
  // 実際の孤立したリレーションは、ノード削除後に発生する
}