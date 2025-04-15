import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateSessionStatus } from '@odyssage/frontend/entities/session/hooks/useUpdateSessionStatus';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { SessionDetailData } from '../api/sessionDetailLoader';

/**
 * セッション編集機能を提供するカスタムフック
 *
 * GMがセッション状態を管理・更新するためのロジックをカプセル化する
 *
 * @param sessionData - セッションの詳細データ
 * @returns セッション編集に関する状態と操作関数
 */
export const useSessionEdit = (sessionData: SessionDetailData | null) => {
  // Reduxからログインユーザーのuidを取得
  const currentUserId = useSelector(uidSelector);

  // 現在のセッション状態を保持するステート
  const [currentStatus, setCurrentStatus] = useState<
    '準備中' | '進行中' | '終了'
  >(sessionData?.status || '準備中');

  // セッション状態更新用のカスタムフックを取得
  const { updateStatus, loading } = useUpdateSessionStatus();

  // セッションデータが変更された場合にステートを更新
  useEffect(() => {
    if (sessionData?.status) {
      setCurrentStatus(sessionData.status);
    }
  }, [sessionData]);

  // ログインユーザーがGMかどうかを判定
  const isGm = currentUserId === sessionData?.gm_id;

  /**
   * セッション状態変更時の処理
   *
   * @param event - HTMLSelectElementのイベント
   * @param sessionUid - セッションUID
   */
  const handleStatusChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>, sessionUid: string) => {
      const newStatus = event.target.value as '準備中' | '進行中' | '終了';

      if (!sessionUid || !sessionData?.id) {
        console.error('Session UID or ID is missing');
        return;
      }

      try {
        const response = await updateStatus(
          sessionUid,
          sessionData.id,
          newStatus,
        );
        if (response.ok) {
          setCurrentStatus(newStatus);
        }
      } catch (error) {
        console.error('Failed to update session status:', error);
      }
    },
    [sessionData?.id, updateStatus],
  );

  return {
    currentStatus,
    isGm,
    loading,
    handleStatusChange,
  };
};
