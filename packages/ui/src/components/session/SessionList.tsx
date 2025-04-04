import React, { useState } from 'react';
import { SessionCard, SessionCardProps } from './SessionCard';

/**
 * セッションリストの型定義
 */
export interface SessionListProps {
  sessions: SessionCardProps[];
  onViewDetails?: (id: string) => void;
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
  const [searchText, setSearchText] = useState('');
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  // セッション検索とフィルタリングのロジック
  const filteredSessions = sessions.filter((session) => {
    // 検索テキストによるフィルタリング
    const matchesSearch =
      searchText === '' ||
      session.name.toLowerCase().includes(searchText.toLowerCase()) ||
      session.gm.toLowerCase().includes(searchText.toLowerCase()) ||
      (session.description &&
        session.description.toLowerCase().includes(searchText.toLowerCase()));

    // ステータスによるフィルタリング
    const matchesStatus =
      !activeStatus ||
      session.status.toLowerCase() === activeStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // セッションリストが空の場合の表示
  if (sessions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <h3 className="text-lg font-medium text-stone-700 mb-2">
          セッションがありません
        </h3>
        <p className="text-stone-500">
          新しいセッションを作成するか、公開中のセッションに参加してください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 検索エリア */}
      {showSearch && (
        <div className="card p-4 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="セッションを検索..."
              className="input pl-10 w-full"
            />
          </div>
        </div>
      )}

      {/* ステータスタブ */}
      {showStatusTabs && (
        <div className="flex border-b border-stone-200 mb-6">
          <button
            onClick={() => setActiveStatus(null)}
            className={`px-4 py-2 border-b-2 ${!activeStatus ? 'border-amber-700 text-amber-800 font-medium' : 'border-transparent text-stone-600 hover:text-amber-700'}`}
          >
            すべて
          </button>
          <button
            onClick={() => setActiveStatus('active')}
            className={`px-4 py-2 border-b-2 ${activeStatus === 'active' ? 'border-amber-700 text-amber-800 font-medium' : 'border-transparent text-stone-600 hover:text-amber-700'}`}
          >
            進行中
          </button>
          <button
            onClick={() => setActiveStatus('waiting')}
            className={`px-4 py-2 border-b-2 ${activeStatus === 'waiting' ? 'border-amber-700 text-amber-800 font-medium' : 'border-transparent text-stone-600 hover:text-amber-700'}`}
          >
            待機中
          </button>
          <button
            onClick={() => setActiveStatus('completed')}
            className={`px-4 py-2 border-b-2 ${activeStatus === 'completed' ? 'border-amber-700 text-amber-800 font-medium' : 'border-transparent text-stone-600 hover:text-amber-700'}`}
          >
            完了
          </button>
        </div>
      )}

      {/* セッションリスト */}
      <div className="space-y-6">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              {...session}
              onViewDetails={onViewDetails}
              onViewMessages={onViewMessages}
              onPlay={onPlay}
            />
          ))
        ) : (
          <div className="card p-8 text-center">
            <h3 className="text-lg font-medium text-stone-700 mb-2">
              検索条件に一致するセッションがありません
            </h3>
            <p className="text-stone-500">検索条件を変更してください</p>
          </div>
        )}
      </div>
    </div>
  );
};
