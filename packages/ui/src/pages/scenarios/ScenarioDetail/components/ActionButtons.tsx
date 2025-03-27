import { Edit, Trash2, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

interface ActionButtonsProps {
  scenarioId: string;
  isStockedByGM: boolean;
  onToggleGMStock?: () => void;
  onDeleteClick?: () => void;
  isLoading?: boolean;
}

export const ActionButtons = ({
  scenarioId,
  isStockedByGM,
  onToggleGMStock,
  onDeleteClick,
  isLoading = false,
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
      {onToggleGMStock && (
        <button
          onClick={onToggleGMStock}
          disabled={isLoading}
          className={`btn w-full py-3 px-4 rounded-md flex items-center justify-center ${
            isStockedByGM
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? (
            <span className="animate-pulse">処理中...</span>
          ) : (
            <>
              {isStockedByGM ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <BookOpen className="h-5 w-5 mr-2" />
              )}
              {isStockedByGM ? 'GM用ストックを解除' : 'GM用ストックに追加'}
            </>
          )}
        </button>
      )}

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
