import { useLoaderData } from 'react-router';

/**
 * セッションの型定義
 */
interface Session {
  id: string;
  name: string;
  gm: string;
  players: number;
  maxPlayers: number;
  status: string;
  createdAt: string;
}

/**
 * セッション一覧ページ
 * セッションデータを表示するシンプルなリスト形式のページを提供する
 */
const SessionListPage = () => {
  // ローダーからのデータを取得
  const sessions = useLoaderData() as Session[];

  return (
    <div className="sessions-list">
      <h1>セッション一覧</h1>

      {sessions.length === 0 ? (
        <p>セッションがありません</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session.id} className="session-item">
              <div className="session-header">
                <h2>{session.name}</h2>
                <span className="session-status">{session.status}</span>
              </div>
              <div className="session-info">
                <p>GM: {session.gm}</p>
                <p>
                  プレイヤー: {session.players}/{session.maxPlayers}
                </p>
                <p>作成日: {new Date(session.createdAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionListPage;
