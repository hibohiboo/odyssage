import React from 'react';
import {
  StatusBadge,
  ProgressBar,
  CurrentScene,
  UnreadBadge,
  ActionButton,
} from './SessionCardParts';
import {
  getStatusClassName,
  getStatusDisplayName,
  isActiveSession,
  formatDate,
  SessionStatus,
} from './sessionUtils';

/**
 * セッションの型定義
 */
export interface SessionCardProps {
  id: string;
  name: string;
  description?: string;
  gm: string;
  gmId: string;
  players: number;
  maxPlayers: number;
  status: SessionStatus;
  progress?: number;
  createdAt: string;
  currentScene?: string;
  unreadMessages?: number;
  onViewDetails?: (id: string, gmId: string) => void;
  onViewMessages?: (id: string) => void;
  onPlay?: (id: string) => void;
}

/**
 * セッションカードコンポーネント
 * 個々のセッション情報を表示するカードUIコンポーネント
 */
export const SessionCard: React.FC<SessionCardProps> = ({
  id,
  name,
  description,
  gm,
  gmId,
  players,
  maxPlayers,
  status,
  progress = 0,
  createdAt,
  currentScene,
  unreadMessages = 0,
  onViewDetails,
  onViewMessages,
  onPlay,
}) => {
  // イベントハンドラー
  const handleViewDetails = () => onViewDetails?.(id, gmId);
  const handleViewMessages = () => onViewMessages?.(id);
  const handlePlay = () => onPlay?.(id);

  // 日付のフォーマット
  const formattedDate = formatDate(createdAt);

  // ステータス関連の情報を取得
  const statusClassName = getStatusClassName(status);
  const statusDisplayName = getStatusDisplayName(status);
  const isActive = isActiveSession(status);

  // カードのヘッダー部分をレンダリング
  const renderHeader = () => (
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-lg font-serif font-bold text-amber-800">{name}</h3>
      <StatusBadge
        statusClassName={statusClassName}
        displayName={statusDisplayName}
      />
    </div>
  );

  // メッセージボタンを条件付きでレンダリング
  const renderMessagesButton = () => {
    if (!onViewMessages) {
      return null;
    }

    return (
      <ActionButton
        onClick={handleViewMessages}
        className="text-sm text-stone-600 hover:text-stone-800 flex items-center"
      >
        メッセージ
        <UnreadBadge count={unreadMessages} />
      </ActionButton>
    );
  };

  // プレイボタンを条件付きでレンダリング
  const renderPlayButton = () => {
    if (!isActive || !onPlay) {
      return null;
    }

    return (
      <ActionButton
        onClick={handlePlay}
        className="text-sm text-green-600 hover:text-green-800 flex items-center"
      >
        プレイする
      </ActionButton>
    );
  };

  // カードのアクション部分をレンダリング
  const renderActions = () => (
    <div className="bg-stone-50 p-3 flex justify-between">
      <ActionButton
        onClick={handleViewDetails}
        className="text-sm text-amber-700 hover:text-amber-800 font-medium"
      >
        詳細を見る
      </ActionButton>

      <div className="flex gap-4">
        {renderMessagesButton()}
        {renderPlayButton()}
      </div>
    </div>
  );

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {renderHeader()}

        <p className="text-sm text-stone-500 mb-2">
          GM: {gm} • 参加プレイヤー: {players}/{maxPlayers}人
        </p>

        {description && (
          <p className="text-stone-600 text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <ProgressBar progress={progress} />

        {currentScene && <CurrentScene scene={currentScene} />}

        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center">
            <span>作成日: {formattedDate}</span>
          </div>
        </div>
      </div>

      {renderActions()}
    </div>
  );
};
