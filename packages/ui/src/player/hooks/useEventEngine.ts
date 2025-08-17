import { useState, useCallback, useRef, useEffect } from 'react';
import {
  EventEngine,
  type MVPEvent,
  type Scene,
  type SessionState,
  type EventExecutionResult,
  type PlayEvent,
} from '../engine/EventEngine';

export interface UseEventEngineProps {
  scenes: Scene[];
  sessionId: string;
  startingSceneId: string;
  onAutoSave?: (sessionState: SessionState) => Promise<void>;
  autoSaveInterval?: number; // ms
}

export interface UseEventEngineReturn {
  // 現在の状態
  currentScene: Scene | null;
  currentEvent: MVPEvent | null;
  sessionState: SessionState | null;

  // Event実行
  executeChoice: (choiceId: string) => void;
  executeContinue: () => void;
  executeSceneTransition: () => void;

  // 状態管理
  isLoading: boolean;
  error: string | null;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';

  // Engine制御
  resetSession: () => void;
  getPlayHistory: () => PlayEvent[];
}

export function useEventEngine({
  scenes,
  sessionId,
  startingSceneId,
  onAutoSave,
  autoSaveInterval = 5000,
}: UseEventEngineProps): UseEventEngineReturn {
  const engineRef = useRef<EventEngine>(new EventEngine());
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [currentEvent, setCurrentEvent] = useState<MVPEvent | null>(null);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');

  // 現在の状態更新
  const updateCurrentState = useCallback(() => {
    const engine = engineRef.current;
    const scene = engine.getCurrentScene();
    const event = engine.getCurrentEvent();
    const state = engine.getSessionState();

    setCurrentScene(scene);
    setCurrentEvent(event);
    setSessionState(state);
  }, []);

  // Engine初期化
  useEffect(() => {
    const engine = engineRef.current;
    try {
      setIsLoading(true);

      // Scenes読み込み
      engine.loadScenes(scenes);

      // Session初期化
      const initialState = engine.initializeSession(sessionId, startingSceneId);
      setSessionState(initialState);

      // 現在のScene・Event設定
      updateCurrentState();

      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Engine initialization failed',
      );
    } finally {
      setIsLoading(false);
    }
  }, [scenes, sessionId, startingSceneId, updateCurrentState]);

  // Event実行結果処理
  const handleEventExecution = useCallback(
    async (result: EventExecutionResult) => {
      if (!result.success) {
        setError(result.error || 'Event execution failed');
        return;
      }

      // 状態更新
      updateCurrentState();

      // 自動保存
      if (onAutoSave && sessionState) {
        try {
          setAutoSaveStatus('saving');
          await onAutoSave(sessionState);
          setAutoSaveStatus('saved');

          // 2秒後にidle状態に戻す
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch (saveError) {
          setAutoSaveStatus('error');
          console.error('Auto save failed:', saveError);
        }
      }

      setError(null);
    },
    [updateCurrentState, onAutoSave, sessionState],
  );

  // Choice Event実行
  const executeChoice = useCallback(
    async (choiceId: string) => {
      setIsLoading(true);
      try {
        const result = engineRef.current.executeChoiceEvent(choiceId);
        await handleEventExecution(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Choice execution failed',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [handleEventExecution],
  );

  // Continue Event実行
  const executeContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = engineRef.current.executeContinueEvent();
      await handleEventExecution(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Continue execution failed',
      );
    } finally {
      setIsLoading(false);
    }
  }, [handleEventExecution]);

  // Scene Transition実行
  const executeSceneTransition = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = engineRef.current.executeSceneTransition();
      await handleEventExecution(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scene transition failed');
    } finally {
      setIsLoading(false);
    }
  }, [handleEventExecution]);

  // Session リセット
  const resetSession = useCallback(() => {
    try {
      const engine = engineRef.current;
      const newState = engine.initializeSession(sessionId, startingSceneId);
      setSessionState(newState);
      updateCurrentState();
      setError(null);
      setAutoSaveStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Session reset failed');
    }
  }, [sessionId, startingSceneId, updateCurrentState]);

  // プレイ履歴取得
  const getPlayHistory = useCallback(
    () => sessionState?.playHistory || [],
    [sessionState],
  );

  // 定期自動保存
  useEffect(() => {
    if (!onAutoSave || !sessionState || autoSaveInterval <= 0) return undefined;

    const interval = setInterval(async () => {
      if (autoSaveStatus === 'saving') return; // 保存中はスキップ

      try {
        setAutoSaveStatus('saving');
        await onAutoSave(sessionState);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 1000);
      } catch (saveError) {
        setAutoSaveStatus('error');
        console.error('Periodic auto save failed:', saveError);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [onAutoSave, sessionState, autoSaveInterval, autoSaveStatus]);

  return {
    // 現在の状態
    currentScene,
    currentEvent,
    sessionState,

    // Event実行
    executeChoice,
    executeContinue,
    executeSceneTransition,

    // 状態管理
    isLoading,
    error,
    autoSaveStatus,

    // Engine制御
    resetSession,
    getPlayHistory,
  };
}
