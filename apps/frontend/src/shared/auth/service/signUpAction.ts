import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';
import {
  changeUserName,
  credentialUserWithMail,
  getCurrentUser,
} from '../../lib/auth/firebaseAuth';
import { putHeaders } from '../../lib/http/putHeader';

export const signUpAction = createAsyncThunk<
  void,
  { displayName: string; email: string; password: string },
  { dispatch: AppDispatch; state: RootState }
>('loginAction', async (payload) => {
  await credentialUserWithMail(payload.email, payload.password);
  await changeUserName(payload.displayName);
  const user = getCurrentUser();
  if (user == null) {
    console.error('Failed to create user');
    return;
  }
  const ret = await apiClient.api.user[':uid'].$put(
    { param: { uid: user.uid } },
    { headers: putHeaders },
  );

  if (ret.status !== 204) {
    console.error('Failed to create user');
  }
});
