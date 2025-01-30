import { createBrowserRouter } from 'react-router';
import {
  ChangeNamePage,
  LoginPage,
  SignupPage,
} from '@odyssage/frontend/page/login';
import {
  ScenarioCreatePage,
  ScenarioListPage,
  ScenarioEditPage,
} from '@odyssage/frontend/page/scenario';
import { TopPage } from '@odyssage/frontend/page/top';
import { Layout } from '@odyssage/frontend/shared/ui';

export const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      children: [
        {
          path: '',
          element: <TopPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: 'signup',
          element: <SignupPage />,
        },
        {
          path: 'change-name',
          element: <ChangeNamePage />,
        },
        {
          path: 'scenario',
          children: [
            {
              path: 'create',
              element: <ScenarioCreatePage />,
            },
            {
              path: 'list',
              element: <ScenarioListPage />,
            },
            {
              path: 'edit/:id',
              element: <ScenarioEditPage />,
            },
          ],
        },
      ],
    },
  ]);
