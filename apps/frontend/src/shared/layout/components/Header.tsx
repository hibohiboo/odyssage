import { Link } from 'react-router';
import { LoginUser } from '../../auth';
import { isAnonymousSelector } from '../../auth/model/authSlice';
import { useAppSelector } from '../../lib/store';

export const Header: React.FC = () => {
  const isAnonymous = useAppSelector(isAnonymousSelector);
  return (
    <header>
      <LoginUser />
      {isAnonymous && (
        <Link className="ml-2" to="/login">
          ログイン
        </Link>
      )}
    </header>
  );
};
