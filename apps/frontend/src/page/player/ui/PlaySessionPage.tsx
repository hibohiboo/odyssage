import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PlaySessionContainer } from '../containers/PlaySessionContainer';

interface PlaySessionPageParams extends Record<string, string | undefined> {
  sessionId: string;
  sceneId?: string;
}

/**
 * PlaySessionPage - ルーティング統合・パラメータ処理
 * 設計: docs/02-architecture/player-context/screens/play-session.md L328-403
 */
export function PlaySessionPage() {
  const params = useParams<PlaySessionPageParams>();
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);

  // パラメータバリデーション
  useEffect(() => {
    if (!params.sessionId) {
      setValidationError('セッションIDが指定されていません');
      return;
    }

    // sessionIdの基本的な形式チェック
    if (typeof params.sessionId !== 'string' || params.sessionId.trim() === '') {
      setValidationError('無効なセッションIDです');
      return;
    }

    // sceneIdが指定されている場合の基本的な形式チェック
    if (params.sceneId && (typeof params.sceneId !== 'string' || params.sceneId.trim() === '')) {
      setValidationError('無効なシーンIDです');
      return;
    }

    setValidationError(null);
  }, [params.sessionId, params.sceneId]);

  // バリデーションエラー時の表示
  if (validationError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          ルーティングエラー
        </h2>
        <p className="text-gray-600 mb-4">{validationError}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/player/sessions')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            セッション一覧に戻る
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  // パラメータ正常時 - PlaySessionContainerに委譲
  return (
    <PlaySessionContainer
      sessionId={params.sessionId!}
      startingSceneId={params.sceneId || 'forest_entrance'} // sampleScenesのデフォルトシーンID
    />
  );
}