import NavLink from './nav-link';
import { NavLinkItem } from './types';

// モバイルメニュー
export const MobileMenu = ({
  isOpen,
  pathname,
  navLinks,
  closeMenu,
}: {
  isOpen: boolean;
  pathname: string;
  closeMenu: () => void;
  navLinks: NavLinkItem[];
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-white z-40 paper-texture">
      <nav className="flex flex-col p-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            label={link.label}
            icon={link.icon}
            isActive={pathname === link.to}
            onClick={closeMenu}
            isMobile={true}
          />
        ))}
      </nav>
    </div>
  );
};
