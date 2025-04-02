import { FormEventHandler } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { ScenarioData } from '@odyssage/frontend/entities/scenario';
import { useCreateSession } from '@odyssage/frontend/entities/session/hooks/useCreateSession';

/**
 * セッション作成フォームのロジックを管理するカスタムフック
 * @param stockedScenarios ストックされたシナリオの配列
 * @returns フォーム状態と操作メソッド
 */
export const useSessionForm = () => {
  const navigate = useNavigate();
  const { createNewSession, success } = useCreateSession();

  const loaderData = useLoaderData<ScenarioData>();

  /**
   * セッション作成フォームの送信ハンドラ
   * @param e フォームイベント
   */
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const sessionName = form.get('sessionName') as string;
    if (!sessionName) {
      console.error('Invalid form data', { sessionName });
      return;
    }
    try {
      await createNewSession(loaderData.id, sessionName);
      // 成功したらセッション一覧ページに遷移
      if (success) {
        navigate('/gm/sessions');
      }
    } catch (err) {
      console.error('セッション作成エラー:', err);
    }
  };

  return {
    sessionName: loaderData.title,
    handleSubmit,
  };
};
