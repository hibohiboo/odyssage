import { createAsyncThunk } from '@reduxjs/toolkit';
import { signIn } from '../../lib/auth/firebaseAuth';
import { setUser } from '../model/authSlice';

export const signinAction = createAsyncThunk<
  string,
  { email: string; password: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('signinAction', async (payload, thunkAPI) => {
  try {
    const user = await signIn(payload.email, payload.password);

    thunkAPI.dispatch(
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        isAnonymous: user.isAnonymous,
      }),
    );
    return 'signin success';
  } catch (e) {
    console.error(e);
    return thunkAPI.rejectWithValue('ログインに失敗しました。');
  }
});
