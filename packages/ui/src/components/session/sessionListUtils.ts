import { SessionCardProps } from './SessionCard';

/**
 * セッション検索条件の型定義
 */
export interface SessionFilterCriteria {
  searchText: string;
  activeStatus: string | null;
}

/**
 * 検索テキストにマッチするかチェックする
 * @param session 検索対象のセッション
 * @param searchText 検索テキスト
 * @returns 検索条件にマッチする場合はtrue
 */
export const matchesSearchText = (
  session: SessionCardProps,
  searchText: string,
): boolean => {
  if (!searchText) {
    return true;
  }

  const normalizedSearchText = searchText.toLowerCase();

  // 名前、GM名、説明文でマッチするか確認
  return (
    session.name.toLowerCase().includes(normalizedSearchText) ||
    session.gm.toLowerCase().includes(normalizedSearchText) ||
    (session.description?.toLowerCase().includes(normalizedSearchText) ?? false)
  );
};

/**
 * 指定したステータスにマッチするかチェックする
 * @param session 検索対象のセッション
 * @param activeStatus フィルタリング対象のステータス
 * @returns ステータス条件にマッチする場合はtrue
 */
export const matchesStatus = (
  session: SessionCardProps,
  activeStatus: string | null,
): boolean => {
  if (!activeStatus) {
    return true;
  }

  return session.status.toLowerCase() === activeStatus.toLowerCase();
};

/**
 * セッションリストをフィルタリングする
 * @param sessions セッションのリスト
 * @param criteria フィルタリング条件
 * @returns フィルタリングされたセッションのリスト
 */
export const filterSessions = (
  sessions: SessionCardProps[],
  criteria: SessionFilterCriteria,
): SessionCardProps[] =>
  sessions.filter(
    (session) =>
      matchesSearchText(session, criteria.searchText) &&
      matchesStatus(session, criteria.activeStatus),
  );
