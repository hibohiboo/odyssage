import React from 'react';
import { SessionCard, SessionCardProps } from './SessionCard';

/**
 * 検索入力フォームのプロパティ
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * セッション検索用の入力フォーム
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
}) => (
  <div className="card p-4 mb-8">
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="セッションを検索..."
        className="input pl-10 w-full"
      />
    </div>
  </div>
);

/**
 * ステータスタブのプロパティ
 */
interface StatusTabsProps {
  activeStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

/**
 * ステータスによるフィルタリングタブ
 */
export const StatusTabs: React.FC<StatusTabsProps> = ({
  activeStatus,
  onStatusChange,
}) => (
  <div className="flex border-b border-stone-200 mb-6">
    <StatusTabButton
      isActive={!activeStatus}
      onClick={() => onStatusChange(null)}
      label="すべて"
    />
    <StatusTabButton
      isActive={activeStatus === 'active'}
      onClick={() => onStatusChange('active')}
      label="進行中"
    />
    <StatusTabButton
      isActive={activeStatus === 'waiting'}
      onClick={() => onStatusChange('waiting')}
      label="待機中"
    />
    <StatusTabButton
      isActive={activeStatus === 'completed'}
      onClick={() => onStatusChange('completed')}
      label="完了"
    />
  </div>
);

/**
 * ステータスタブボタンのプロパティ
 */
interface StatusTabButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

/**
 * ステータスタブの個別ボタン
 */
const StatusTabButton: React.FC<StatusTabButtonProps> = ({
  isActive,
  onClick,
  label,
}) => {
  const activeClass = isActive
    ? 'border-amber-700 text-amber-800 font-medium'
    : 'border-transparent text-stone-600 hover:text-amber-700';

  return (
    <button onClick={onClick} className={`px-4 py-2 border-b-2 ${activeClass}`}>
      {label}
    </button>
  );
};

/**
 * セッションカードリストのプロパティ
 */
interface SessionCardsProps {
  sessions: SessionCardProps[];
  onViewDetails?: (id: string) => void;
  onViewMessages?: (id: string) => void;
  onPlay?: (id: string) => void;
}

/**
 * セッションカードのリスト表示
 */
export const SessionCards: React.FC<SessionCardsProps> = ({
  sessions,
  onViewDetails,
  onViewMessages,
  onPlay,
}) => {
  if (sessions.length === 0) {
    return <EmptySearchResult />;
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          {...session}
          onViewDetails={onViewDetails}
          onViewMessages={onViewMessages}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
};

/**
 * 空のセッションリスト表示
 */
export const EmptySessions: React.FC = () => (
  <div className="card p-8 text-center">
    <h3 className="text-lg font-medium text-stone-700 mb-2">
      セッションがありません
    </h3>
    <p className="text-stone-500">
      新しいセッションを作成するか、公開中のセッションに参加してください
    </p>
  </div>
);

/**
 * 検索結果が空の場合の表示
 */
export const EmptySearchResult: React.FC = () => (
  <div className="card p-8 text-center">
    <h3 className="text-lg font-medium text-stone-700 mb-2">
      検索条件に一致するセッションがありません
    </h3>
    <p className="text-stone-500">検索条件を変更してください</p>
  </div>
);
