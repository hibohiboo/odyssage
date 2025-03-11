import React from 'react';
import Link from 'next/link';

export interface CtaButtonProps {
  /**
   * URL the button will navigate to
   */
  href: string;
  /**
   * Button style variant
   */
  variant?: 'primary' | 'outline';
  /**
   * Button contents
   */
  children: React.ReactNode;
}

/**
 * Call-to-action button component with built-in navigation link
 */
export const CtaButton = ({
  href,
  variant = 'primary',
  children,
}: CtaButtonProps) => (
  <Link
    href={href}
    className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'}`}
  >
    {children}
  </Link>
);

export default CtaButton;
