import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  show: boolean;
  title: string;
  isPublished: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmDialog = ({
  show,
  title,
  isPublished,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-bold">シナリオを削除しますか？</h3>
        </div>

        <p className="text-stone-600 mb-6">
          「{title}」を削除します。この操作は取り消せません。
          {isPublished && (
            <span className="block mt-2 font-medium text-red-600">
              このシナリオは公開中です。削除すると、現在このシナリオを使用しているGMにも影響します。
            </span>
          )}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};
