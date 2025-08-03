import { GraphSceneRequest } from '@odyssage/schema/src/schema';
import {
  SceneForm,
  SceneManagementHeader,
  SceneGraphList,
} from '@odyssage/ui/page-ui';
import { useState } from 'react';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { useGraphSceneDeleteMutation } from '../api/useGraphSceneDeleteMutation';
import { useGraphSceneMutation } from '../api/useGraphSceneMutation';

// シーン管理用の型定義（UIライブラリから独立）
export type Scene = {
  id: string;
  title: string;
  overview: string;
  scenarioId: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

interface SceneFormData {
  title: string;
  overview: string;
  order: number;
}

interface SceneManagementProps {
  scenarioId: string;
  scenes: Scene[];
  onSceneUpdated?: () => void;
}

// ヘルパー関数：シーン操作ハンドラー
function useSceneHandlers(
  scenarioId: string,
  scenes: Scene[],
  onSceneUpdated?: () => void
) {
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SceneFormData>({
    title: '',
    overview: '',
    order: scenes.length + 1,
  });
  const [newSceneId, setNewSceneId] = useState(() => generateUuid());
  const [deletingSceneId, setDeletingSceneId] = useState<string | null>(null);
  
  const createMutation = useGraphSceneMutation({ sceneId: newSceneId });
  const updateMutation = useGraphSceneMutation({
    sceneId: editingSceneId || '',
  });
  // 削除用のmutationは削除時に動的に作成

  const resetForm = () => {
    setFormData({
      title: '',
      overview: '',
      order: scenes.length + 1,
    });
    setIsAddingScene(false);
    setEditingSceneId(null);
    setNewSceneId(generateUuid());
  };

  const handleStartAdding = () => {
    setNewSceneId(generateUuid());
    setIsAddingScene(true);
    setFormData({
      title: '',
      overview: '',
      order: scenes.length + 1,
    });
  };

  const handleStartEditing = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setFormData({
      title: scene.title,
      overview: scene.overview,
      order: scene.order,
    });
  };

  return {
    isAddingScene,
    editingSceneId,
    formData,
    setFormData,
    createMutation,
    updateMutation,
    resetForm,
    handleStartAdding,
    handleStartEditing,
  };
}

export function SceneManagement({
  scenarioId,
  scenes,
  onSceneUpdated,
}: SceneManagementProps) {
  const {
    isAddingScene,
    editingSceneId,
    formData,
    setFormData,
    createMutation,
    updateMutation,
    resetForm,
    handleStartAdding,
    handleStartEditing,
  } = useSceneHandlers(scenarioId, scenes, onSceneUpdated);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.overview) return;

    try {
      const requestData: GraphSceneRequest = {
        title: formData.title,
        overview: formData.overview,
        scenarioId,
        order: formData.order,
      };

      console.log('Creating scene with ID:', 'Data:', requestData);
      await createMutation.trigger(requestData);
      resetForm();
      onSceneUpdated?.();
    } catch (error) {
      console.error('Failed to create scene:', error);
      alert('シーンの作成に失敗しました。');
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent, scene: Scene) => {
    e.preventDefault();
    if (!formData.title || !formData.overview) return;

    try {
      const requestData: GraphSceneRequest = {
        title: formData.title,
        overview: formData.overview,
        scenarioId: scene.scenarioId,
        order: formData.order,
      };

      await updateMutation.trigger(requestData);
      resetForm();
      onSceneUpdated?.();
    } catch (error) {
      console.error('Failed to update scene:', error);
      alert('シーンの更新に失敗しました。');
    }
  };

  const handleDeleteScene = async (scene: Scene) => {
    console.log('Deleting scene:', scene.id, scene.title);
    
    if (!window.confirm(`シーン「${scene.title}」を削除しますか？この操作は元に戻せません。`)) {
      return;
    }

    try {
      // 直接APIクライアントを使用して削除
      console.log('Scene ID for deletion:', scene.id);
      const { $delete } = apiClient.api['graph-scenes'][':id'];
      
      if (typeof $delete === 'function') {
        const res = await $delete({ param: { id: scene.id } });
        console.log('Delete response:', res.status, res.ok);
        
        if (res.ok) {
          onSceneUpdated?.();
        } else if (res.status === 404) {
          throw new Error('Scene not found');
        } else {
          throw new Error('Failed to delete graph scene');
        }
      } else {
        throw new Error('Delete method not available in API client');
      }
    } catch (error) {
      console.error('Failed to delete scene:', error);
      alert('シーンの削除に失敗しました。');
    }
  };

  const isLoading = createMutation.isMutating || updateMutation.isMutating;

  return (
    <div className="card p-6">
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
            submitButtonText="シーンを保存"
            title="新しいシーンを作成"
          />
        </div>
      )}

      {/* シーン一覧 */}
      {editingSceneId ? (
        <div className="space-y-4">
          {scenes.map((scene) => (
            <div key={scene.id}>
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
                    </h3>
                  </div>
                  <p className="text-stone-600 text-sm">{scene.overview}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <SceneGraphList
          scenes={scenes}
          onEditScene={handleStartEditing}
          onDeleteScene={handleDeleteScene}
          isEditable={true}
        />
      )}

      {scenes.length === 0 && !isAddingScene && (
        <p className="text-stone-500 text-center py-8">
          まだシーンが作成されていません。「新しいシーンを追加」ボタンから作成してください。
        </p>
      )}
    </div>
  );
}
