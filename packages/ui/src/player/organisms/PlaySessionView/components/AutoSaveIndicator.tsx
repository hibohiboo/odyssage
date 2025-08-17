import type { AutoSaveStatus } from '../types';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
}

const AUTO_SAVE_CONFIG = {
  saving: { text: '保存中...', color: 'text-yellow-600' },
  saved: { text: '保存完了', color: 'text-green-600' },
  error: { text: '保存エラー', color: 'text-red-600' },
} as const;

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  if (status === 'idle') return null;

  const config = AUTO_SAVE_CONFIG[status as keyof typeof AUTO_SAVE_CONFIG];

  return (
    <div className={`text-xs ${config.color} flex items-center`}>
      {status === 'saving' && (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1" />
      )}
      {config.text}
    </div>
  );
}