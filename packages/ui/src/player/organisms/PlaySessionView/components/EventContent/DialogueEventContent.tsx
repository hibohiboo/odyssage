import { EventContentBase, EventText, ContinueButton } from './common';
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
    <EventContentBase>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {event.data.npcName.charAt(0)}
        </div>
        <h3 className="font-medium text-gray-900">{event.data.npcName}</h3>
      </div>
      
      <EventText text={event.data.npcText} />
      <ContinueButton onContinue={onContinue} />
    </EventContentBase>
  );
}