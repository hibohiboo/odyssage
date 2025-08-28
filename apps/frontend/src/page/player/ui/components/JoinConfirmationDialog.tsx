import { useEffect } from 'react';

interface JoinConfirmationDialogProps {
  isOpen: boolean;
  sessionTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 参加確認ダイアログコンポーネント
 * BDDテスト session-joining.feature 対応
 * セレクタ要件: [role="dialog"], [data-testid="confirmation-dialog"]
 */
export function JoinConfirmationDialog({
  isOpen,
  sessionTitle,
  onConfirm,
  onCancel,
}: JoinConfirmationDialogProps) {
  // ESCキーでダイアログを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // スクロールを無効化
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // スクロールを復元
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ背景 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* ダイアログ本体 */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-dialog-title"
        data-testid="confirmation-dialog"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2
              id="join-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              セッション参加確認
            </h2>
          </div>

          {/* コンテンツ */}
          <div className="px-6 py-4">
            <p className="text-gray-700 mb-4">
              以下のセッションに参加しますか？
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">セッション名</h3>
              <p className="text-gray-700">{sessionTitle}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              参加を確定すると、プレイ画面に遷移します。
            </p>
          </div>

          {/* アクションボタン */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              data-testid="cancel-join-button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onConfirm}
              data-testid="confirm-join-button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              参加する
            </button>
          </div>
        </div>
      </div>
    </>
  );
}