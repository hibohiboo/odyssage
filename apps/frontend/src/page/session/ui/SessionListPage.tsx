import { SessionList, SessionCardProps } from '@odyssage/ui/index';
import { useLoaderData, useNavigate } from 'react-router';
import { SessionListData } from '../api/sessionListLoader';

/**
 * セッション一覧ページ
 * セッションデータを表示するリスト形式のページを提供する
 */
const SessionListPage = () => {
  // ローダーからのデータを取得
  const sessions = useLoaderData<SessionListData>();
  const navigate = useNavigate();

  // セッションの詳細ページへ移動
  const handleViewDetails = (id: string, gmId: string) => {
    navigate(`/gm/${gmId}/session/${id}`);
  };

  // セッションのメッセージページへ移動
  const handleViewMessages = (id: string) => {
    navigate(`/session/${id}/messages`);
  };

  // セッションをプレイする
  const handlePlay = (id: string) => {
    navigate(`/session/${id}/play`);
  };

  // APIから取得したセッションデータをSessionCardPropsの形式に変換
  const sessionItems: SessionCardProps[] = Array.isArray(sessions)
    ? sessions.map((session) => ({
        id: session.id,
        name: session.name,
        gm: session.gm,
        gmId: session.gmId,
        players: session.players,
        maxPlayers: session.maxPlayers,
        status: session.status,
        createdAt: session.createdAt,
        description: '',
        progress: 0,
        currentScene: '',
      }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
            セッション一覧
          </h1>
          <p className="text-stone-600">参加可能なセッションの一覧</p>
        </div>
      </div>

      <SessionList
        sessions={sessionItems}
        onViewDetails={handleViewDetails}
        onViewMessages={handleViewMessages}
        onPlay={handlePlay}
      />
    </div>
  );
};

export default SessionListPage;
