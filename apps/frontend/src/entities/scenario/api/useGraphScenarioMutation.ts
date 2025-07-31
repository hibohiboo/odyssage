import { InferRequestType, InferResponseType } from 'hono';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  scenarioId: string;
};

export const useGraphScenarioMutation = (props: Props) => {
  const { $put } = apiClient.api['graph-scenarios'][':id'];
  
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
      throw new Error('Failed to create/update graph scenario');
    };
    
  return useSWRMutation(
    `api/graph-scenarios/${props.scenarioId}`,
    fetcherFactory({ id: props.scenarioId }),
  );
};

export type GraphScenarioMutationResponse = InferResponseType<
  typeof apiClient.api['graph-scenarios'][':id']['$put']
>;