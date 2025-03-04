import type { ScnearioListItem } from '@odyssage/schema/src/schema';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

const createScenario = (scenario: ScnearioListItem) => (
  <li key={scenario.id}>
    <Link to={`/scenario/edit/${scenario.id}`}>{scenario.title}</Link>
  </li>
);
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
      <ul>{scenarios.map(createScenario)}</ul>
      <h2>My Scenarios</h2>
      <ul>{myScenarios.map(createScenario)}</ul>
    </div>
  );
};

export default ScenarioListPage;
