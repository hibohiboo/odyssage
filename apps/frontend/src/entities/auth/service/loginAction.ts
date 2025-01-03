import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  onAuthStateChangedListener,
  signInAnonymous,
} from '@odyssage/frontend/shared/lib/auth/firebaseAuth';
import { BACKEND_DOMAIN } from '@odyssage/frontend/shared/lib/config';
import { setUser } from '../model/authSlice';

export const loginAction = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('loginAction', async (_, thunkAPI) => {
  onAuthStateChangedListener(async (user) => {
    if (!user) {
      thunkAPI.dispatch(setUser({ uid: null, displayName: null }));
      return;
    }
    thunkAPI.dispatch(
      setUser({ uid: user.uid, displayName: user.displayName }),
    );
    const result = await fetch(`${BACKEND_DOMAIN}/user/${user.uid}`);
    if (result.status !== 404) return;
    console.log('Creating user');
    const ret = await fetch(`${BACKEND_DOMAIN}/user/${user.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (ret.status !== 204) {
      console.error('Failed to create user');
    }
  });
  await signInAnonymous();
});
