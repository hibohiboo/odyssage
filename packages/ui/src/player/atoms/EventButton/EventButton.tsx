import { type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'choice' | 'continue';

export interface EventButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
const useViewModel = ({
  disabled,
  loading,
}: {
  disabled?: boolean;
  loading?: boolean;
}) => {
  const baseClasses =
    'px-4 py-2 rounded-lg font-medium transition-colors min-h-[48px] touch-manipulation';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    choice:
      'bg-white border-2 border-gray-300 text-gray-900 hover:border-blue-500 hover:bg-blue-50 disabled:bg-gray-50',
    continue: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300',
  };

  const isDisabled = disabled || loading;

  return {
    baseClasses,
    variantClasses,
    isDisabled,
  };
};
export function EventButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: EventButtonProps) {
  const { baseClasses, variantClasses, isDisabled } = useViewModel({
    disabled,
    loading,
  });
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          処理中...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
