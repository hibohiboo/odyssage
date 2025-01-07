import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';
import {
  changeUserName,
  credentialUserWithMail,
  getCurrentUser,
} from '../../lib/auth/firebaseAuth';
import { putHeaders } from '../../lib/http/putHeader';
import { setUser } from '../model/authSlice';

export const signUpAction = createAsyncThunk<
  void,
  { displayName: string; email: string; password: string },
  { dispatch: AppDispatch; state: RootState }
>('signUpAction', async (payload, thunkAPI) => {
  await credentialUserWithMail(payload.email, payload.password);
  await changeUserName(payload.displayName);

  const user = getCurrentUser();
  if (user == null) {
    console.error('Failed to create user');
    return;
  }
  thunkAPI.dispatch(
    setUser({
      uid: user.uid,
      displayName: user.displayName,
      isAnonymous: user.isAnonymous,
    }),
  );
  const ret = await apiClient.api.user[':uid'].$put(
    { param: { uid: user.uid } },
    { headers: putHeaders },
  );

  if (ret.status !== 204) {
    console.error('Failed to create user');
  }
});
