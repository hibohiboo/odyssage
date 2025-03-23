import { ClientResponse } from 'hono/client';
import { LoaderFunction } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type APIType = (typeof apiClient.api)['scenario'][':id']['$get'];
type ScenarioResponse = Awaited<ReturnType<APIType>>;
export type ScenarioData =
  ScenarioResponse extends ClientResponse<infer T> ? T : never;

export const detailPageLoader: LoaderFunction = async (args) => {
  const { id } = args.params;
  if (!id) {
    throw new Error('UID is required');
  }
  const response = await apiClient.api.scenario[':id'].$get({
    param: { id },
  });
  const data = await response.json();

  return data;
};
