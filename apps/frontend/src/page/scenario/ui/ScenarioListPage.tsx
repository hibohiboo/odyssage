import { useEffect, useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';

const ScenarioListPage = () => {
  const [scenarios, setScenarios] = useState<
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

  return (
    <div>
      <h1>Scenario List</h1>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>{scenario.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioListPage;
