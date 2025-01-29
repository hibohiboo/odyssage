import { http, HttpResponse } from 'msw';

const res = {
  kind: 'identitytoolkit#GetAccountInfoResponse',
  users: [
    {
      localId: 'L9nVwBnLhGchAkwqvWKmIAw9sSp9',
      lastLoginAt: '1738156334819',
      createdAt: '1738156318691',
      lastRefreshAt: '2025-01-29T13:12:14.819Z',
      emailVerified: false,
      email: 'hibohiboo66+odyssage@gmail.com',
      salt: 'fakeSaltCbGawwpZIR2S28Ubg3RU',
      passwordHash: '',
      passwordUpdatedAt: 1738156334819,
      validSince: '1738156334',
      providerUserInfo: [
        {
          providerId: 'password',
          email: 'hibohiboo66+odyssage@gmail.com',
          federatedId: 'hibohiboo66+odyssage@gmail.com',
          rawId: 'hibohiboo66+odyssage@gmail.com',
          displayName: 'hibo',
        },
      ],
      displayName: 'hibo',
    },
  ],
};

export const firebaseHandlers = [
  // firebaseのエミュレータを起動が面倒なら、以下のコメントアウトを外してください
  // http.post(
  //   `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:lookup`,
  //   () => new HttpResponse(JSON.stringify(res), okResponseStatus),
  // ),
  http.post(
    `http://127.0.0.1:9099/securetoken.googleapis.com/v1/token`,
    () => new HttpResponse(JSON.stringify(res), { status: 204 }),
  ),
];

// fakeHash:salt=fakeSaltCbGawwpZIR2S28Ubg3RU:password=passw0rd
