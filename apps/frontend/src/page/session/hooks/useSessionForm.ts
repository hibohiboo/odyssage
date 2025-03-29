import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateSession } from '@odyssage/frontend/entities/session/hooks/useCreateSession';
import { StockedScenario } from '../api/stockedScenariosLoader';

/**
 * セッション作成フォームのロジックを管理するカスタムフック
 * @param stockedScenarios ストックされたシナリオの配列
 * @returns フォーム状態と操作メソッド
 */
export const useSessionForm = (stockedScenarios: StockedScenario[]) => {
  const navigate = useNavigate();
  const { createNewSession, loading, success, error } = useCreateSession();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // 選択したシナリオの情報を取得
  const selectedScenario = stockedScenarios.find(
    (scenario) => scenario.id === selectedScenarioId,
  );

  /**
   * セッション作成フォームの送信ハンドラ
   * @param e フォームイベント
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // バリデーション
    if (!selectedScenarioId) {
      setFormError('シナリオを選択してください');
      return;
    }

    if (!title.trim()) {
      setFormError('セッションタイトルを入力してください');
      return;
    }

    try {
      await createNewSession(selectedScenarioId, title);
      // 成功したらセッション一覧ページに遷移
      if (success) {
        navigate('/gm/sessions');
      }
    } catch (err) {
      console.error('セッション作成エラー:', err);
    }
  };

  return {
    selectedScenarioId,
    setSelectedScenarioId,
    title,
    setTitle,
    formError,
    selectedScenario,
    handleSubmit,
    loading,
    success,
    error,
  };
};
