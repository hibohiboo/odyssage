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
  publicScenarioListLoader,
  PublicScenarioListPage,
} from '@odyssage/frontend/page/scenario';
import {
  CreateSessionPage,
  createSessionPageLoader,
  SessionListPage,
  sessionListLoader,
} from '@odyssage/frontend/page/session';
import { TopPage } from '@odyssage/frontend/page/top';
import { Layout } from '@odyssage/frontend/shared/layout';

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
          path: 'sessions',
          element: <SessionListPage />,
          loader: sessionListLoader,
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
                      element: (
                        <ScenarioDetailPage backLink="/creator/scenario/list" />
                      ),
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
        {
          path: 'gm',
          children: [
            {
              path: 'scenario',
              children: [
                {
                  path: 'public',
                  element: <PublicScenarioListPage />,
                  loader: publicScenarioListLoader,
                },
                {
                  path: ':id',
                  children: [
                    {
                      path: '',
                      loader: detailPageLoader,
                      element: (
                        <ScenarioDetailPage backLink="/gm/scenario/public" />
                      ),
                    },
                    {
                      path: 'session',
                      children: [
                        {
                          path: 'create',
                          element: <CreateSessionPage />,
                          loader: createSessionPageLoader,
                        },
                      ],
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
