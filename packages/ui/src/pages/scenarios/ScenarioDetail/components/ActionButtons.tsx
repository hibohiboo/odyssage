import { Edit, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router';

interface ActionButtonsProps {
  scenarioId: string;
  isStockedByGM: boolean;
  onToggleGMStock: () => void;
  onDeleteClick?: () => void;
}

export const ActionButtons = ({
  scenarioId,
  isStockedByGM,
  onToggleGMStock,
  onDeleteClick,
}: ActionButtonsProps) => (
  <div className="card p-6 mb-6">
    <div className="space-y-3">
      <Link
        to={`/creator/scenario/${scenarioId}/edit`}
        className="btn w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-md flex items-center justify-center"
      >
        <Edit className="h-5 w-5 mr-2" />
        シナリオを編集
      </Link>

      <button
        onClick={onToggleGMStock}
        className={`btn w-full py-3 px-4 rounded-md flex items-center justify-center ${
          isStockedByGM
            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        <BookOpen className="h-5 w-5 mr-2" />
        {isStockedByGM ? 'GM用ストック済み' : 'GM用ストックに追加'}
      </button>
      {onDeleteClick && (
        <button
          onClick={onDeleteClick}
          className="btn w-full border border-red-300 text-red-600 hover:bg-red-50 py-3 px-4 rounded-md flex items-center justify-center"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          シナリオを削除
        </button>
      )}
    </div>
  </div>
);
