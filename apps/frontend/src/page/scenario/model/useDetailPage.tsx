import { useLoaderData } from 'react-router';
import { ScenarioData } from '../api/detailLoader';

export const useDetailPage = () => {
  const loaderData = useLoaderData<ScenarioData>();
  const scenario = {
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
  };
  return scenario;
};
