import { ScenarioListPage as ScenarioListPageUI } from '@odyssage/ui/page-ui';
import { ClientResponse } from 'hono/client';
import { useEffect, useState } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

type APIType = (typeof apiClient.api.authors)[':uid']['scenarios']['$get'];
type ScenarioResponse = Awaited<ReturnType<APIType>>;
type ScenarioResponseData =
  ScenarioResponse extends ClientResponse<infer T> ? T : never;

type ScenarioData = Exclude<ScenarioResponseData, { message: string }>;

const ScenarioListPage = () => {
  const uid = useAppSelector(uidSelector);

  const [myScenarios, setMyScenarios] = useState<ScenarioData>([]);

  useEffect(() => {
    if (!uid) return;
    const fetchScenarios = async (id: string) => {
      const response = await apiClient.api.authors[':uid'].scenarios.$get({
        param: { uid: id },
      });
      if (!response.ok) {
        console.error('Failed to fetch scenarios');
        return;
      }
      const data = await response.json();
      // 型ガード: 配列かどうかをチェック
      if (Array.isArray(data)) {
        setMyScenarios(data);
      } else {
        console.error('Expected scenario array, received:', data);
        setMyScenarios([]);
      }
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
