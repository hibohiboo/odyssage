import { ClientResponse } from 'hono/client';
import { LoaderFunction } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';

const { api } = apiClient;
type APIType = (typeof api)['scenarios']['public']['$get'];
type ScenarioResponse = Awaited<ReturnType<APIType>>;
export type PublicScenarioListData =
  ScenarioResponse extends ClientResponse<infer T> ? T : never;

export const publicScenarioListLoader: LoaderFunction = async () => {
  const response = await api.scenarios.public.$get();
  const data = await response.json();

  return data;
};
