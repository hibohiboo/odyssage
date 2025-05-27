import { useRef, useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';

export const useCreateScenario = () => {
  const loading = useRef(false); // useState の更新は非同期だが、useRef は 同期的に扱えるため、ボタンをクリックした瞬間に isSubmitting.current を即座に true にできる。これによって ダブルクリックや二重発火を正確に防げる。
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const createScenario = async (scenario: {
    id: string;
    title: string;
    overview: string;
    uid: string;
    visibility?: 'private' | 'public';
  }): Promise<{success: boolean; error?: string}> => {
    if (loading.current) return {success: false, error: 'Already submitting'}; // Prevent multiple submissions
    loading.current = true;
    setSuccess(false);
    setError('');
    try {
      const response = await apiClient.api.users[':uid'].scenario.$post({
        param: { uid: scenario.uid },
        json: scenario,
      });
      if (response.ok) {
        setSuccess(true);
        return {success: true};
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'シナリオの作成に失敗しました';
        setError(errorMessage);
        return {success: false, error: errorMessage};
      }
    } catch (err) {
      console.error('Error creating scenario:', err);
      const errorMessage = 'シナリオの作成に失敗しました';
      setError(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      loading.current = false;
    }
  };

  return { createScenario, loading: loading.current, success, error };
};
