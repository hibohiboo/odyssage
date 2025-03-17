import { Outlet } from 'react-router';
import { Header } from './Header';
// ナビゲーションリンクの定義
const navLinks = [
  { to: '/', label: 'ホーム', icon: Home },
  { to: '/dashboard', label: 'シナリオ一覧', icon: BookOpen },
  { to: '/create', label: '新規作成', icon: PlusCircle },
  { to: '/account', label: 'アカウント', icon: User },
];
export const Layout: React.FC = () => (
  <>
    <Header />

    <div id="sidebar">{/* other elements */}</div>
    <div id="detail">
      <Outlet />
    </div>
  </>
);
