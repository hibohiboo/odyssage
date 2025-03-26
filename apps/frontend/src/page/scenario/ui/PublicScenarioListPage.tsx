import { PublicScenarioListPage as PublicScenarioListPageUI } from '@odyssage/ui/page-ui';
import { useLoaderData } from 'react-router';
import { PublicScenarioListData } from '../api/publicScenarioListLoader';

const PublicScenarioListPage = () => {
  const loaderData = useLoaderData<PublicScenarioListData>();

  return (
    <PublicScenarioListPageUI
      scenarios={loaderData.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.overview || '',
        updatedAt: s.updatedAt,
        status: 'public',
        usedByGMs: 0,
        tags: [],
      }))}
    />
  );
};

export default PublicScenarioListPage;
