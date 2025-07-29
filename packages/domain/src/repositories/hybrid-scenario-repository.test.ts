// @copilot-context testing
import { driver } from '@odyssage/graph-database/src/driver';
import { TestCleanupHelper } from '@odyssage/graph-database/src/test-utils/test-helpers';
import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Event, EventProps } from '../entities/event';
import { Message, MessageProps } from '../entities/message';
import { Scenario, ScenarioProps, Visibility } from '../entities/scenario';
import { Scene, SceneProps } from '../entities/scene';
import { HybridScenarioRepository } from './hybrid-scenario-repository';

describe('HybridScenarioRepository', () => {
  let session: Session;
  let cleanup: TestCleanupHelper;
  let repository: HybridScenarioRepository;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
    repository = new HybridScenarioRepository(session);
    
    // テスト開始前にクリーンアップを実行
    await cleanup.cleanup();
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should save and retrieve a complete scenario with structure', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('hybrid-repo-save');
    
    // メッセージを作成
    const messageProps: MessageProps = {
      id: testIds.messageId,
      text: 'テストメッセージです。',
      order: 1,
      eventId: testIds.eventId,
    };
    const message = new Message(messageProps);

    // イベントを作成
    const eventProps: EventProps = {
      id: testIds.eventId,
      title: 'テストイベント',
      description: 'テスト用のイベントです。',
      order: 1,
      sceneId: testIds.sceneId,
    };
    const event = new Event(eventProps);
    event.addMessage(message);

    // シーンを作成
    const sceneProps: SceneProps = {
      id: testIds.sceneId,
      title: 'テストシーン',
      description: 'テスト用のシーンです。',
      order: 1,
      scenarioId: testIds.scenarioId,
    };
    const scene = new Scene(sceneProps);
    scene.addEvent(event);

    // シナリオを作成
    const scenarioProps: ScenarioProps = {
      id: testIds.scenarioId,
      title: 'テストシナリオ',
      overview: 'これはテスト用のシナリオです。',
      userId: 'test-user-1',
      visibility: 'private' as Visibility,
      scenes: [scene],
    };
    const scenario = new Scenario(scenarioProps);

    // Act - シナリオを保存
    await repository.save(scenario);

    // Assert - シナリオを取得して検証
    const retrievedScenario = await repository.findById(testIds.scenarioId);
    
    expect(retrievedScenario).not.toBeNull();
    expect(retrievedScenario!.id).toBe(testIds.scenarioId);
    expect(retrievedScenario!.title).toBe('テストシナリオ');
    expect(retrievedScenario!.overview).toBe('これはテスト用のシナリオです。');
    expect(retrievedScenario!.userId).toBe('test-user-1');
    expect(retrievedScenario!.visibility).toBe('private');
  });

  it('should find scenarios by user ID', async () => {
    // Arrange
    const testIds1 = cleanup.generateTestSpecificIdSet('hybrid-repo-user1');
    const testIds2 = cleanup.generateTestSpecificIdSet('hybrid-repo-user2');
    
    const scenario1 = new Scenario({
      id: testIds1.scenarioId,
      title: 'ユーザー1のシナリオ',
      overview: 'ユーザー1が作成したシナリオ',
      userId: 'user-1',
      visibility: 'private' as Visibility,
      scenes: [],
    });

    const scenario2 = new Scenario({
      id: testIds2.scenarioId,
      title: 'ユーザー1の別シナリオ',
      overview: 'ユーザー1が作成した別のシナリオ',
      userId: 'user-1',
      visibility: 'public' as Visibility,
      scenes: [],
    });

    await repository.save(scenario1);
    await repository.save(scenario2);

    // Act
    const userScenarios = await repository.findByUserId('user-1');

    // Assert
    expect(userScenarios).toHaveLength(2);
    expect(userScenarios.map(s => s.id).sort()).toEqual([
      testIds1.scenarioId,
      testIds2.scenarioId
    ].sort());
  });

  it('should find public scenarios with pagination', async () => {
    // Arrange
    const testIds1 = cleanup.generateTestSpecificIdSet('hybrid-repo-public1');
    const testIds2 = cleanup.generateTestSpecificIdSet('hybrid-repo-public2');
    
    const publicScenario1 = new Scenario({
      id: testIds1.scenarioId,
      title: '公開シナリオ1',
      overview: '公開されているシナリオ1',
      userId: 'user-1',
      visibility: 'public' as Visibility,
      scenes: [],
    });

    const publicScenario2 = new Scenario({
      id: testIds2.scenarioId,
      title: '公開シナリオ2',
      overview: '公開されているシナリオ2',
      userId: 'user-2',
      visibility: 'public' as Visibility,
      scenes: [],
    });

    await repository.save(publicScenario1);
    await repository.save(publicScenario2);

    // Act
    const result = await repository.findPublicScenarios(1, 10);

    // Assert
    expect(result.scenarios.length).toBeGreaterThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.hasNext).toBe(false);
  });

  it('should check if scenario exists', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('hybrid-repo-exists');
    
    const scenario = new Scenario({
      id: testIds.scenarioId,
      title: '存在確認テスト',
      overview: '存在確認用のシナリオ',
      userId: 'test-user',
      visibility: 'private' as Visibility,
      scenes: [],
    });

    // Act & Assert - 保存前は存在しない
    const existsBeforeSave = await repository.exists(testIds.scenarioId);
    expect(existsBeforeSave).toBe(false);

    // 保存後は存在する
    await repository.save(scenario);
    const existsAfterSave = await repository.exists(testIds.scenarioId);
    expect(existsAfterSave).toBe(true);
  });

  it('should count scenarios by visibility', async () => {
    // Arrange
    const testIds1 = cleanup.generateTestSpecificIdSet('hybrid-repo-count1');
    const testIds2 = cleanup.generateTestSpecificIdSet('hybrid-repo-count2');
    
    const privateScenario = new Scenario({
      id: testIds1.scenarioId,
      title: 'プライベートシナリオ',
      overview: 'プライベートなシナリオ',
      userId: 'user-1',
      visibility: 'private' as Visibility,
      scenes: [],
    });

    const publicScenario = new Scenario({
      id: testIds2.scenarioId,
      title: '公開シナリオ',
      overview: '公開されているシナリオ',
      userId: 'user-1',
      visibility: 'public' as Visibility,
      scenes: [],
    });

    await repository.save(privateScenario);
    await repository.save(publicScenario);

    // Act
    const privateCount = await repository.countByVisibility('private');
    const publicCount = await repository.countByVisibility('public');

    // Assert
    expect(privateCount).toBeGreaterThanOrEqual(1);
    expect(publicCount).toBeGreaterThanOrEqual(1);
  });

  it('should search scenarios by title', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('hybrid-repo-search');
    
    const scenario = new Scenario({
      id: testIds.scenarioId,
      title: '冒険の始まり',
      overview: '冒険が始まるシナリオ',
      userId: 'test-user',
      visibility: 'public' as Visibility,
      scenes: [],
    });

    await repository.save(scenario);

    // Act
    const searchResults = await repository.searchByTitle('冒険', 10);

    // Assert
    expect(searchResults.length).toBeGreaterThanOrEqual(1);
    const foundScenario = searchResults.find(s => s.id === testIds.scenarioId);
    expect(foundScenario).toBeDefined();
    expect(foundScenario!.title).toBe('冒険の始まり');
  });

  it('should delete scenario', async () => {
    // Arrange
    const testIds = cleanup.generateTestSpecificIdSet('hybrid-repo-delete');
    
    const scenario = new Scenario({
      id: testIds.scenarioId,
      title: '削除テストシナリオ',
      overview: '削除テスト用のシナリオ',
      userId: 'test-user',
      visibility: 'private' as Visibility,
      scenes: [],
    });

    await repository.save(scenario);

    // 保存されていることを確認
    const existsBeforeDelete = await repository.exists(testIds.scenarioId);
    expect(existsBeforeDelete).toBe(true);

    // Act - 削除
    await repository.delete(testIds.scenarioId);

    // Assert - 削除されていることを確認
    const existsAfterDelete = await repository.exists(testIds.scenarioId);
    expect(existsAfterDelete).toBe(false);

    const deletedScenario = await repository.findById(testIds.scenarioId);
    expect(deletedScenario).toBeNull();
  });
});