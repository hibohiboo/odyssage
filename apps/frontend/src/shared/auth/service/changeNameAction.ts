import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';
import { changeUserName, getCurrentUser } from '../../lib/auth/firebaseAuth';
import { putHeaders } from '../../lib/http/putHeader';
import { setUser } from '../model/authSlice';

export const changeNameAction = createAsyncThunk<
  void,
  { displayName: string },
  { dispatch: AppDispatch; state: RootState }
>('changeNameAction', async (payload, thunkAPI) => {
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
    { param: { uid: user.uid }, json: { name: payload.displayName } },
    { headers: putHeaders },
  );

  if (ret.status !== 204) {
    console.error('Failed to create user');
  }
});
