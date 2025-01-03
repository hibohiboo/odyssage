import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userDisplayNameSelector, uidSelector } from '../model/authSlice';
import { signInAnonymous } from '../service/firebaseAuth';

const LoginUser: React.FC = () => {
  const userName = useSelector(userDisplayNameSelector);
  const user = useSelector(uidSelector);

  useEffect(() => {
    signInAnonymous();
  }, []);
  if (user == null) {
    return <div>ログイン中</div>;
  }
  if (!userName) {
    return <div>ゲストユーザ</div>;
  }

  return <div>{userName}</div>;
};

export default LoginUser;
