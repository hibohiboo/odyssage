import NavLink from './nav-link';
import { NavLinkItem } from './types';

// デスクトップナビゲーション
export const DesktopNav = ({
  pathname,
  navLinks,
}: {
  pathname: string;
  navLinks: NavLinkItem[];
}) => (
  <nav className="hidden md:flex items-center gap-6">
    {navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        label={link.label}
        icon={link.icon}
        isActive={pathname === link.to}
      />
    ))}
  </nav>
);
