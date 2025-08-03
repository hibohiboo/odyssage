import { useState, useCallback } from 'react';
import { mutate } from 'swr';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';

// シーン型定義（SceneManagement.tsxと統一）
export type Scene = {
  id: string;
  title: string;
  overview: string;
  scenarioId: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

// 楽観的更新Hook の結果型
interface UseOptimisticScenesResult {
  // データ
  scenes: Scene[];
  hasUnsavedChanges: boolean;
  isLoadingBatch: boolean;
  
  // 操作メソッド
  optimisticCreate: (scene: Omit<Scene, 'id' | 'scenarioId'>) => void;
  optimisticUpdate: (id: string, updates: Partial<Omit<Scene, 'id' | 'scenarioId'>>) => void;
  optimisticDelete: (id: string) => void;
  
  // 保存・破棄
  saveAllChanges: () => Promise<void>;
  discardAllChanges: () => void;
  
  // 状態リセット
  refreshFromServer: (serverScenes: Scene[]) => void;
}

// 楽観的更新Hook
export const useOptimisticScenes = (
  scenarioId: string,
  initialScenes: Scene[] = []
): UseOptimisticScenesResult => {
  // 状態管理
  const [original, setOriginal] = useState<Scene[]>(initialScenes);
  const [current, setCurrent] = useState<Scene[]>(initialScenes);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);

  // 楽観的作成
  const optimisticCreate = useCallback((sceneData: Omit<Scene, 'id' | 'scenarioId'>) => {
    const tempId = `temp_${generateUuid()}`;
    const newScene: Scene = {
      ...sceneData,
      id: tempId,
      scenarioId,
    };

    setCurrent(prev => [...prev, newScene].sort((a, b) => a.order - b.order));
    setHasUnsavedChanges(true);
  }, [scenarioId]);

  // 楽観的更新
  const optimisticUpdate = useCallback((id: string, updates: Partial<Omit<Scene, 'id' | 'scenarioId'>>) => {
    setCurrent(prev => 
      prev.map(scene => 
        scene.id === id 
          ? { ...scene, ...updates }
          : scene
      ).sort((a, b) => a.order - b.order)
    );
    setHasUnsavedChanges(true);
  }, []);

  // 楽観的削除
  const optimisticDelete = useCallback((id: string) => {
    setCurrent(prev => prev.filter(scene => scene.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  // 全変更を保存
  const saveAllChanges = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      setIsLoadingBatch(true);

      // 一括更新APIリクエスト用データ準備
      const scenesForApi = current.map(scene => ({
        // id は送信しない（サーバーで新規生成）
        title: scene.title,
        overview: scene.overview,
        order: scene.order,
      }));

      // 一括更新API呼び出し
      const { $put } = apiClient.api['graph-scenes'].scenario[':scenarioId'].batch;
      const response = await $put({
        param: { scenarioId },
        json: { scenes: scenesForApi }
      });

      if (response.ok) {
        const batchResult = await response.json();
        const updatedScenes = batchResult.scenes;

        // 成功：サーバーデータで状態を更新
        setOriginal(updatedScenes);
        setCurrent(updatedScenes);
        setHasUnsavedChanges(false);

        // SWRキャッシュも更新
        mutate(`api/graph-scenes/scenario/${scenarioId}`, updatedScenes);

        console.log(`一括更新成功: ${batchResult.summary.totalScenes}個のシーンを保存`);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('一括更新エラー:', error);
      
      // エラー時：楽観的更新を巻き戻し
      setCurrent([...original]);
      setHasUnsavedChanges(false);
      
      // ユーザー通知
      alert('保存に失敗しました。変更を元に戻します。');
      
      throw error; // 呼び出し元でエラーハンドリングできるように再throw
    } finally {
      setIsLoadingBatch(false);
    }
  }, [hasUnsavedChanges, current, scenarioId, original]);

  // 全変更を破棄
  const discardAllChanges = useCallback(() => {
    setCurrent([...original]);
    setHasUnsavedChanges(false);
  }, [original]);

  // サーバーデータで状態をリフレッシュ
  const refreshFromServer = useCallback((serverScenes: Scene[]) => {
    setOriginal(serverScenes);
    setCurrent(serverScenes);
    setHasUnsavedChanges(false);
  }, []);

  return {
    scenes: current,
    hasUnsavedChanges,
    isLoadingBatch,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    saveAllChanges,
    discardAllChanges,
    refreshFromServer,
  };
};