// @copilot-context naming
import { Event, EventProps } from '../entities/event';
import { Message, MessageProps } from '../entities/message';
import { Scenario, ScenarioProps, Visibility } from '../entities/scenario';
import { Scene, SceneProps } from '../entities/scene';
import { ScenarioRepository } from '../repositories/scenario-repository';
import { IdGenerator } from '../utils/id-generator';

/**
 * シナリオ作成サービス
 * 複雑なシナリオ作成ロジックを担当するドメインサービス
 */
export class ScenarioCreationService {
  constructor(private scenarioRepository: ScenarioRepository) {}

  /**
   * 基本シナリオを作成
   * 最小限の構造（1シーン、1イベント、1メッセージ）で初期化
   */
  async createBasicScenario(
    userId: string,
    title: string,
    overview: string,
  ): Promise<Scenario> {
    // シナリオIDを生成
    const scenarioId = ScenarioCreationService.generateId('scenario');

    // 基本シーンを作成
    const sceneProps: SceneProps = {
      id: ScenarioCreationService.generateId('scene'),
      title: '始まりのシーン',
      description: 'ストーリーの始まりです。',
      order: 1,
      scenarioId,
    };

    // 基本イベントを作成
    const eventProps: EventProps = {
      id: ScenarioCreationService.generateId('event'),
      title: '物語の開始',
      description: 'あなたの冒険が始まります。',
      order: 1,
      sceneId: sceneProps.id,
    };

    // 基本メッセージを作成
    const messageProps: MessageProps = {
      id: ScenarioCreationService.generateId('message'),
      text: 'ここから物語が始まります。どのような冒険が待っているでしょうか？',
      order: 1,
      eventId: eventProps.id,
    };

    // エンティティを構築
    const message = new Message(messageProps);
    const event = new Event(eventProps);
    event.addMessage(message);

    const scene = new Scene(sceneProps);
    scene.addEvent(event);

    const scenarioProps: ScenarioProps = {
      id: scenarioId,
      title,
      overview,
      userId,
      visibility: 'draft' as Visibility,
      scenes: [scene],
    };

    const scenario = new Scenario(scenarioProps);

    // 保存
    await this.scenarioRepository.save(scenario);

    return scenario;
  }

  /**
   * テンプレートからシナリオを作成
   */
  async createFromTemplate(
    userId: string,
    templateType: 'simple-choice' | 'branching-story' | 'mystery',
    title: string,
    overview: string,
  ): Promise<Scenario> {
    const scenarioId = ScenarioCreationService.generateId('scenario');

    const scenarioProps: ScenarioProps = {
      id: scenarioId,
      title,
      overview,
      userId,
      visibility: 'draft' as Visibility,
      scenes: [],
    };

    const scenario = new Scenario(scenarioProps);

    switch (templateType) {
      case 'simple-choice':
        ScenarioCreationService.addSimpleChoiceTemplate(scenario);
        break;
      case 'branching-story':
        this.addBranchingStoryTemplate(scenario);
        break;
      case 'mystery':
        this.addMysteryTemplate(scenario);
        break;
      default:
        throw new Error(`未対応のテンプレートタイプです: ${templateType}`);
    }

    await this.scenarioRepository.save(scenario);
    return scenario;
  }

  /**
   * シナリオを複製
   */
  async duplicateScenario(
    originalScenarioId: string,
    userId: string,
    newTitle: string,
  ): Promise<Scenario> {
    const originalScenario =
      await this.scenarioRepository.findByIdWithFullStructure(
        originalScenarioId,
      );

    if (!originalScenario) {
      throw new Error('複製元のシナリオが見つかりません');
    }

    // 新しいIDで全要素を複製
    const newScenarioId = ScenarioCreationService.generateId('scenario');
    const idMapping = new Map<string, string>();

    // シナリオを複製
    const duplicatedScenario = this.duplicateScenarioStructure(
      originalScenario,
      newScenarioId,
      userId,
      newTitle,
      idMapping,
    );

    await this.scenarioRepository.save(duplicatedScenario);
    return duplicatedScenario;
  }

