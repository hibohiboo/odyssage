import { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { useUpdateSessionStatus } from '@odyssage/frontend/entities/session/hooks/useUpdateSessionStatus';
import { useAuth } from '@odyssage/frontend/shared/auth/useAuth';
import { SessionDetailData } from '../api/sessionDetailLoader';

/**
 * セッション編集ページコンポーネント
 * GMがセッションの状態（準備中、進行中、終了）を更新するためのUIを提供
 */
const SessionEditPage = () => {
  // ローダーからのセッション詳細データを取得
  const sessionData = useLoaderData<SessionDetailData | null>();
  const { uid } = useParams<{ uid: string }>();
  const { user } = useAuth();

  // 現在のセッション状態を保持するステート
  const [currentStatus, setCurrentStatus] = useState<
    '準備中' | '進行中' | '終了'
  >(sessionData?.status || '準備中');

  // セッション状態更新用のフックを取得
  const { updateStatus, loading } = useUpdateSessionStatus();

  // セッションデータが変更された場合にステートを更新
  useEffect(() => {
    if (sessionData?.status) {
      setCurrentStatus(sessionData.status);
    }
  }, [sessionData]);

  // ログインユーザーがGMかどうかをチェック
  const isGm = user?.uid === sessionData?.gm_id;

  // セッション状態が変更された時の処理
  const handleStatusChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = event.target.value as '準備中' | '進行中' | '終了';

      if (!uid || !sessionData?.id) {
        console.error('UID or Session ID is missing');
        return;
      }

      try {
        const response = await updateStatus(uid, sessionData.id, newStatus);
        if (response.ok) {
          setCurrentStatus(newStatus);
        }
      } catch (error) {
        console.error('Failed to update session status:', error);
      }
    },
    [uid, sessionData?.id, updateStatus],
  );

  // セッションデータがない場合の表示
  if (!sessionData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
          <p className="text-amber-700">
            セッション情報を読み込めませんでした。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800 mb-4">
          {sessionData.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              セッション情報
            </h2>
            <div className="bg-stone-50 p-4 rounded">
              <p className="mb-2">
                <span className="font-medium text-stone-600">シナリオ: </span>
                <span>{sessionData.scenario_title}</span>
              </p>
              <p className="mb-2">
                <span className="font-medium text-stone-600">作成日: </span>
                <span>
                  {new Date(sessionData.created_at).toLocaleDateString('ja-JP')}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-medium text-stone-600">更新日: </span>
                <span>
                  {new Date(sessionData.updated_at).toLocaleDateString('ja-JP')}
                </span>
              </p>
            </div>
          </div>

          {/* GMの場合のみセッション状態変更UIを表示 */}
          {isGm && (
            <div className="md:col-span-1">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                セッション状態
              </h2>
              <div className="bg-stone-50 p-4 rounded">
                <div className="mb-4">
                  <label
                    htmlFor="sessionStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    現在の状態:
                  </label>
                  <select
                    id="sessionStatus"
                    value={currentStatus}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="準備中">準備中</option>
                    <option value="進行中">進行中</option>
                    <option value="終了">終了</option>
                  </select>
                </div>

                {loading && <p className="text-sm text-amber-600">更新中...</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionEditPage;
