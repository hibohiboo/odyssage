import {
  SceneForm,
  SceneManagementHeader,
  SceneGraphList,
} from '@odyssage/ui/page-ui';
import { useState, useEffect } from 'react';
import { useOptimisticScenes, type Scene } from '../api/useOptimisticScenes';

interface SceneFormData {
  title: string;
  overview: string;
  order: number;
}

interface SceneManagementOptimisticProps {
  scenarioId: string;
  scenes: Scene[];
  onSceneUpdated?: () => void;
}

// 楽観的更新対応のシーン管理コンポーネント
export function SceneManagementOptimistic({
  scenarioId,
  scenes,
  onSceneUpdated,
}: SceneManagementOptimisticProps) {
  // 楽観的更新Hook
  const {
    scenes: optimisticScenes,
    hasUnsavedChanges,
    isLoadingBatch,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    saveAllChanges,
    discardAllChanges,
    refreshFromServer,
  } = useOptimisticScenes(scenarioId, scenes);

  // サーバーデータ変更時に楽観的更新状態をリフレッシュ
  useEffect(() => {
    if (!hasUnsavedChanges) {
      refreshFromServer(scenes);
    }
  }, [scenes, hasUnsavedChanges, refreshFromServer]);

  // フォーム状態管理
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SceneFormData>({
    title: '',
    overview: '',
    order: optimisticScenes.length + 1,
  });

  // フォームリセット
  const resetForm = () => {
    setFormData({
      title: '',
      overview: '',
      order: optimisticScenes.length + 1,
    });
    setIsAddingScene(false);
    setEditingSceneId(null);
  };

  // 新規シーン追加開始
  const handleStartAdding = () => {
    setIsAddingScene(true);
    setFormData({
      title: '',
      overview: '',
      order: optimisticScenes.length,
    });
  };

  // シーン編集開始
  const handleStartEditing = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setFormData({
      title: scene.title,
      overview: scene.overview,
      order: scene.order,
    });
  };

  // 新規シーン作成（楽観的更新）
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.overview) return;

    try {
      // 楽観的更新で即座にUI反映
      optimisticCreate({
        title: formData.title,
        overview: formData.overview,
        order: formData.order,
      });
      
      resetForm();
    } catch (error) {
      console.error('楽観的作成エラー:', error);
      alert('シーンの追加に失敗しました。');
    }
  };

  // シーン更新（楽観的更新）
  const handleUpdateSubmit = async (e: React.FormEvent, scene: Scene) => {
    e.preventDefault();
    if (!formData.title || !formData.overview) return;

    try {
      // 楽観的更新で即座にUI反映
      optimisticUpdate(scene.id, {
        title: formData.title,
        overview: formData.overview,
        order: formData.order,
      });
      
      resetForm();
    } catch (error) {
      console.error('楽観的更新エラー:', error);
      alert('シーンの更新に失敗しました。');
    }
  };

  // シーン削除（楽観的更新）
  const handleDeleteScene = async (scene: Scene) => {
    if (
      !window.confirm(
        `シーン「${scene.title}」を削除しますか？「変更を保存」するまで実際には削除されません。`,
      )
    ) {
      return;
    }

    try {
      // 楽観的更新で即座にUI反映
      optimisticDelete(scene.id);
    } catch (error) {
      console.error('楽観的削除エラー:', error);
      alert('シーンの削除に失敗しました。');
    }
  };

  // 全変更を保存
  const handleSaveAllChanges = async () => {
    try {
      await saveAllChanges();
      onSceneUpdated?.(); // 親コンポーネントに保存完了を通知
    } catch {
      // エラー処理はuseOptimisticScenes内で実行済み
    }
  };

  // 全変更を破棄
  const handleDiscardAllChanges = () => {
    if (
      window.confirm(
        '未保存の変更をすべて破棄しますか？この操作は元に戻せません。',
      )
    ) {
      discardAllChanges();
      resetForm();
    }
  };

  const isLoading = isLoadingBatch;

  return (
    <div className="card p-6">
      {/* 未保存変更の警告とアクションボタン */}
      {hasUnsavedChanges && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-amber-800 font-medium">
                未保存の変更があります
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscardAllChanges}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-amber-700 hover:text-amber-900 disabled:opacity-50"
              >
                変更を破棄
              </button>
              <button
                onClick={handleSaveAllChanges}
                disabled={isLoading}
                className="px-4 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '変更を保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SceneManagementHeader
        onAddScene={handleStartAdding}
        isLoading={isLoading}
      />

      {/* 新規シーン作成フォーム */}
      {isAddingScene && (
        <div className="mb-6">
          <SceneForm
            formData={formData}
            onFormChange={setFormData}
            onSubmit={handleCreateSubmit}
            onCancel={resetForm}
            isLoading={isLoading}
            submitButtonText="シーンを追加"
            title="新しいシーンを作成"
          />
        </div>
      )}

      {/* シーン一覧 */}
      {editingSceneId ? (
        <div className="space-y-4">
          {optimisticScenes.map((scene) => (
            <div key={scene.id} data-testid="scene-item">
              {editingSceneId === scene.id ? (
                <SceneForm
                  formData={formData}
                  onFormChange={setFormData}
                  onSubmit={(e) => handleUpdateSubmit(e, scene)}
                  onCancel={resetForm}
                  isLoading={isLoading}
                  submitButtonText="シーンを更新"
                  title="シーンを編集"
                />
              ) : (
                <div className="border border-stone-200 rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg text-amber-800">
                      {scene.order}. {scene.title}
                      {scene.id.startsWith('temp_') && (
                        <span className="ml-2 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">
                          新規
                        </span>
                      )}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        data-testid="edit-scene-button"
                        onClick={() => handleStartEditing(scene)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        編集
                      </button>
                      <button
                        data-testid="delete-scene-button"
                        onClick={() => handleDeleteScene(scene)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">{scene.overview}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <SceneGraphList
          scenes={optimisticScenes}
          onEditScene={handleStartEditing}
          onDeleteScene={handleDeleteScene}
          isEditable={true}
        />
      )}

      {optimisticScenes.length === 0 && !isAddingScene && (
        <p className="text-stone-500 text-center py-8">
          まだシーンが作成されていません。「新しいシーンを追加」ボタンから作成してください。
        </p>
      )}
    </div>
  );
}