  private static addSimpleChoiceTemplate(scenario: Scenario): void {
    // 簡単な2択選択のテンプレートを追加
    const sceneId = ScenarioCreationService.generateId('scene');
    const scene = new Scene({
      id: sceneId,
      title: '分かれ道',
      description: '道が二手に分かれています。',
      order: 1,
      scenarioId: scenario.id,
    });

    // 選択イベント
    const choiceEventId = ScenarioCreationService.generateId('event');
    const choiceEvent = new Event({
      id: choiceEventId,
      title: '道の選択',
      description: 'どちらの道を選びますか？',
      order: 1,
      sceneId,
    });

    const choiceMessage = new Message({
      id: ScenarioCreationService.generateId('message'),
      text: '目の前に二つの道があります。左の道は明るく、右の道は暗い森へと続いています。',
      order: 1,
      eventId: choiceEventId,
    });

    choiceEvent.addMessage(choiceMessage);
    scene.addEvent(choiceEvent);

    // 結果イベント（左）
    const leftEventId = ScenarioCreationService.generateId('event');
    const leftEvent = new Event({
      id: leftEventId,
      title: '明るい道',
      description: '明るい道を選んだ結果です。',
      order: 2,
      sceneId,
    });

    const leftMessage = new Message({
      id: ScenarioCreationService.generateId('message'),
      text: '明るい道を選んだあなたは、美しい花畑に辿り着きました。',
      order: 1,
      eventId: leftEventId,
    });

    leftEvent.addMessage(leftMessage);
    scene.addEvent(leftEvent);

    // 結果イベント（右）
    const rightEventId = ScenarioCreationService.generateId('event');
    const rightEvent = new Event({
      id: rightEventId,
      title: '暗い森',
      description: '暗い森を選んだ結果です。',
      order: 3,
      sceneId,
    });

    const rightMessage = new Message({
      id: ScenarioCreationService.generateId('message'),
      text: '暗い森に入ったあなたは、神秘的な光を発見しました。',
      order: 1,
      eventId: rightEventId,
    });

    rightEvent.addMessage(rightMessage);
    scene.addEvent(rightEvent);

    scenario.addScene(scene);
  }

  // TODO: 将来的にテンプレートリポジトリやバリデーターでthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private addBranchingStoryTemplate(_scenario: Scenario): void {
    // より複雑な分岐ストーリーのテンプレート
    // 実装は省略（同様のパターンで複数シーン・複数分岐を作成）
  }

  // TODO: 将来的にテンプレートエンジンやイベント発行でthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private addMysteryTemplate(_scenario: Scenario): void {
    // ミステリー系のテンプレート
    // 実装は省略（証拠収集・推理要素を含む構造を作成）
  }

  // TODO: 将来的にIDジェネレーターやマッピングサービスでthisを使用予定
  // eslint-disable-next-line class-methods-use-this
  private duplicateScenarioStructure(
    original: Scenario,
    newScenarioId: string,
    userId: string,
    newTitle: string,
    idMapping: Map<string, string>,
  ): Scenario {
    // ID マッピングを作成
    idMapping.set(original.id, newScenarioId);

    const newScenario = new Scenario({
      id: newScenarioId,
      title: newTitle,
      overview: original.overview,
      userId,
      visibility: 'draft' as Visibility,
      scenes: [],
    });

    // シーンを複製
    original.scenes.forEach((scene) => {
      const newSceneId = ScenarioCreationService.generateId('scene');
      idMapping.set(scene.id, newSceneId);

      const newScene = new Scene({
        id: newSceneId,
        title: scene.title,
        description: scene.description,
        order: scene.order,
        scenarioId: newScenarioId,
      });

      // イベントを複製
      scene.events.forEach((event) => {
        const newEventId = ScenarioCreationService.generateId('event');
        idMapping.set(event.id, newEventId);

        const newEvent = new Event({
          id: newEventId,
          title: event.title,
          description: event.description,
          order: event.order,
          sceneId: newSceneId,
        });

        // メッセージを複製
        event.messages.forEach((message) => {
          const newMessageId = ScenarioCreationService.generateId('message');
          idMapping.set(message.id, newMessageId);

          const newMessage = new Message({
            id: newMessageId,
            text: message.text,
            order: message.order,
            eventId: newEventId,
          });

          newEvent.addMessage(newMessage);
        });

        newScene.addEvent(newEvent);
      });

      newScenario.addScene(newScene);
    });

    return newScenario;
  }

  private static generateId(prefix: string): string {
    switch (prefix) {
      case 'scenario':
        return IdGenerator.generateScenarioId();
      case 'scene':
        return IdGenerator.generateSceneId();
      case 'event':
        return IdGenerator.generateEventId();
      case 'message':
        return IdGenerator.generateMessageId();
      default:
        return IdGenerator.generateUuid();
    }
  }
}
