import React from 'react';

/**
 * セッションの型定義
 */
export interface SessionCardProps {
  id: string;
  name: string;
  description?: string;
  gm: string;
  players: number;
  maxPlayers: number;
  status: string;
  progress?: number;
  createdAt: string;
  currentScene?: string;
  unreadMessages?: number;
  onViewDetails?: (id: string) => void;
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
  // ステータスに基づいて表示スタイルを変更
  const getStatusClassName = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case '進行中':
        return 'bg-green-100 text-green-800';
      case 'waiting':
      case '待機中':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
      case '完了':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  // ステータスの表示名を変換
  const getStatusDisplayName = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return '進行中';
      case 'waiting':
        return '待機中';
      case 'completed':
        return '完了';
      default:
        return status;
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(id);
    }
  };

  const handleViewMessages = () => {
    if (onViewMessages) {
      onViewMessages(id);
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(id);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-serif font-bold text-amber-800">
            {name}
          </h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClassName()}`}
          >
            {getStatusDisplayName()}
          </div>
        </div>

        <p className="text-sm text-stone-500 mb-2">
          GM: {gm} • 参加プレイヤー: {players}/{maxPlayers}人
        </p>

        {description && (
          <p className="text-stone-600 text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>進行状況</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-amber-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {currentScene && (
          <div className="p-3 bg-stone-50 rounded-md mb-3">
            <h4 className="text-sm font-medium mb-1">現在の状況:</h4>
            <p className="text-sm text-stone-600">{currentScene}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center">
            <span>作成日: {formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="bg-stone-50 p-3 flex justify-between">
        <button
          onClick={handleViewDetails}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          詳細を見る
        </button>
        <div className="flex gap-4">
          {onViewMessages && (
            <button
              onClick={handleViewMessages}
              className="text-sm text-stone-600 hover:text-stone-800 flex items-center"
            >
              メッセージ
              {unreadMessages > 0 && (
                <span className="ml-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {unreadMessages}
                </span>
              )}
            </button>
          )}
          {(status.toLowerCase() === 'active' ||
            status.toLowerCase() === '進行中') &&
            onPlay && (
              <button
                onClick={handlePlay}
                className="text-sm text-green-600 hover:text-green-800 flex items-center"
              >
                プレイする
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
