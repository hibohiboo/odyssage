import { Edit, Trash2, BookOpen, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router';

interface ActionButtonsProps {
  scenarioId: string;
  isStockedByGM: boolean;
  onToggleGMStock?: () => void;
  onDeleteClick?: () => void;
  isLoading?: boolean;
}

/**
 * 共通のボタンスタイル定義
 */
const BUTTON_BASE_STYLE =
  'btn w-full py-3 px-4 rounded-md flex items-center justify-center';
const ICON_STYLE = 'h-5 w-5 mr-2';

/**
 * シナリオ編集ボタンコンポーネント
 */
const EditButton = ({ scenarioId }: { scenarioId: string }) => (
  <Link
    to={`/creator/scenario/${scenarioId}/edit`}
    className={`${BUTTON_BASE_STYLE} bg-amber-500 hover:bg-amber-600 text-white`}
  >
    <Edit className={ICON_STYLE} />
    シナリオを編集
  </Link>
);

/**
 * セッション作成ボタンコンポーネント
 */
const CreateSessionButton = ({
  id,
  isStockedByGM,
}: {
  id: string;
  isStockedByGM: boolean;
}) => (
  <Link
    to={isStockedByGM ? `/gm/scenario/${id}/session/create` : '#'}
    className={`${BUTTON_BASE_STYLE} ${isStockedByGM ? 'hover:bg-green-600' : 'opacity-50 cursor-not-allowed'} bg-green-500 text-white`}
  >
    <Users className={ICON_STYLE} />
    このシナリオでセッションを作成
  </Link>
);

/**
 * ストックボタン用のスタイルを取得する
 */
const getStockButtonStyle = (isStocked: boolean): string =>
  isStocked
    ? `${BUTTON_BASE_STYLE} bg-blue-100 text-blue-800 hover:bg-blue-200`
    : `${BUTTON_BASE_STYLE} bg-blue-500 hover:bg-blue-600 text-white`;

/**
 * ストックボタン内部のコンテンツコンポーネント
 */
const StockButtonContent = ({ isStocked }: { isStocked: boolean }) => (
  <>
    {isStocked ? (
      <CheckCircle className={ICON_STYLE} />
    ) : (
      <BookOpen className={ICON_STYLE} />
    )}
    {isStocked ? 'GM用ストックを解除' : 'GM用ストックに追加'}
  </>
);
/**
 * シナリオのストックトグルボタンコンポーネント
 */
const StockToggleButton = ({
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
      <StockButtonContent isStocked={isStocked} />
    )}
  </button>
);

/**
 * シナリオ削除ボタンコンポーネント
 */
const DeleteButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`${BUTTON_BASE_STYLE} border border-red-300 text-red-600 hover:bg-red-50`}
  >
    <Trash2 className={ICON_STYLE} />
    シナリオを削除
  </button>
);

/**
 * シナリオの操作ボタンをまとめたコンポーネント
 */
export const ActionButtons = ({
  scenarioId,
  isStockedByGM,
  onToggleGMStock,
  onDeleteClick,
  isLoading = false,
}: ActionButtonsProps) => (
  <div className="card p-6 mb-6">
    <div className="space-y-3">
      <EditButton scenarioId={scenarioId} />

      {onToggleGMStock && (
        <StockToggleButton
          isStocked={isStockedByGM}
          onToggle={onToggleGMStock}
          isLoading={isLoading}
        />
      )}

      {/* ストックされている場合にのみセッション作成ボタンを有効化 */}
      <CreateSessionButton id={scenarioId} isStockedByGM={isStockedByGM} />

      {onDeleteClick && <DeleteButton onClick={onDeleteClick} />}
    </div>
  </div>
);
