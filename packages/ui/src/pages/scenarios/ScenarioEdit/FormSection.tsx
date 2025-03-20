import React from 'react';

interface FormSectionProps {
  readonly title?: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function FormSection({
  title,
  children,
  className = 'mb-6',
}: FormSectionProps) {
  return (
    <div className={`card p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
