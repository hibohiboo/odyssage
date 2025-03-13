import React from 'react';

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
  href,
  variant = 'primary',
  children,
  className = '',
}: CtaButtonProps) => (
  <a
    href={href}
    className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} ${className}`}
  >
    {children}
  </a>
);

export default CtaButton;
