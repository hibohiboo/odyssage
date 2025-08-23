import { useLoaderData, useNavigate, useParams } from 'react-router';
import { SessionDetailData } from '../../session/api/sessionDetailLoader';

interface SessionDetailPageParams {
  sessionId: string;
}

/**
 * SessionDetailPage - Player文脈でのセッション詳細表示
 * テスト: session-joining.feature対応
 */
export function SessionDetailPage() {
  const params = useParams<SessionDetailPageParams>();
  const sessionData = useLoaderData<SessionDetailData>();
  const navigate = useNavigate();

  // データ取得失敗時の処理
  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          セッションが見つかりません
        </h2>
        <p className="text-gray-600 mb-4">
          指定されたセッションは存在しないか、アクセスできません。
        </p>
        <button
          onClick={() => navigate('/player/sessions')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          セッション一覧に戻る
        </button>
      </div>
    );
  }

  // 参加ボタンクリック処理
  const handleJoinSession = () => {
    // TODO: Phase 2で参加確認ダイアログを実装
    console.log('Join session clicked:', params.sessionId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/player/sessions')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← セッション一覧に戻る
        </button>
        <h1 
          className="text-3xl font-serif font-bold text-amber-800"
          data-testid="session-title"
        >
          {sessionData.title}
        </h1>
      </div>

      {/* セッション基本情報 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">セッション情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">ステータス</p>
            <p className="font-medium">{sessionData.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">シナリオ</p>
            <p className="font-medium">{sessionData.scenarioTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">作成日</p>
            <p className="font-medium">{new Date(sessionData.createdAt).toLocaleDateString('ja-JP')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">最終更新</p>
            <p className="font-medium">{new Date(sessionData.updatedAt).toLocaleDateString('ja-JP')}</p>
          </div>
        </div>
      </div>

      {/* セッション説明（今後のデータ拡張用） */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">セッション説明</h2>
        <div data-testid="session-description">
          <p className="text-gray-700">
            このセッションでは「{sessionData.scenarioTitle}」シナリオをプレイします。
          </p>
          {/* TODO: 将来的にAPIからセッション詳細説明を取得 */}
        </div>
      </div>

      {/* 参加ボタン */}
      <div className="flex justify-center">
        <button
          onClick={handleJoinSession}
          data-testid="join-session-button"
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          このセッションに参加
        </button>
      </div>
    </div>
  );
}