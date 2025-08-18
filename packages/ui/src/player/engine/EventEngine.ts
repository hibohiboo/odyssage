// Event処理エンジン - data-design.md準拠
export type EventType =
  | 'choice'
  | 'narrative'
  | 'dialogue'
  | 'scene_transition'
  | 'exploration'
  | 'item_acquire'
  | 'skill_use'
  | 'condition';

// MVP必須・最小限Eventのみ実装
export type MVPEventType =
  | 'choice'
  | 'narrative'
  | 'dialogue'
  | 'scene_transition'
  | 'exploration';

// Event基本構造
export interface BaseEvent {
  id: string;
  type: EventType;
  title?: string;
  content: string;
  nextEventId?: string; // 単一遷移用
  tags?: string[];
}

// Choice Event（MVP必須）
export interface ChoiceEvent extends BaseEvent {
  type: 'choice';
  data: {
    choices: Choice[];
  };
}

export interface Choice {
  id: string;
  text: string;
  description?: string;
  nextEventId: string; // 選択肢毎の遷移先
  type?: ChoiceActionType;
  isAvailable?: boolean;
}

export type ChoiceActionType = 'action' | 'dialogue' | 'strategic' | 'creative';

// Narrative Event（MVP必須）
export interface NarrativeEvent extends BaseEvent {
  type: 'narrative';
  data: {
    narrativeText: string;
  };
}

// Dialogue Event（MVP最小限）
export interface DialogueEvent extends BaseEvent {
  type: 'dialogue';
  data: {
    npcName: string;
    npcText: string;
  };
}

// Scene Transition Event（MVP必須）
export interface SceneTransitionEvent extends BaseEvent {
  type: 'scene_transition';
  data: {
    targetSceneId: string;
    transitionText?: string;
  };
}

// Exploration Event（MVP最小限）
export interface ExplorationEvent extends BaseEvent {
  type: 'exploration';
  data: {
    targetName: string;
    resultText: string;
  };
}

// MVP Event Union Type
export type MVPEvent =
  | ChoiceEvent
  | NarrativeEvent
  | DialogueEvent
  | SceneTransitionEvent
  | ExplorationEvent;

// Scene構造
export interface Scene {
  id: string;
  title: string;
  description?: string;
  backgroundImage?: string;
  startingEventId: string;
  events: MVPEvent[];
}

// Session状態
export interface SessionState {
  sessionId: string;
  currentSceneId: string;
  currentEventId: string;
  playHistory: PlayEvent[];
  lastSavedAt: string;
}

// プレイ履歴
export interface PlayEvent {
  eventId: string;
  eventType: EventType;
  sceneId: string;
  actionTaken?: string; // choice選択時の内容
  executedAt: string;
}

// Event処理結果
export interface EventExecutionResult {
  success: boolean;
  nextEventId?: string;
  nextSceneId?: string;
  error?: string;
  playEvent: PlayEvent;
}

// Event処理エンジンクラス
export class EventEngine {
  private scenes: Map<string, Scene> = new Map();

  private sessionState: SessionState | null = null;

  // Scene読み込み
  loadScenes(scenes: Scene[]): void {
    this.scenes.clear();
    scenes.forEach((scene) => {
      this.scenes.set(scene.id, scene);
    });
  }

  // Session初期化
  initializeSession(sessionId: string, startingSceneId: string): SessionState {
    const scene = this.scenes.get(startingSceneId);
    if (!scene) {
      throw new Error(`Scene not found: ${startingSceneId}`);
    }

    this.sessionState = {
      sessionId,
      currentSceneId: startingSceneId,
      currentEventId: scene.startingEventId,
      playHistory: [],
      lastSavedAt: new Date().toISOString(),
    };

    return this.sessionState;
  }

  // 現在のEvent取得
  getCurrentEvent(): MVPEvent | null {
    if (!this.sessionState) return null;

    const scene = this.scenes.get(this.sessionState.currentSceneId);
    if (!scene) return null;

    return (
      scene.events.find(
        (event) => event.id === this.sessionState!.currentEventId,
      ) || null
    );
  }

  // 現在のScene取得
  getCurrentScene(): Scene | null {
    if (!this.sessionState) return null;
    return this.scenes.get(this.sessionState.currentSceneId) || null;
  }

