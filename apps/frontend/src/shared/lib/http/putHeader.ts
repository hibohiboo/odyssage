import { getIdToken } from '../auth/firebaseAuth';

export const putHeaders = async () => ({
  Authorization: `Bearer ${await getIdToken()}`,
  'Content-Type': 'application/json',
});
