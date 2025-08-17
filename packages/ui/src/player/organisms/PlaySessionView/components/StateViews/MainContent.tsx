import { EventDisplay } from '../EventDisplay';
import { PlayHeader } from '../PlayHeader';
import { SceneDisplay } from '../SceneDisplay';
import type { Scene, MVPEvent } from '../../../../engine/EventEngine';
import type { AutoSaveStatus, SessionInfo } from '../../types';

interface MainContentProps {
  currentScene: Scene;
  currentEvent: MVPEvent;
  sessionInfo: SessionInfo;
  autoSaveStatus?: AutoSaveStatus;
  onMenuAccess: () => void;
  onExitSession: () => void;
  onChoiceSelect: (choiceId: string) => void;
  onContinue: () => void;
  className?: string;
}

export function MainContent({
  currentScene,
  currentEvent,
  sessionInfo,
  autoSaveStatus,
  onMenuAccess,
  onExitSession,
  onChoiceSelect,
  onContinue,
  className = '',
}: MainContentProps) {
  return (
    <div className={`w-full min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* ヘッダー */}
      <PlayHeader
        sessionInfo={sessionInfo}
        autoSaveStatus={autoSaveStatus}
        onMenuAccess={onMenuAccess}
        onExitSession={onExitSession}
      />

      {/* メインプレイエリア */}
      <main className="flex-1 max-w-4xl mx-auto w-full">
        {/* シーン表示 */}
        <div className="mb-6">
          <SceneDisplay scene={currentScene} />
        </div>

        {/* Event表示 */}
        <div className="mx-4">
          <EventDisplay
            event={currentEvent}
            onChoiceSelect={onChoiceSelect}
            onContinue={onContinue}
          />
        </div>
      </main>
    </div>
  );
}