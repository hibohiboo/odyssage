import type { Scene, MVPEvent } from '../../engine/EventEngine';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface PlaySessionViewProps {
  currentScene: Scene | null;
  currentEvent: MVPEvent | null;
  sessionInfo: {
    sessionId: string;
    title: string;
    description?: string;
  };
  onChoiceSelect: (choiceId: string) => void;
  onContinue: () => void;
  onMenuAccess: () => void;
  onExitSession: () => void;
  loading?: boolean;
  autoSaveStatus?: AutoSaveStatus;
  error?: string | null;
  className?: string;
}

export interface SessionInfo {
  sessionId: string;
  title: string;
  description?: string;
}