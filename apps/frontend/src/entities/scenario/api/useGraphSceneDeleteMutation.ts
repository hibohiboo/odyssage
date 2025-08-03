import useSWRMutation from 'swr/mutation';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  sceneId: string;
};

export const useGraphSceneDeleteMutation = (props: Props) => {
  const { $delete } = apiClient.api['graph-scenes'][':id'];

  const fetcher = async (_: string) => {
    const res = await $delete({ param: { id: props.sceneId } });
    if (res.ok) {
      return;
    }
    
    if (res.status === 404) {
      throw new Error('Scene not found');
    }
    
    throw new Error('Failed to delete graph scene');
  };

  return useSWRMutation(
    `api/graph-scenes/${props.sceneId}/delete`,
    fetcher,
  );
};