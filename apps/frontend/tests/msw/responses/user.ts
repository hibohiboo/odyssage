import { http, HttpResponse } from 'msw';
import { baseUrl, okResponseStatus } from '../utils';

export const userHandlers = [
  http.get(
    `${baseUrl}/user/:uid`,
    () =>
      new HttpResponse(
        JSON.stringify([
          {
            id: 'test-aaaa-bbbb-cccc-29ddfc9efee1',
            name: 'test',
          },
        ]),
        okResponseStatus,
      ),
  ),
  http.put(`${baseUrl}/user/:uid`, () => new HttpResponse('', { status: 204 })),
];
