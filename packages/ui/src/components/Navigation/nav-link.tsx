import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

interface NavLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavLink = ({
  to,
  label,
  icon: Icon,
  isActive,
  isMobile = false,
  onClick,
}: NavLinkProps) => {
  // デスクトップ用スタイル
  const desktopClasses = `flex items-center gap-1 hover:text-amber-700 transition-colors ${
    isActive ? 'text-amber-700 font-medium' : 'text-stone-600'
  }`;

  // モバイル用スタイル
  const mobileClasses = `flex items-center gap-2 p-3 rounded-md ${
    isActive ? 'bg-amber-50 text-amber-700' : 'text-stone-700'
  }`;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={isMobile ? mobileClasses : desktopClasses}
    >
      <Icon className={isMobile ? 'h-5 w-5' : 'h-4 w-4'} />
      <span>{label}</span>
    </Link>
  );
};

export default NavLink;
