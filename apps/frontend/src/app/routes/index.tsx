import { createBrowserRouter } from 'react-router';
import { ChangeName, Login } from '@odyssage/frontend/entities/auth';
import { Layout } from '@odyssage/frontend/shared/ui';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: 'signup',
          element: <Login />,
        },
        {
          path: 'change-name',
          element: <ChangeName />,
        },
      ],
    },
  ]);
