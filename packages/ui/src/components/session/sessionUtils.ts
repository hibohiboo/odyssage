/**
 * セッションのステータスタイプ
 */
export type SessionStatus = 'active' | 'waiting' | 'completed';

/**
 * ステータスに基づいてクラス名を取得する
 * @param status セッションのステータス
 * @returns 対応するCSSクラス名
 */
export const getStatusClassName = (status: SessionStatus): string => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'active' || normalizedStatus === '進行中') {
    return 'bg-green-100 text-green-800';
  }

  if (normalizedStatus === 'waiting' || normalizedStatus === '待機中') {
    return 'bg-amber-100 text-amber-800';
  }

  if (normalizedStatus === 'completed' || normalizedStatus === '完了') {
    return 'bg-blue-100 text-blue-800';
  }

  return 'bg-stone-100 text-stone-800';
};

/**
 * ステータスの表示名を取得する
 * @param status セッションのステータス
 * @returns 日本語の表示名
 */
export const getStatusDisplayName = (status: SessionStatus): string => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'active') {
    return '進行中';
  }

  if (normalizedStatus === 'waiting') {
    return '待機中';
  }

  if (normalizedStatus === 'completed') {
    return '完了';
  }

  return status;
};

/**
 * セッションが進行中かどうかを判定する
 * @param status セッションのステータス
 * @returns 進行中の場合はtrue
 */
export const isActiveSession = (status: SessionStatus): boolean => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === 'active' || normalizedStatus === '進行中';
};

/**
 * 日付文字列をフォーマットする
 * @param dateString 日付を表す文字列
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
