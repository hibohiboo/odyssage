import { InferRequestType } from 'hono';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type Props = {
  uid: string;
};
export const useScenarioCreateMutation = (props: Props) => {
  const { $post } = apiClient.api.user[':uid'].scenario;
  const fetcherFactory =
    (param: InferRequestType<typeof $post>['param']) =>
    async (
      _: string,
      { arg }: { arg: InferRequestType<typeof $post>['json'] },
    ) => {
      const res = await $post({ param, json: arg });
      if (res.ok) {
        return res.json();
      }
      throw new Error('Failed to create scenario');
    };
  return useSWRMutation(
    `api/user/${props.uid}`,
    fetcherFactory({ uid: props.uid }),
  );
};
