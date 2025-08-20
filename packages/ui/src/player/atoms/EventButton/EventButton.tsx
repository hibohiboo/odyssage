import { type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'choice' | 'continue';

export interface EventButtonProps {
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
  'data-testid'?: string;
}

const VARIANT_STYLES = {
  primary: {
    base: 'bg-blue-600 text-white hover:bg-blue-700',
    disabled: 'bg-gray-400 text-gray-100',
  },
  secondary: {
    base: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    disabled: 'bg-gray-100 text-gray-500',
  },
  choice: {
    base: 'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-blue-50',
    disabled: 'bg-gray-50 text-gray-400 border-gray-200',
  },
  continue: {
    base: 'bg-green-600 text-white hover:bg-green-700',
    disabled: 'bg-gray-400 text-gray-100',
  },
};

const LoadingContent = () => (
  <span className="flex items-center justify-center">
    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
    処理中...
  </span>
);

const getButtonClasses = (variant: Variant, disabled: boolean, loading: boolean, className: string) => {
  const isDisabled = disabled || loading;
  const styles = VARIANT_STYLES[variant];
  const variantClass = isDisabled ? styles.disabled : styles.base;
  
  return [
    'px-4 py-2 rounded-lg font-medium transition-colors min-h-[48px] touch-manipulation',
    variantClass,
    isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
    className,
  ].join(' ');
};

export function EventButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ariaLabel,
  'data-testid': dataTestId,
}: EventButtonProps) {
  const isDisabled = disabled || loading;
  const classes = getButtonClasses(variant, disabled, loading, className);
  const content = loading ? <LoadingContent /> : children;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={classes}
      data-testid={dataTestId}
    >
      {content}
    </button>
  );
}
