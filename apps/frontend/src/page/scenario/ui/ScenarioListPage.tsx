import { ScenarioListPage as ScenarioListPageUI } from '@odyssage/ui/page-ui';
import { ClientResponse } from 'hono/client';
import { useEffect, useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

type APIType = (typeof apiClient.api.users)[':uid']['scenario']['$get'];
type ScenarioResponse = Awaited<ReturnType<APIType>>;
type ScenarioData =
  ScenarioResponse extends ClientResponse<infer T> ? T : never;

const ScenarioListPage = () => {
  const uid = useAppSelector(uidSelector);

  const [myScenarios, setMyScenarios] = useState<ScenarioData>([]);

  useEffect(() => {
    if (!uid) return;
    const fetchScenarios = async (id: string) => {
      const response = await apiClient.api.users[':uid'].scenario.$get({
        param: { uid: id },
      });
      const data = await response.json();
      setMyScenarios(data);
    };
    fetchScenarios(uid);
  }, [uid]);
  return (
    <ScenarioListPageUI
      scenarios={[...myScenarios].map((s) => ({
        id: s.id,
        title: s.title,
        description: s.overview || '',
        updatedAt: s.updatedAt,
        status: s.visibility === 'public' ? 'public' : 'private',
        usedByGMs: 0,
        tags: [],
      }))}
    />
  );
};

export default ScenarioListPage;
