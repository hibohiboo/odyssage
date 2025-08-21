
export interface ChoiceOptionProps {
  /** 選択肢のテキスト */
  text: string;
  /** 選択肢の詳細説明（オプション） */
  description?: string;
  /** 選択肢がクリックされた時のハンドラー */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** 選択肢が無効かどうか */
  disabled?: boolean;
  /** 選択肢が選択されているかどうか */
  selected?: boolean;
  /** 追加のCSSクラス */
  className?: string;
  /** アクセシビリティ用ラベル */
  ariaLabel?: string;
}

const getButtonClasses = (disabled: boolean, selected: boolean, className: string) => {
  const baseClasses = [
    'w-full p-4 text-left border-2 rounded-lg transition-all duration-200',
    'min-h-[80px] touch-manipulation',
    'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  ];

  if (disabled) {
    baseClasses.push(
      'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
    );
  } else if (selected) {
    baseClasses.push(
      'bg-blue-50 border-blue-500 text-blue-900 shadow-md'
    );
  } else {
    baseClasses.push(
      'bg-white border-gray-300 text-gray-900',
      'hover:border-blue-400 hover:bg-blue-25 cursor-pointer'
    );
  }

  if (className) {
    baseClasses.push(className);
  }

  return baseClasses.join(' ');
};

export function ChoiceOption({
  text,
  description,
  onClick,
  disabled = false,
  selected = false,
  className = '',
  ariaLabel,
}: ChoiceOptionProps) {
  const classes = getButtonClasses(disabled, selected, className);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || text}
      className={classes}
    >
      <div className="flex flex-col gap-2">
        <div className="font-medium text-base leading-relaxed">
          {text}
        </div>
        {description && (
          <div className="text-sm text-gray-600 leading-relaxed">
            {description}
          </div>
        )}
      </div>
    </button>
  );
}