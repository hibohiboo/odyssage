import { ClientResponse } from 'hono/client';
import { apiClient } from '@odyssage/frontend/shared/api/client';

type APIType = (typeof apiClient.api)['scenarios'][':id']['$get'];
type ScenarioResponse = Awaited<ReturnType<APIType>>;

type ScenarioResponseData =
  ScenarioResponse extends ClientResponse<infer T> ? T : never;

export type ScenarioData = Exclude<ScenarioResponseData, 'Not Found'>;

export const fetchScenario = async ({ id }: { id: string }) => {
  if (!id) {
    throw new Error('UID is required');
  }
  const response = await apiClient.api.scenarios[':id'].$get({
    param: { id },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch scenario with id ${id}`);
  }
  const data = await response.json();

  return {
    ...data,
  };
};
