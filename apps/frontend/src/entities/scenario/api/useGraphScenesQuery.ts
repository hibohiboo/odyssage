import useSWR from 'swr';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  scenarioId: string;
};

export const useGraphScenesQuery = (props: Props) => {
  const { scenarioId } = props;

  const fetcher = async () => {
    const response = await apiClient.api['graph-scenes'].scenario[':scenarioId'].$get({
      param: { scenarioId },
    });
    
    if (response.ok) {
      return response.json();
    }
    throw new Error('Failed to fetch scenes');
  };

  return useSWR(
    scenarioId ? `api/graph-scenes/scenario/${scenarioId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
};