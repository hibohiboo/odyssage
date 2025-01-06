import { Link } from 'react-router';
import { LoginUser } from '../../auth';

export const Header: React.FC = () => (
  <header>
    <LoginUser />
    <Link className="ml-2" to="/login">
      ログイン
    </Link>
  </header>
);
