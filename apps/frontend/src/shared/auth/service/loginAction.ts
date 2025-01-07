import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCurrentUser,
  onAuthStateChangedListener,
  signInAnonymous,
} from '../../lib/auth/firebaseAuth';
import { setUser } from '../model/authSlice';

export const loginAction = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('loginAction', async (_, thunkAPI) => {
  onAuthStateChangedListener(async (user) => {
    console.log('onAuthStateChangedListener', user);
    if (!user) {
      thunkAPI.dispatch(setUser({ uid: null, displayName: null }));
      return;
    }
    thunkAPI.dispatch(
      setUser({ uid: user.uid, displayName: user.displayName }),
    );
  });

  setTimeout(async () => {
    const user = getCurrentUser();

    if (user) {
      console.debug('user already signed in');
      return;
    }
    console.debug('waiting 1 sec login anonymous');
    // 1秒待ってまだログインしていなければ匿名認証でログイン
    await signInAnonymous();
  }, 1000);
});
