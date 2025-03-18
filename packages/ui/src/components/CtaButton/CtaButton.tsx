import React from 'react';
import { Link } from 'react-router';

export interface CtaButtonProps {
  /**
   * URL the button will navigate to
   */
  to: string;
  /**
   * Button style variant
   */
  variant?: 'primary' | 'outline';
  /**
   * Button contents (can include text and icons)
   */
  children: React.ReactNode;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * Call-to-action button component with built-in navigation link
 */
export const CtaButton = ({
  to,
  variant = 'primary',
  children,
  className = '',
}: CtaButtonProps) => (
  <Link
    to={to}
    className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} ${className}`}
  >
    {children}
  </Link>
);

export default CtaButton;
