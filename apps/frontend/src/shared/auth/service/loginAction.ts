import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../api/client';
import {
  getCurrentUser,
  onAuthStateChangedListener,
  signInAnonymous,
} from '../../lib/auth/firebaseAuth';
import { putHeaders } from '../../lib/http/putHeader';
import { setUser } from '../model/authSlice';

export const loginAction = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>('loginAction', async (_, thunkAPI) => {
  // CI環境でのテスト実行時に、別ユーザとして認識されるとテストが失敗するためユーザを固定
  if (import.meta.env.VITE_CI === 'true') {
    console.debug('VITE_CI is true');
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      await apiClient.api.users[':uid'].$put(
        { param: { uid: parsedUser.uid }, json: { name: '' } },
        { headers: putHeaders },
      );
      thunkAPI.dispatch(
        setUser({
          uid: parsedUser.uid,
          displayName: parsedUser.displayName,
          isAnonymous: parsedUser.isAnonymous,
        }),
      );

      return;
    }
  }

  // Firebase Authの状態が変化したときに呼ばれるリスナーを登録
  onAuthStateChangedListener(async (user) => {
    console.log('test', user);
    if (!user) {
      thunkAPI.dispatch(
        setUser({ uid: null, displayName: null, isAnonymous: null }),
      );
      return;
    }
    const storeUserData = {
      uid: user.uid,
      displayName: user.displayName,
      isAnonymous: user.isAnonymous,
    };

    if (import.meta.env.VITE_CI === 'true') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userToken', await user.getIdToken());
    }

    if (!user.isAnonymous) {
      console.log('loggined user', user);
    }
    const result = await apiClient.api.users[':uid'].$get({
      param: { uid: user.uid },
    });
    if (result.status !== 404) {
      thunkAPI.dispatch(setUser(storeUserData));
      return;
    }
    console.log('Creating user');
    const ret = await apiClient.api.users[':uid'].$put(
      { param: { uid: user.uid }, json: { name: '' } },
      { headers: putHeaders },
    );
    // ユーザが作成されていない状態でシナリオを作成しようとするとエラーになる
    thunkAPI.dispatch(setUser(storeUserData));

    if (ret.status !== 204) {
      console.error('Failed to create user');
    }
  });

  setTimeout(async () => {
    const user = getCurrentUser();

    if (user) {
      console.debug('user already signed in');
      return;
    }
    console.debug('waiting 1 sec login anonymous');
    try {
      // 1秒待ってまだログインしていなければ匿名認証でログイン
      await signInAnonymous();
    } catch (e) {
      console.warn('Failed to sign in anonymously', e);
    }
  }, 1000);
});
