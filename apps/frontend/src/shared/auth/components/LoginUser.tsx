import React, { useEffect } from 'react';
import { Link } from 'react-router';
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
    return <span>ログイン中</span>;
  }
  if (!userName) {
    return <span>ゲストユーザ</span>;
  }

  return (
    <Link className="ml-2" to="/change-name">
      {userName}
    </Link>
  );
};

export default LoginUser;
