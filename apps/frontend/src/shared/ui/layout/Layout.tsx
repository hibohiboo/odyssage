import { Outlet } from 'react-router';
import { Header } from './Header';

export const Layout: React.FC = () => (
  <>
    <Header />

    <div id="sidebar">{/* other elements */}</div>
    <div id="detail">
      <Outlet />
    </div>
  </>
);