  // Choice Event実行
  executeChoiceEvent(choiceId: string): EventExecutionResult {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent || currentEvent.type !== 'choice') {
      return {
        success: false,
        error: 'Invalid choice event execution',
        playEvent: this.createPlayEvent(currentEvent?.id || '', 'choice'),
      };
    }

    const choice = currentEvent.data.choices.find((c) => c.id === choiceId);
    if (!choice) {
      return {
        success: false,
        error: 'Choice not found',
        playEvent: this.createPlayEvent(currentEvent.id, 'choice'),
      };
    }

    const playEvent = this.createPlayEvent(
      currentEvent.id,
      'choice',
      choice.text,
    );
    this.addToHistory(playEvent);

    // 次Eventへの遷移
    this.sessionState!.currentEventId = choice.nextEventId;

    return {
      success: true,
      nextEventId: choice.nextEventId,
      playEvent,
    };
  }

  // Continue Event実行（narrative, dialogue, exploration用）
  executeContinueEvent(): EventExecutionResult {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent) {
      return {
        success: false,
        error: 'No current event',
        playEvent: this.createPlayEvent('', 'narrative'),
      };
    }

    if (!['narrative', 'dialogue', 'exploration'].includes(currentEvent.type)) {
      return {
        success: false,
        error: 'Invalid continue event type',
        playEvent: this.createPlayEvent(currentEvent.id, currentEvent.type),
      };
    }

    const playEvent = this.createPlayEvent(
      currentEvent.id,
      currentEvent.type,
      'continue',
    );
    this.addToHistory(playEvent);

    // nextEventIdへの遷移
    if (currentEvent.nextEventId) {
      this.sessionState!.currentEventId = currentEvent.nextEventId;
      return {
        success: true,
        nextEventId: currentEvent.nextEventId,
        playEvent,
      };
    }

    return {
      success: true,
      playEvent,
    };
  }

  // Scene Transition実行
  executeSceneTransition(): EventExecutionResult {
    const currentEvent = this.getCurrentEvent();
    if (!currentEvent || currentEvent.type !== 'scene_transition') {
      return {
        success: false,
        error: 'Invalid scene transition',
        playEvent: this.createPlayEvent(
          currentEvent?.id || '',
          'scene_transition',
        ),
      };
    }

    const playEvent = this.createPlayEvent(currentEvent.id, 'scene_transition');
    this.addToHistory(playEvent);

    const { targetSceneId } = currentEvent.data;
    const targetScene = this.scenes.get(targetSceneId);

    if (!targetScene) {
      return {
        success: false,
        error: `Target scene not found: ${targetSceneId}`,
        playEvent,
      };
    }

    // Scene遷移実行
    this.sessionState!.currentSceneId = targetSceneId;
    this.sessionState!.currentEventId = targetScene.startingEventId;

    return {
      success: true,
      nextSceneId: targetSceneId,
      nextEventId: targetScene.startingEventId,
      playEvent,
    };
  }

  // Session状態取得
  getSessionState(): SessionState | null {
    return this.sessionState;
  }

  // 履歴に追加
  private addToHistory(playEvent: PlayEvent): void {
    if (this.sessionState) {
      this.sessionState.playHistory.push(playEvent);
      this.sessionState.lastSavedAt = new Date().toISOString();
    }
  }

  // PlayEvent作成
  private createPlayEvent(
    eventId: string,
    eventType: EventType,
    actionTaken?: string,
  ): PlayEvent {
    return {
      eventId,
      eventType,
      sceneId: this.sessionState?.currentSceneId || '',
      actionTaken,
      executedAt: new Date().toISOString(),
    };
  }

  // Event Type Guard
  static isChoiceEvent(event: MVPEvent): event is ChoiceEvent {
    return event.type === 'choice';
  }

  static isNarrativeEvent(event: MVPEvent): event is NarrativeEvent {
    return event.type === 'narrative';
  }

  static isDialogueEvent(event: MVPEvent): event is DialogueEvent {
    return event.type === 'dialogue';
  }

  static isSceneTransitionEvent(
    event: MVPEvent,
  ): event is SceneTransitionEvent {
    return event.type === 'scene_transition';
  }

  static isExplorationEvent(event: MVPEvent): event is ExplorationEvent {
    return event.type === 'exploration';
  }
}
