import { PlusCircle } from 'lucide-react';

interface SceneManagementHeaderProps {
  onAddScene: () => void;
  isLoading?: boolean;
}

export const SceneManagementHeader = ({
  onAddScene,
  isLoading = false,
}: SceneManagementHeaderProps) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-serif font-bold text-amber-800">
        シーン管理
      </h2>
      <button
        onClick={onAddScene}
        className="btn btn-primary flex items-center"
        disabled={isLoading}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        新しいシーンを追加
      </button>
    </div>
  );