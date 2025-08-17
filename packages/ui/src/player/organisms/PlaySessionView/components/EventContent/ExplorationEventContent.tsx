import { EventButton } from '../../../../atoms/EventButton';
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
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-800 mb-2">
          🔍 {targetName}
        </h3>
        <p className="text-amber-700 text-sm">
          探索アクションを実行しています...
        </p>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-800 leading-relaxed font-serif text-lg">
          {event.content}
        </p>
      </div>
      
      <div className="flex justify-center">
        <EventButton
          onClick={onContinue}
          variant="continue"
          className="px-8 py-3"
        >
          続ける
        </EventButton>
      </div>
    </div>
  );
}