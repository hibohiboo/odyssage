import { ReactNode } from 'react';

interface EventContentBaseProps {
  children: ReactNode;
}

/**
 * Event表示の基本レイアウトコンポーネント
 * 全EventContentの共通構造を提供
 */
export function EventContentBase({ children }: EventContentBaseProps) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}