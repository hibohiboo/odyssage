import { EventContentBase, EventText, ContinueButton } from './common';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface ExplorationEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function ExplorationEventContent({ event, onContinue }: ExplorationEventContentProps) {
  if (event.type !== 'exploration') {
    return null;
  }

  const targetName = event.data.targetName || '探索';

  return (
    <EventContentBase>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-800 mb-2">
          🔍 {targetName}
        </h3>
        <p className="text-amber-700 text-sm">
          探索アクションを実行しています...
        </p>
      </div>
      
      <EventText text={event.content} />
      <ContinueButton onContinue={onContinue} />
    </EventContentBase>
  );
}