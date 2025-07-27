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
  getPlayerPath, 
  getAvailableChoices, 
  navigateToEvent, 
  validateStoryPath 
} from './story-navigation';

describe('Story Navigation Queries', () => {
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

  it('should track player path through the story', async () => {
    // Arrange - 分岐のあるストーリーを作成
    await createCompleteStoryStructure(session);

    // Act - プレイヤーのパスを記録
    const startResult = await navigateToEvent(session, 'test-player-1', 'test-event-1');
    const nextResult = await navigateToEvent(session, 'test-player-1', 'test-event-2');

    // Assert - パスが正しく記録されているか確認
    const pathResult = await getPlayerPath(session, 'test-player-1');
    expect(pathResult.records.length).toBeGreaterThan(0);
    
    const visitedEvents = pathResult.records.map(record => 
      record.get('event').properties.id
    );
    expect(visitedEvents).toContain('test-event-1');
    expect(visitedEvents).toContain('test-event-2');
  });

  it('should get available choices for current player position', async () => {
    // Arrange
    await createCompleteStoryStructure(session);
    await navigateToEvent(session, 'test-player-1', 'test-event-1');

    // Act
    const choicesResult = await getAvailableChoices(session, 'test-player-1');

    // Assert
    expect(choicesResult.records.length).toBeGreaterThan(0);
    const choice = choicesResult.records[0];
    expect(choice.get('choice').properties.text).toBe('右の道へ進む');
    expect(choice.get('nextEvent').properties.id).toBe('test-event-2');
  });

  it('should validate if a story path is possible', async () => {
    // Arrange
    await createCompleteStoryStructure(session);

    // Act
    const validPath = await validateStoryPath(session, [
      'test-event-1',
      'test-event-2'
    ]);

    const invalidPath = await validateStoryPath(session, [
      'test-event-1',
      'test-event-3' // 存在しないイベント
    ]);

    // Assert
    expect(validPath.records[0].get('isValid')).toBe(true);
    expect(invalidPath.records[0].get('isValid')).toBe(false);
  });
});

async function createCompleteStoryStructure(session: any) {
  // シナリオ作成
  await createScenarioNode(session, {
    id: 'test-scenario-1',
    title: 'テストシナリオ',
    overview: 'これはテスト用のシナリオです',
    userId: 'user-1',
    visibility: 'private',
  });

  // シーン作成
  await createSceneNode(session, {
    id: 'test-scene-1',
    title: '森の入り口',
    description: '深い森の入り口。木々が鬱蒼と茂っている。',
    order: 1,
    scenarioId: 'test-scenario-1',
  });

  // イベント作成
  await createEventNode(session, {
    id: 'test-event-1',
    title: '選択の瞬間',
    description: '道が二股に分かれています。',
    order: 1,
    sceneId: 'test-scene-1',
  });

  await createEventNode(session, {
    id: 'test-event-2',
    title: '右の道',
    description: '右の道を進んだ結果。',
    order: 2,
    sceneId: 'test-scene-1',
  });

  // メッセージ作成
  await createMessageNode(session, {
    id: 'test-message-1',
    text: 'どちらの道を選びますか？',
    order: 1,
    eventId: 'test-event-1',
  });

  // リレーション作成
  await createScenarioSceneRelation(session, 'test-scenario-1', 'test-scene-1');
  await createSceneEventRelation(session, 'test-scene-1', 'test-event-1');
  await createSceneEventRelation(session, 'test-scene-1', 'test-event-2');
  await createEventMessageRelation(session, 'test-event-1', 'test-message-1');
  await createMessageChoiceRelation(session, 'test-message-1', 'test-event-2', '右の道へ進む');
}