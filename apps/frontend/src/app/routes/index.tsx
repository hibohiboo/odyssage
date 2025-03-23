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
  ScenarioDetailPage,
  detailPageLoader,
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
          path: 'creator',
          children: [
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
                  path: ':id',

                  children: [
                    {
                      path: '',
                      loader: detailPageLoader,
                      element: <ScenarioDetailPage />,
                    },
                    {
                      path: 'edit',
                      loader: detailPageLoader,
                      element: <ScenarioEditPage />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
