import { createAsyncThunk } from '@reduxjs/toolkit';
import { credentialUserWithMail } from '../../lib/auth/firebaseAuth';
import { changeNameAction } from './changeNameAction';

export const signupAction = createAsyncThunk<
  void,
  { displayName: string; email: string; password: string },
  { dispatch: AppDispatch; state: RootState }
>('signupAction', async (payload, thunkAPI) => {
  await credentialUserWithMail(payload.email, payload.password);
  await thunkAPI.dispatch(
    changeNameAction({ displayName: payload.displayName }),
  );
});
