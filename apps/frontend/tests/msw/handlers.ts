import { HttpResponse, http } from 'msw';

const baseUrl = `${import.meta.env.VITE_BACKEND_DOMAIN}/api`;
const okResponseStatus = {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
};
export const handlers = [
  http.get(
    `${baseUrl}/user/:uid`,
    () =>
      new HttpResponse(
        JSON.stringify([
          {
            id: 'test-aaaa-bbbb-cccc-29ddfc9efee1',
          },
        ]),
        okResponseStatus,
      ),
  ),
  http.put(`${baseUrl}/user/:uid`, () => new HttpResponse('', { status: 204 })),
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
