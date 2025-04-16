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
  }) => {
    if (loading.current) return; // Prevent multiple submissions
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
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create scenario');
      }
    } catch (err) {
      console.error('Error creating scenario:', err);
      setError('Failed to create scenario');
    } finally {
      loading.current = false;
    }
  };

  return { createScenario, loading: loading.current, success, error };
};
