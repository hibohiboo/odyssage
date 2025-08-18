import type { Scene } from '@odyssage/schema';
import type { UseEventEngineProps } from '@odyssage/ui/player/hooks/useEventEngine';
import { useEventEngine } from '@odyssage/ui/player/hooks/useEventEngine';
import {
  PlaySessionView,
  type PlaySessionViewProps,
} from '@odyssage/ui/player/organisms/PlaySessionView/index';
import { useEffect, useState, useMemo } from 'react';
import { AutoSaveService } from '../services/AutoSaveService';
import { SceneLoader } from '../services/SceneLoader';

interface PlaySessionContainerProps {
  sessionId: string;
  startingSceneId: string;
}

export function PlaySessionContainer({
  sessionId,
  startingSceneId,
}: PlaySessionContainerProps) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Service インスタンス（useMemoで最適化）
  const sceneLoader = useMemo(() => new SceneLoader(), []);
  const autoSaveService = useMemo(() => new AutoSaveService(), []);

  // Scene データの読み込み
  useEffect(() => {
    const loadScenes = async () => {
      try {
        setIsInitialLoading(true);
        const loadedScenes = await sceneLoader.loadScenesForSession(sessionId);
        setScenes(loadedScenes);
        setLoadingError(null);
      } catch (error) {
        setLoadingError('シーンデータの読み込みに失敗しました');
        console.error('Scene loading failed:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadScenes();
  }, [sessionId, sceneLoader]);

  // useEventEngine の設定
  const eventEngineProps: UseEventEngineProps = {
    scenes,
    sessionId,
    startingSceneId,
    onAutoSave: async (sessionState) => {
      await autoSaveService.saveSession(sessionState);
    },
    autoSaveInterval: 10000, // 10秒間隔
  };

  const eventEngine = useEventEngine(eventEngineProps);

  // PlaySessionViewProps へのマッピング
  const mapToViewProps = (): PlaySessionViewProps => ({
    // Scene 情報
    currentScene: eventEngine.currentScene,
    currentEvent: eventEngine.currentEvent,

    // Session 情報
    sessionInfo: {
      sessionId,
      title: `セッション ${sessionId}`,
    },

    // Event ハンドラー
    onChoiceSelect: eventEngine.executeChoice,
    onContinue: eventEngine.executeContinue,
    onMenuAccess: () => {
      // メニューアクセス処理（未実装）
    },
    onExitSession: () => {
      // セッション終了処理（未実装）
    },

    // 状態管理
    loading: isInitialLoading || eventEngine.isLoading,
    error: loadingError || eventEngine.error,
    autoSaveStatus: eventEngine.autoSaveStatus,
  });

  // 初期読み込みエラー時の表示
  if (loadingError && scenes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 mb-4">{loadingError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          再試行
        </button>
      </div>
    );
  }

  // Scene データ未読み込み時のローディング
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">セッションを読み込み中...</p>
        </div>
      </div>
    );
  }

  return <PlaySessionView {...mapToViewProps()} />;
}
