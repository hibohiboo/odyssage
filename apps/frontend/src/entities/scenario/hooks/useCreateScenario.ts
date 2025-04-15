import { useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';

export const useCreateScenario = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const createScenario = async (scenario: {
    id: string;
    title: string;
    overview: string;
    uid: string;
    visibility?: 'private' | 'public';
  }) => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
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
      setLoading(false);
    }
  };

  return { createScenario, loading, success, error };
};
