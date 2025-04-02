import { LoaderFunction } from 'react-router';
import { fetchScenario } from '@odyssage/frontend/entities/scenario';

export const createSessionPageLoader: LoaderFunction = async (args) => {
  const { id } = args.params;
  if (!id) {
    throw new Error('UID is required');
  }
  return fetchScenario({ id });
};
