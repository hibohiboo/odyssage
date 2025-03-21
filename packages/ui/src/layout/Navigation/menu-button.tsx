import { Menu, X } from 'lucide-react';

// モバイルメニューボタン
export const MenuButton = ({
  isOpen,
  toggleMenu,
}: {
  isOpen: boolean;
  toggleMenu: () => void;
}) => (
  <button
    onClick={toggleMenu}
    className="md:hidden p-2 rounded-md hover:bg-stone-100"
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
  >
    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
  </button>
);
