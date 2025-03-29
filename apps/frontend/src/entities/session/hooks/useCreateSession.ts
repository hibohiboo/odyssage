// filepath: d:\projects\odyssage\apps\frontend\src\entities\session\hooks\useCreateSession.ts
import { useState } from 'react';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { createSession } from '../api/createSession';

/**
 * セッション作成のためのカスタムフック
 * @returns セッション作成関数と状態
 */
export const useCreateSession = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const uid = useAppSelector(uidSelector);

  /**
   * セッションを作成する関数
   * @param scenarioId シナリオID
   * @param title セッションタイトル
   */
  const createNewSession = async (scenarioId: string, title: string) => {
    if (!uid) {
      setError('ユーザーIDが取得できません');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await createSession(uid, scenarioId, title);
      setSuccess(true);
    } catch (err) {
      console.error('セッション作成エラー:', err);
      setError(
        err instanceof Error ? err.message : 'セッションの作成に失敗しました',
      );
    } finally {
      setLoading(false);
    }
  };

  return { createNewSession, loading, success, error };
};
