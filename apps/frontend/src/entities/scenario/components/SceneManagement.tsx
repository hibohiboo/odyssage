import type { GraphSceneRequest } from '@odyssage/schema';
import { SceneForm, SceneManagementHeader, SceneGraphList } from '@odyssage/ui/page-ui';
import { useState } from 'react';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
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

export function SceneManagement({
  scenarioId,
  scenes,
  onSceneUpdated,
}: SceneManagementProps) {
  const [isAddingScene, setIsAddingScene] = useState(false);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SceneFormData>({
    title: '',
    overview: '',
    order: scenes.length + 1,
  });

  const [newSceneId, setNewSceneId] = useState(() => generateUuid());
  const createMutation = useGraphSceneMutation({ sceneId: newSceneId });
  const updateMutation = useGraphSceneMutation({ 
    sceneId: editingSceneId || '' 
  });

  const resetForm = () => {
    setFormData({
      title: '',
      overview: '',
      order: scenes.length + 1,
    });
    setIsAddingScene(false);
    setEditingSceneId(null);
    // 新しいシーン作成のために新しいUUIDを生成
    setNewSceneId(generateUuid());
  };

  const handleStartAdding = () => {
    // 新しいシーン作成のために新しいUUIDを生成
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

      console.log('Creating scene with ID:', newSceneId, 'Data:', requestData);
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