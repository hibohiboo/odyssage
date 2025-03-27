import { Trash2, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router';

/**
 * ストックボタン用のスタイルを取得する
 */
const getStockButtonStyle = (isStocked: boolean): string =>
  isStocked
    ? `text-sm text-blue-800 hover:text-blue-700 flex items-center`
    : `text-sm text-blue-600 hover:text-blue-800 flex items-center`;

/**
 * ストックボタンコンポーネント
 */
const StockButton = ({
  isStocked,
  onToggle,
  isLoading,
}: {
  isStocked: boolean;
  onToggle: () => void;
  isLoading: boolean;
}) => (
  <button
    onClick={onToggle}
    disabled={isLoading}
    className={getStockButtonStyle(isStocked)}
  >
    {isLoading ? (
      <span className="animate-pulse">処理中...</span>
    ) : (
      <span className="flex items-center cursor-pointer">
        {isStocked ? 'ストック済み' : ''}
        {isStocked ? (
          <CheckCircle className="h-4 w-4 mr-1" />
        ) : (
          <BookOpen className="h-4 w-4 mr-1" />
        )}
        {isStocked ? 'ストック解除' : 'ストックする'}
      </span>
    )}
  </button>
);

// シナリオアクションコンポーネント
export function ScenarioActions({
  linkPrefix,
  scenario,
  editable,
  onDelete,
  isStocked,
  onToggleStock,
  isStockLoading,
}: {
  readonly scenario: { readonly id: string; readonly status: string };
  readonly linkPrefix: string;
  readonly onDelete?: () => void;
  readonly editable?: boolean;
  readonly isStocked?: boolean;
  readonly onToggleStock?: () => void;
  readonly isStockLoading?: boolean;
}) {
  return (
    <div className="bg-stone-50 p-3 flex justify-between">
      <div className="flex gap-2">
        <Link
          to={`${linkPrefix}/${scenario.id}`}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          詳細を見る
        </Link>
        {editable && (
          <Link
            to={`${linkPrefix}/${scenario.id}/edit`}
            className="text-sm text-stone-600 hover:text-stone-800"
          >
            編集する
          </Link>
        )}
      </div>
      <div className="flex gap-3">
        {onToggleStock && !editable && (
          <StockButton
            isStocked={isStocked || false}
            onToggle={onToggleStock}
            isLoading={isStockLoading || false}
          />
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </button>
        )}
      </div>
    </div>
  );
}
