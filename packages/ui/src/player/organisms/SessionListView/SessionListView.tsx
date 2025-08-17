import { SessionCard } from '../../atoms/SessionCard';

export interface SessionData {
  sessionId: string;
  title: string;
  scenarioSummary: string;
  status: 'available' | 'ongoing' | 'completed';
  thumbnailUrl?: string;
  tags?: string[];
}

export interface SessionListViewProps {
  /** セッション一覧データ */
  sessions: SessionData[];
  /** セッション詳細表示時のハンドラー */
  onSessionDetail: (sessionId: string) => void;
  /** セッション参加時のハンドラー */
  onSessionJoin: (sessionId: string) => void;
  /** 読み込み中状態 */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 追加のCSSクラス */
  className?: string;
}

const LoadingView = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">セッションを読み込み中...</span>
  </div>
);

const ErrorView = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <div className="text-red-600 font-medium mb-2">エラーが発生しました</div>
    <div className="text-gray-600 text-sm">{error}</div>
  </div>
);

const EmptyView = () => (
  <div className="text-center py-12">
    <div className="text-gray-500 font-medium mb-2">参加可能なセッションがありません</div>
    <div className="text-gray-400 text-sm">新しいセッションが開始されるまでお待ちください</div>
  </div>
);

export function SessionListView({
  sessions,
  onSessionDetail,
  onSessionJoin,
  loading = false,
  error,
  className = '',
}: SessionListViewProps) {
  // ローディング状態
  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <LoadingView />
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <ErrorView error={error} />
      </div>
    );
  }

  // 空状態
  if (sessions.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <EmptyView />
      </div>
    );
  }

  // セッション一覧表示
  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard
            key={session.sessionId}
            sessionId={session.sessionId}
            title={session.title}
            scenarioSummary={session.scenarioSummary}
            status={session.status}
            thumbnailUrl={session.thumbnailUrl}
            tags={session.tags}
            onDetailClick={onSessionDetail}
            onJoinClick={onSessionJoin}
          />
        ))}
      </div>
    </div>
  );
}