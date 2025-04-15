import React from 'react';
import { Link } from 'react-router';
import { useAppSelector } from '../../lib/store';
import { userDisplayNameSelector, uidSelector } from '../model/authSlice';

const LoginUser: React.FC = () => {
  const userName = useAppSelector(userDisplayNameSelector);
  const user = useAppSelector(uidSelector);

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
