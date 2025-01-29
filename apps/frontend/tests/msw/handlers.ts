import { HttpResponse, http } from 'msw';
import { firebaseHandlers } from './responses/firebase';
import { userHandlers } from './responses/user';
import { userScenarioHandlers } from './responses/user/scenario';
import { baseUrl, okResponseStatus } from './utils';

export const handlers = [
  ...userHandlers,
  ...firebaseHandlers,
  ...userScenarioHandlers,
  http.get(
    `${baseUrl}/scenarios`,
    () =>
      new HttpResponse(
        JSON.stringify([
          {
            id: 'test-aaaa-bbbb-cccc-29ddfc9efee1',
            title: 'シナリオ名',
          },
        ]),
        okResponseStatus,
      ),
  ),
];
