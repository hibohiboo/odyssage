import { createBrowserRouter, Outlet } from 'react-router';
import { GmLayout } from '@odyssage/frontend/page/gm';
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
  SessionEditPage,
  sessionListLoader,
  gmSessionListLoader,
  sessionDetailLoader,
} from '@odyssage/frontend/page/session';
import { TopPage } from '@odyssage/frontend/page/top';
import { Layout } from '@odyssage/frontend/shared/layout';
import { AppDispatch } from '../store';

export const createRouter = (_: { dispatch: AppDispatch }) =>
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
          // 認証状態チェックのためのGmLayoutを適用
          element: (
            <GmLayout>
              <Outlet />
            </GmLayout>
          ),
          children: [
            {
              path: ':uid/sessions/:id',
              element: <SessionEditPage />,
              loader: sessionDetailLoader,
            },
            {
              path: 'sessions',
              children: [
                {
                  path: ':uid',
                  loader: gmSessionListLoader,
                  element: <SessionListPage />,
                },
              ],
            },
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
    {
      path: 'player',
      children: [
        {
          path: 'sessions',
          element: <SessionListPage />,
          loader: sessionListLoader,
        },
      ],
    },
  ]);
