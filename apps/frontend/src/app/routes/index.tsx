import { createBrowserRouter } from 'react-router';
import { ChangeName, Login, Signup } from '@odyssage/frontend/entities/auth';
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
        {
          path: 'signup',
          element: <Signup />,
        },
        {
          path: 'change-name',
          element: <ChangeName />,
        },
      ],
    },
  ]);
