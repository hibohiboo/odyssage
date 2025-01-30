import { useEffect, useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

const ScenarioListPage = () => {
  const uid = useAppSelector(uidSelector);
  const [scenarios, setScenarios] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);
  const [myScenarios, setMyScenarios] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await apiClient.api.scenarios.$get();
        const data = await response.json();
        setScenarios(data);
      } catch (error) {
        console.error('Failed to fetch scenarios', error);
      }
    };

    fetchScenarios();
  }, []);
  useEffect(() => {
    if (!uid) return;
    const fetchScenarios = async (id: string) => {
      const response = await apiClient.api.user[':uid'].scenario.$get({
        param: { uid: id },
      });
      const data = await response.json();
      setMyScenarios(data);
    };
    fetchScenarios(uid);
  }, [uid]);

  return (
    <div>
      <h1>Scenario List</h1>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>{scenario.title}</li>
        ))}
      </ul>
      <h2>My Scenarios</h2>
      <ul>
        {myScenarios.map((scenario) => (
          <li key={scenario.id}>{scenario.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioListPage;
