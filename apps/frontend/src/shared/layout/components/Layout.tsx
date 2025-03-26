import { Navigation, Layout as LayoutUI } from '@odyssage/ui/layout';
import { Outlet } from 'react-router';
import { LoginUser } from '../../auth';
import { useLayout } from '../models/useLayout';

export function Layout() {
  const { currentPath, navLinks } = useLayout();

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
