// @copilot-context testing
import { driver } from '@odyssage/graph-database/src/driver';
import { TestCleanupHelper } from '@odyssage/graph-database/src/test-utils/test-helpers';
import { Session } from 'neo4j-driver';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HybridScenarioRepository } from '../repositories/hybrid-scenario-repository';
import { ScenarioCreationService } from './scenario-creation-service';

describe('ScenarioCreationService with HybridRepository', () => {
  let session: Session;
  let cleanup: TestCleanupHelper;
  let repository: HybridScenarioRepository;
  let service: ScenarioCreationService;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
    repository = new HybridScenarioRepository(session);
    service = new ScenarioCreationService(repository);
    
    // テスト開始前にクリーンアップを実行
    await cleanup.cleanup();
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('should create a basic scenario with complete structure in Neo4j', async () => {
    // Arrange
    const userId = 'test-user-1';
    const title = 'テストシナリオ';
    const overview = 'テスト用の基本シナリオです。';

    // Act
    const createdScenario = await service.createBasicScenario(userId, title, overview);

    // Assert - エンティティの確認
    expect(createdScenario.title).toBe(title);
    expect(createdScenario.overview).toBe(overview);
    expect(createdScenario.userId).toBe(userId);
    expect(createdScenario.visibility).toBe('draft');

    // シーン構造の確認
    const scenes = createdScenario.scenes;
    expect(scenes).toHaveLength(1);
    expect(scenes[0].title).toBe('始まりのシーン');

    // イベント構造の確認
    const events = scenes[0].events;
    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('物語の開始');

    // メッセージ構造の確認
    const messages = events[0].messages;
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('ここから物語が始まります。どのような冒険が待っているでしょうか？');

    // Neo4jからの取得確認
    const retrievedScenario = await repository.findById(createdScenario.id);
    expect(retrievedScenario).not.toBeNull();
    expect(retrievedScenario!.title).toBe(title);
  });

  it('should create scenario from simple-choice template', async () => {
    // Arrange
    const userId = 'test-user-2';
    const title = '選択式シナリオ';
    const overview = '二択の選択肢があるシナリオです。';

    // Act
    const createdScenario = await service.createFromTemplate(
      userId,
      'simple-choice',
      title,
      overview,
    );

    // Assert
    expect(createdScenario.title).toBe(title);
    expect(createdScenario.visibility).toBe('draft');

    // テンプレート構造の確認
    const scenes = createdScenario.scenes;
    expect(scenes).toHaveLength(1);
    expect(scenes[0].title).toBe('分かれ道');

    // 選択イベント＋結果イベント（左・右）= 3つのイベント
    const events = scenes[0].events;
    expect(events).toHaveLength(3);

    // 選択イベントの確認
    const choiceEvent = events.find(e => e.title === '道の選択');
    expect(choiceEvent).toBeDefined();

    // 結果イベントの確認
    const leftEvent = events.find(e => e.title === '明るい道');
    const rightEvent = events.find(e => e.title === '暗い森');
    expect(leftEvent).toBeDefined();
    expect(rightEvent).toBeDefined();

    // Neo4jからの取得確認
    const retrievedScenario = await repository.findById(createdScenario.id);
    expect(retrievedScenario).not.toBeNull();
  });

  it('should create scenario from branching-story template', async () => {
    // Arrange
    const userId = 'test-user-3';
    const title = '分岐ストーリー';
    const overview = '複雑な分岐があるストーリーです。';

    // Act
    const createdScenario = await service.createFromTemplate(
      userId,
      'branching-story',
      title,
      overview,
    );

    // Assert
    expect(createdScenario.title).toBe(title);
    expect(createdScenario.visibility).toBe('draft');

    // Neo4jに保存されていることを確認
    const retrievedScenario = await repository.findById(createdScenario.id);
    expect(retrievedScenario).not.toBeNull();
  });

  it('should create scenario from mystery template', async () => {
    // Arrange
    const userId = 'test-user-4';
    const title = 'ミステリーシナリオ';
    const overview = '謎解き要素のあるシナリオです。';

    // Act
    const createdScenario = await service.createFromTemplate(
      userId,
      'mystery',
      title,
      overview,
    );

    // Assert
    expect(createdScenario.title).toBe(title);
    expect(createdScenario.visibility).toBe('draft');

    // Neo4jに保存されていることを確認
    const retrievedScenario = await repository.findById(createdScenario.id);
    expect(retrievedScenario).not.toBeNull();
  });

  it('should throw error for unsupported template type', async () => {
    // Arrange
    const userId = 'test-user-5';
    const title = 'サポート外テンプレート';
    const overview = 'サポートされていないテンプレートのテスト';

    // Act & Assert
    await expect(
      service.createFromTemplate(
        userId,
        'unsupported-template' as any,
        title,
        overview,
      ),
    ).rejects.toThrow('未対応のテンプレートタイプです: unsupported-template');
  });

  it('should duplicate existing scenario', async () => {
    // Arrange - 元のシナリオを作成
    const originalUserId = 'original-user';
    const originalTitle = '元のシナリオ';
    const originalOverview = '複製される元のシナリオです。';

    const originalScenario = await service.createBasicScenario(
      originalUserId,
      originalTitle,
      originalOverview,
    );

    // Act - シナリオを複製
    const newUserId = 'new-user';
    const newTitle = '複製されたシナリオ';

    const duplicatedScenario = await service.duplicateScenario(
      originalScenario.id,
      newUserId,
      newTitle,
    );

    // Assert
    expect(duplicatedScenario.id).not.toBe(originalScenario.id);
    expect(duplicatedScenario.title).toBe(newTitle);
    expect(duplicatedScenario.overview).toBe(originalOverview);
    expect(duplicatedScenario.userId).toBe(newUserId);
    expect(duplicatedScenario.visibility).toBe('draft');

    // 構造の確認
    expect(duplicatedScenario.scenes).toHaveLength(1);
    expect(duplicatedScenario.scenes[0].events).toHaveLength(1);
    expect(duplicatedScenario.scenes[0].events[0].messages).toHaveLength(1);

    // Neo4jに保存されていることを確認
    const retrievedDuplicated = await repository.findById(duplicatedScenario.id);
    expect(retrievedDuplicated).not.toBeNull();
    expect(retrievedDuplicated!.title).toBe(newTitle);

    // 元のシナリオが残っていることを確認
    const retrievedOriginal = await repository.findById(originalScenario.id);
    expect(retrievedOriginal).not.toBeNull();
    expect(retrievedOriginal!.title).toBe(originalTitle);
  });

  it('should throw error when trying to duplicate non-existent scenario', async () => {
    // Arrange
    const nonExistentId = 'non-existent-scenario-id';
    const newUserId = 'new-user';
    const newTitle = '複製テスト';

    // Act & Assert
    await expect(
      service.duplicateScenario(nonExistentId, newUserId, newTitle),
    ).rejects.toThrow('複製元のシナリオが見つかりません');
  });
});