import {
  BookOpen,
  Home,
  LoaderIcon,
  PlusCircle,
  User,
} from '@odyssage/ui/icons';
import { Navigation, Layout as LayoutUI } from '@odyssage/ui/layout';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router';
import { LoginUser } from '../../auth';
import {
  isAnonymousSelector,
  uidSelector,
  userDisplayNameSelector,
} from '../../auth/model/authSlice';
import { loginAction } from '../../auth/service/loginAction';
import { useAppDispatch, useAppSelector } from '../../lib/store';

// ナビゲーションリンクの定義
export function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAnonymous = useAppSelector(isAnonymousSelector);
  const userName = useAppSelector(userDisplayNameSelector);
  const user = useAppSelector(uidSelector);
  const dispatch = useAppDispatch();

  const navLinks = useMemo(() => {
    const defaultNavLinks = [
      { to: '/', label: 'ホーム', icon: Home },
      { to: '/creator/scenario/list', label: 'シナリオ一覧', icon: BookOpen },
      {
        to: '/creator/scenario/create',
        label: 'シナリオ新規作成',
        icon: PlusCircle,
      },
    ];
    if (user == null) {
      return [{ to: '/', label: 'ログイン中', icon: LoaderIcon }];
    }

    if (isAnonymous) {
      return [
        ...defaultNavLinks,
        { to: '/login', label: 'ログイン', icon: User },
        { to: '/signup', label: 'サインアップ', icon: User },
      ];
    }
    const name = userName ?? 'ゲストユーザ';
    return [
      ...defaultNavLinks,
      { to: '/change-name', label: name, icon: User },
    ];
  }, [isAnonymous, user, userName]);
  useEffect(() => {
    dispatch(loginAction());
  }, [dispatch]);
  return (
    <LayoutUI
      navigation={
        <>
          <Navigation navLinks={navLinks} currentPath={currentPath} />
          <LoginUser />
        </>
      }
    >
      <Outlet />
    </LayoutUI>
  );
}
