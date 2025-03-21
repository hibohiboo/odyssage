import { Compass } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = '' }: LogoProps) => (
  <a
    href="/"
    className={`flex items-center gap-2 font-serif text-xl font-bold text-amber-700 ${className}`}
  >
    <Compass className="h-6 w-6" />
    <span>Odyssage</span>
  </a>
);

export default Logo;
