import { useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';

export const useEditScenario = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const editScenario = async (scenario: {
    id: string;
    title: string;
    overview: string;
  }) => {
    setLoading(true);
    setSuccess(false);
    setError('');
    try {
      const response = await apiClient.api.user[':uid'].scenario[':id'].$put({
        param: { id: scenario.id },
        json: scenario,
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update scenario');
      }
    } catch (err) {
      console.error('Error updating scenario:', err);
      setError('Failed to update scenario');
    } finally {
      setLoading(false);
    }
  };

  return { editScenario, loading, success, error };
};
