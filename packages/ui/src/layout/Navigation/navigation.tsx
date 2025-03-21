import { useState } from 'react';
import Logo from './logo';
import { MenuButton } from './menu-button';
import { DesktopNav } from './desktop-nav';
import { MobileMenu } from './mobile-nav';
import { NavLinkItem } from './types';

interface NavigationProps {
  currentPath: string;
  isMobile?: boolean;
  navLinks: NavLinkItem[];
}
export const Navigation: React.FC<NavigationProps> = ({
  currentPath: pathname,
  navLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-stone-50 border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <MenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
        <DesktopNav pathname={pathname} navLinks={navLinks} />
      </div>

      <MobileMenu
        isOpen={isOpen}
        pathname={pathname}
        navLinks={navLinks}
        closeMenu={closeMenu}
      />
    </header>
  );
};

export default Navigation;
