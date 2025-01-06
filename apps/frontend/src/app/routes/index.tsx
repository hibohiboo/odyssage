import { createBrowserRouter } from 'react-router';
import { Login } from '@odyssage/frontend/entities/auth';
import { Layout } from '@odyssage/frontend/shared/ui';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
  ]);
