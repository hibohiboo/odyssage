import { createAsyncThunk } from '@reduxjs/toolkit';
import { logOut } from '../../lib/auth/firebaseAuth';
import { setUser } from '../model/authSlice';

export const logoutAction = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('logoutAction', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(
      setUser({ uid: null, displayName: null, isAnonymous: null }),
    );
    await logOut();
  } catch (e) {
    console.error(e);
    thunkAPI.rejectWithValue('ログアウトに失敗');
  }
});
