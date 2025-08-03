import useSWRMutation from 'swr/mutation';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  sceneId: string;
};

export const useGraphSceneDeleteMutation = (props: Props) => {
  const graphSceneEndpoint = apiClient.api['graph-scenes'][':id'];
  const { $delete } = graphSceneEndpoint as { $delete: (params: { param: { id: string } }) => Promise<Response> };

  const fetcher = async (_: string) => {
    console.log('Attempting to delete scene:', props.sceneId);
    console.log('Delete method available:', typeof $delete);
    console.log('Endpoint methods:', Object.keys(graphSceneEndpoint));
    
    try {
      if (typeof $delete === 'function') {
        const res = await $delete({ param: { id: props.sceneId } });
        console.log('Delete response:', res.status, res.ok);
        
        if (res.ok) {
          return;
        }
        
        if (res.status === 404) {
          throw new Error('Scene not found');
        }
        
        throw new Error('Failed to delete graph scene');
      } else {
        throw new Error('Delete method not available in API client');
      }
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  return useSWRMutation(
    `api/graph-scenes/${props.sceneId}/delete`,
    fetcher,
  );
};