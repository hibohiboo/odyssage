import { HttpResponse, http } from 'msw';
import { userHandlers } from './responses/user';
import { baseUrl, okResponseStatus } from './utils';

export const handlers = [
  ...userHandlers,
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
