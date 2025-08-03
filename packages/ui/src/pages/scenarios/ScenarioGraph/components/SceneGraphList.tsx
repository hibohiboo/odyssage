// GraphDBシーン一覧表示コンポーネント
export type Scene = {
  id: string;
  title: string;
  overview: string;
  scenarioId: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

interface SceneGraphListProps {
  scenes: Scene[];
  onEditScene?: (scene: Scene) => void;
  onDeleteScene?: (scene: Scene) => void;
  isEditable?: boolean;
}

export const SceneGraphList = ({ scenes, onEditScene, onDeleteScene, isEditable = false }: SceneGraphListProps) => {
  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order);

  if (sortedScenes.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-stone-500 text-center py-8">
          まだシーンが作成されていません。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedScenes.map((scene) => (
        <div
          key={scene.id}
          className="border border-stone-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-lg text-amber-800">
              {scene.order}. {scene.title}
            </h3>
            {isEditable && (
              <div className="flex gap-2">
                {onEditScene && (
                  <button
                    onClick={() => onEditScene(scene)}
                    className="text-stone-600 hover:text-stone-800 text-sm"
                  >
                    編集
                  </button>
                )}
                {onDeleteScene && (
                  <button
                    onClick={() => onDeleteScene(scene)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-stone-600 text-sm">{scene.overview}</p>
        </div>
      ))}
    </div>
  );
};