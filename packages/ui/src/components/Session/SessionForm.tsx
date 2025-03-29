import { FormEvent } from 'react';

/**
 * セッション情報入力フォームコンポーネント
 * タイトル入力と送信ボタンを提供
 */
export const SessionForm = ({
  title,
  onTitleChange,
  onSubmit,
  loading,
  success,
  error,
  formError,
  children,
}: {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
  success: boolean;
  error: string;
  formError: string;
  children?: React.ReactNode;
}) => (
  <form onSubmit={onSubmit}>
    {/* シナリオ選択ラベル */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-stone-700 mb-2">
        シナリオを選択
      </label>
      {/* ScenarioSelectorコンポーネントは呼び出し元で配置 */}
      {children}
    </div>

    {/* セッションタイトル */}
    <div className="mb-6">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-stone-700 mb-2"
      >
        セッションタイトル
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="セッションのタイトルを入力"
        className="input w-full"
        required
      />
      <p className="text-xs text-stone-500 mt-1">
        プレイヤーに表示される卓の名前です
      </p>
    </div>

    {/* エラーメッセージ */}
    {(formError || error) && (
      <div className="text-red-600 mb-4">{formError || error}</div>
    )}

    {/* 成功メッセージ */}
    {success && (
      <div className="text-green-600 mb-4">
        セッションが正常に作成されました
      </div>
    )}

    {/* 送信ボタン */}
    <div>
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? '作成中...' : 'セッションを作成'}
      </button>
    </div>
  </form>
);
