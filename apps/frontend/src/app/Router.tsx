import { useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { useAppDispatch } from '@odyssage/frontend/shared/lib/store';
import { createRouter } from './routes';

function Router() {
  const dispatch = useAppDispatch();
  const router = useMemo(() => createRouter({ dispatch }), [dispatch]);

  return <RouterProvider router={router} />;
}

export default Router;
