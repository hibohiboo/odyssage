import { FC } from 'react';

/**
 * ローディング状態を表示するスピナーコンポーネント
 * データ読み込み中やAPIコール中などの待機状態を視覚的に表現する
 */
interface LoadingSpinnerProps {
  /**
   * スピナーの下に表示するメッセージ
   * @default '読み込み中...'
   */
  message?: string;
}

/**
 * ローディングスピナーコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 * @returns ローディングスピナーを表示するReactコンポーネント
 *
 * @example
 * ```tsx
 * <LoadingSpinner message="データを読み込んでいます..." />
 * ```
 */
export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  message = '読み込み中...',
}) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    <p className="mt-4 text-lg text-gray-700">{message}</p>
  </div>
);
