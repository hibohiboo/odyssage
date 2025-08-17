import { EventButton } from '../../../../atoms/EventButton';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface DialogueEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function DialogueEventContent({ event, onContinue }: DialogueEventContentProps) {
  if (event.type !== 'dialogue') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {event.data.npcName.charAt(0)}
        </div>
        <h3 className="font-medium text-gray-900">{event.data.npcName}</h3>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-800 leading-relaxed font-serif text-lg">
          {event.data.npcText}
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