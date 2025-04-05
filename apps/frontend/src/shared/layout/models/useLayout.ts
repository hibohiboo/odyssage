import {
  BookOpen,
  Calendar,
  Home,
  LoaderIcon,
  MapPin,
  User,
} from '@odyssage/ui/icons';
import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  isAnonymousSelector,
  uidSelector,
  userDisplayNameSelector,
} from '../../auth/model/authSlice';
import { loginAction } from '../../auth/service/loginAction';
import { useAppDispatch, useAppSelector } from '../../lib/store';

export interface NavLink {
  to: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export function useLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAnonymous = useAppSelector(isAnonymousSelector);
  const userName = useAppSelector(userDisplayNameSelector);
  const user = useAppSelector(uidSelector);
  const dispatch = useAppDispatch();

  // Compute navigation links based on user state
  const navLinks = useMemo(() => {
    const defaultNavLinks = [
      { to: '/', label: 'ホーム', icon: Home },
      { to: '/creator/scenario/list', label: 'シナリオ管理', icon: BookOpen },
      { to: '/gm/scenario/public', label: '公開シナリオ', icon: MapPin },
      { to: '/gm/sessions', label: 'セッション一覧', icon: Calendar },
    ];

    if (user == null) {
      return [{ to: '/', label: 'ログイン中', icon: LoaderIcon }];
    }

    if (isAnonymous) {
      return [
        ...defaultNavLinks,
        { to: '/login', label: 'ログイン', icon: User },
      ];
    }
    const name = userName ?? 'ゲストユーザ';
    return [
      ...defaultNavLinks,
      { to: '/change-name', label: name, icon: User },
    ];
  }, [isAnonymous, user, userName]);

  // Handle login on component mount
  useEffect(() => {
    dispatch(loginAction());
  }, [dispatch]);

  return {
    currentPath,
    navLinks,
  };
}
