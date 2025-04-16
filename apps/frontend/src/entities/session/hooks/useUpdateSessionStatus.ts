import { useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';

/**
 * セッションの状態を更新するためのカスタムフック
 * GMがセッションの状態（準備中、進行中、終了）を更新する機能を提供
 */
export const useUpdateSessionStatus = () => {
  const [loading, setLoading] = useState(false);

  /**
   * セッションの状態を更新する関数
   * @param uid GMのユーザーID
   * @param sessionId セッションID
   * @param status 更新後の状態（'準備中'|'進行中'|'終了'）
   * @returns 更新レスポンス
   */
  const updateStatus = async (
    uid: string,
    sessionId: string,
    status: '準備中' | '進行中' | '終了',
  ) => {
    setLoading(true);
    try {
      const response = await apiClient.api.gm[':uid'].sessions[':id'].$patch({
        param: { uid, id: sessionId },
        json: { status },
      });

      return response;
    } catch (error) {
      console.error('セッションステータス更新エラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};
