// @copilot-context testing
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { driver } from '../driver';
import { createEventNode } from '../nodes/event';
import { createMessageNode } from '../nodes/message';
import { createScenarioNode } from '../nodes/scenario';
import { createSceneNode } from '../nodes/scene';
import { createEventMessageRelation } from '../relationships/event-message';
import { createMessageChoiceRelation } from '../relationships/message-choice';
import { createScenarioSceneRelation } from '../relationships/scenario-scene';
import { createSceneEventRelation } from '../relationships/scene-event';
import {
  TestCleanupHelper,
  generateTestIdSet,
} from '../test-utils/test-helpers';
import {
  getPlayerPath,
  getAvailableChoices,
  navigateToEvent,
  validateStoryPath,
  getCurrentPlayerPosition,
  getReachableEvents,
  findPlayerChoiceHistory,
} from './story-navigation';

describe('Story Navigation Queries', () => {
  let session: any;
  let cleanup: TestCleanupHelper;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should track player path through the story', async () => {
    // Arrange - 分岐のあるストーリーを作成
    const testIds = generateTestIdSet('path-track');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);

    // Act - プレイヤーのパスを記録
    const playerId = `player-${testIds.scenarioId}`;
    cleanup.addTestId(playerId);

    await navigateToEvent(session, playerId, testIds.eventId);
    await navigateToEvent(session, playerId, testIds.eventId2!);

    // Assert - パスが正しく記録されているか確認
    const pathResult = await getPlayerPath(session, playerId);
    expect(pathResult.records.length).toBeGreaterThan(0);

    const visitedEvents = pathResult.records.map(
      (record) => record.get('event').properties.id,
    );
    expect(visitedEvents).toContain(testIds.eventId);
    expect(visitedEvents).toContain(testIds.eventId2);
  });

  it('should get available choices for current player position', async () => {
    // Arrange
    const testIds = generateTestIdSet('choices');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);
    const playerId = `player-${testIds.scenarioId}`;
    cleanup.addTestId(playerId);

    await navigateToEvent(session, playerId, testIds.eventId);

    // Act
    const choicesResult = await getAvailableChoices(session, playerId);

    // Assert
    expect(choicesResult.records.length).toBeGreaterThan(0);
    const choice = choicesResult.records[0];
    expect(choice.get('choice').properties.text).toBe('右の道へ進む');
    expect(choice.get('nextEvent').properties.id).toBe(testIds.eventId2);
  });

  it('should validate if a story path is possible', async () => {
    // Arrange
    const testIds = generateTestIdSet('validate');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);

    // Act
    const validPath = await validateStoryPath(session, [
      testIds.eventId,
      testIds.eventId2!,
    ]);

    const invalidPath = await validateStoryPath(session, [
      testIds.eventId,
      'nonexistent-event',
    ]);

    // Assert
    expect(validPath.records[0].get('isValid')).toBe(true);
    expect(invalidPath.records[0].get('isValid')).toBe(false);
  });

  it('should get current player position', async () => {
    // Arrange
    const testIds = generateTestIdSet('position');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);
    const playerId = `player-${testIds.scenarioId}`;
    cleanup.addTestId(playerId);

    await navigateToEvent(session, playerId, testIds.eventId);
    await navigateToEvent(session, playerId, testIds.eventId2!);

    // Act
    const result = await getCurrentPlayerPosition(session, playerId);

    // Assert
    expect(result.records.length).toBe(1);
    const currentEvent = result.records[0].get('currentEvent');
    expect(currentEvent.properties.id).toBe(testIds.eventId2);
  });

  it('should get reachable events from start point', async () => {
    // Arrange
    const testIds = generateTestIdSet('reachable');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);

    // Act
    const result = await getReachableEvents(session, testIds.eventId, 3);

    // Assert
    expect(result.records.length).toBeGreaterThan(0);
    const reachableEvent = result.records.find(
      (record) => record.get('reachable').properties.id === testIds.eventId2,
    );
    expect(reachableEvent).toBeDefined();
  });

  it('should find player choice history', async () => {
    // Arrange
    const testIds = generateTestIdSet('history');
    cleanup.addTestIdSet(testIds);

    await createCompleteStoryStructure(session, testIds);
    const playerId = `player-${testIds.scenarioId}`;
    cleanup.addTestId(playerId);

    await navigateToEvent(session, playerId, testIds.eventId);
    await navigateToEvent(session, playerId, testIds.eventId2!);

    // Act
    const result = await findPlayerChoiceHistory(session, playerId);

    // Assert
    expect(result.records.length).toBeGreaterThan(0);
    const choiceRecord = result.records.find(
      (record) => record.get('event').properties.id === testIds.eventId,
    );
    expect(choiceRecord).toBeDefined();
    expect(choiceRecord?.get('choice').properties.text).toBe('右の道へ進む');
  });
});

async function createCompleteStoryStructure(session: any, testIds: any) {
  // シナリオ作成
  await createScenarioNode(session, {
    id: testIds.scenarioId,
    title: 'テストシナリオ',
    overview: 'これはテスト用のシナリオです',
    userId: 'user-1',
    visibility: 'private',
  });

  // シーン作成
  await createSceneNode(session, {
    id: testIds.sceneId,
    title: '森の入り口',
    description: '深い森の入り口。木々が鬱蒼と茂っている。',
    order: 1,
    scenarioId: testIds.scenarioId,
  });

  // イベント作成
  await createEventNode(session, {
    id: testIds.eventId,
    title: '選択の瞬間',
    description: '道が二股に分かれています。',
    order: 1,
    sceneId: testIds.sceneId,
  });

  await createEventNode(session, {
    id: testIds.eventId2,
    title: '右の道',
    description: '右の道を進んだ結果。',
    order: 2,
    sceneId: testIds.sceneId,
  });

  // メッセージ作成
  await createMessageNode(session, {
    id: testIds.messageId,
    text: 'どちらの道を選びますか？',
    order: 1,
    eventId: testIds.eventId,
  });

  // リレーション作成
  await createScenarioSceneRelation(
    session,
    testIds.scenarioId,
    testIds.sceneId,
  );
  await createSceneEventRelation(session, testIds.sceneId, testIds.eventId);
  await createSceneEventRelation(session, testIds.sceneId, testIds.eventId2);
  await createEventMessageRelation(session, testIds.eventId, testIds.messageId);
  await createMessageChoiceRelation(
    session,
    testIds.messageId,
    testIds.eventId2,
    '右の道へ進む',
  );
}
