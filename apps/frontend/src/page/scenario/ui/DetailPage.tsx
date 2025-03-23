import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { useLoaderData } from 'react-router';
import { ScenarioData } from '../api/detailLoader';

const DetailPage = () => {
  const loaderData = useLoaderData<ScenarioData>();

  return (
    <ScenarioDetailPage
      scenario={{
        id: loaderData.id,
        title: loaderData.title,
        description: loaderData.overview,
        updatedAt: loaderData.updatedAt,
        status: loaderData.visibility as 'private' | 'public',
        tags: [],
        isStockedByGM: false,
        gmCount: 0,
        nodes: [],
        connections: [],
      }}
    />
  );
};

export default DetailPage;
