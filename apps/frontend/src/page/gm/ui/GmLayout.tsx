import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { LoadingSpinner } from '@odyssage/frontend/shared/ui';
import { uidSelector } from '../../../shared/auth/model/authSlice';

/**
 * GM関連ページのレイアウトコンポーネント
 * 認証状態を確認し、未認証または認証確認中の場合は適切な表示に切り替える
 */
interface GmLayoutProps {
  children: ReactNode;
}

export const GmLayout: FC<GmLayoutProps> = ({ children }) => {
  const uid = useSelector(uidSelector);

  // 認証状態が未確定（ローディング中）の場合は読み込み中表示
  if (uid == null) {
    return <LoadingSpinner message="認証状態を確認中..." />;
  }

  // 認証されていない場合はログインページにリダイレクト
  if (!uid) {
    return <Navigate to="/login" replace />;
  }

  // 認証済みの場合は子コンポーネント（GM関連コンテンツ）を表示
  return <>{children}</>;
};
