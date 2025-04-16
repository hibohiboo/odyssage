import React, { useState } from 'react';
import { SessionCardProps } from './SessionCard';
import {
  SearchInput,
  StatusTabs,
  SessionCards,
  EmptySessions,
} from './SessionListParts';
import { filterSessions, SessionFilterCriteria } from './sessionListUtils';

/**
 * セッションリストの型定義
 */
export interface SessionListProps {
  sessions: SessionCardProps[];
  onViewDetails?: (id: string, gmId: string) => void;
  onViewMessages?: (id: string) => void;
  onPlay?: (id: string) => void;
  showSearch?: boolean;
  showStatusTabs?: boolean;
}

/**
 * セッションリストコンポーネント
 * 複数のセッションカードをリスト形式で表示し、検索や状態によるフィルタリング機能を提供する
 */
export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onViewDetails,
  onViewMessages,
  onPlay,
  showSearch = true,
  showStatusTabs = true,
}) => {
  // 検索とフィルタリングのステート管理
  const [searchText, setSearchText] = useState('');
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  /**
   * 検索入力フォームを表示する
   */
  const renderSearchInput = () => {
    if (!showSearch) {
      return null;
    }

    return <SearchInput value={searchText} onChange={setSearchText} />;
  };

  /**
   * ステータスタブを表示する
   */
  const renderStatusTabs = () => {
    if (!showStatusTabs) {
      return null;
    }

    return (
      <StatusTabs
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />
    );
  };

  // フィルター条件を作成
  const filterCriteria: SessionFilterCriteria = {
    searchText,
    activeStatus,
  };

  // フィルタリングされたセッションリスト
  const filteredSessions = filterSessions(sessions, filterCriteria);

  // セッションリストが空の場合の表示
  if (sessions.length === 0) {
    return <EmptySessions />;
  }

  return (
    <div className="space-y-6">
      {/* 検索エリア */}
      {renderSearchInput()}

      {/* ステータスタブ */}
      {renderStatusTabs()}

      {/* セッションリスト */}
      <SessionCards
        sessions={filteredSessions}
        onViewDetails={onViewDetails}
        onViewMessages={onViewMessages}
        onPlay={onPlay}
      />
    </div>
  );
};
