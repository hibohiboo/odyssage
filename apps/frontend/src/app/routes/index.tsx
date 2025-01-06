import { createBrowserRouter } from 'react-router';
import { Layout } from '@odyssage/frontend/shared/ui';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: '/',
          element: <div>Home</div>,
        },
      ],
    },
  ]);
