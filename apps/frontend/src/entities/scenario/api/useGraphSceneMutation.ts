import { InferRequestType, InferResponseType } from 'hono';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  sceneId: string;
};

export const useGraphSceneMutation = (props: Props) => {
  const { $put } = apiClient.api['graph-scenes'][':id'];

  const fetcherFactory =
    (param: InferRequestType<typeof $put>['param']) =>
    async (
      _: string,
      { arg }: { arg: InferRequestType<typeof $put>['json'] },
    ) => {
      const res = await $put({ param, json: arg });
      if (res.ok) {
        return res.json();
      }
      throw new Error('Failed to create/update graph scene');
    };

  return useSWRMutation(
    `api/graph-scenes/${props.sceneId}`,
    fetcherFactory({ id: props.sceneId }),
  );
};

export type GraphSceneMutationResponse = InferResponseType<
  (typeof apiClient.api)['graph-scenes'][':id']['$put']
>;
