import { http, HttpResponse } from 'msw';
import { baseUrl } from '../../utils';

export const userScenarioHandlers = [
  http.post(
    `${baseUrl}/user/:uid/scenario`,
    () => new HttpResponse('', { status: 201 }),
  ),
];
