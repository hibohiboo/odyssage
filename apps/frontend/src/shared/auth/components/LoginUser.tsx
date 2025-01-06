import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/store';
import { userDisplayNameSelector, uidSelector } from '../model/authSlice';
import { loginAction } from '../service/loginAction';

const LoginUser: React.FC = () => {
  const userName = useAppSelector(userDisplayNameSelector);
  const user = useAppSelector(uidSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loginAction());
  }, [dispatch]);
  if (user == null) {
    return <div>ログイン中</div>;
  }
  if (!userName) {
    return <div>ゲストユーザ</div>;
  }

  return <div>{userName}</div>;
};

export default LoginUser;
