import { EventButton } from '../../../atoms/EventButton';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import type { AutoSaveStatus, SessionInfo } from '../types';

interface PlayHeaderProps {
  sessionInfo: SessionInfo;
  autoSaveStatus?: AutoSaveStatus;
  onMenuAccess: () => void;
  onExitSession: () => void;
}

export function PlayHeader({
  sessionInfo,
  autoSaveStatus = 'idle',
  onMenuAccess,
  onExitSession,
}: PlayHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <EventButton
          onClick={onExitSession}
          variant="secondary"
          className="text-sm px-3 py-1"
          ariaLabel="セッション終了"
        >
          終了
        </EventButton>
        <div>
          <h1 className="font-medium text-sm truncate max-w-[200px]">
            {sessionInfo.title}
          </h1>
          <AutoSaveIndicator status={autoSaveStatus} />
        </div>
      </div>
      <EventButton
        onClick={onMenuAccess}
        variant="secondary"
        className="text-sm px-3 py-1"
        ariaLabel="メニュー"
      >
        ⋯
      </EventButton>
    </header>
  );
}