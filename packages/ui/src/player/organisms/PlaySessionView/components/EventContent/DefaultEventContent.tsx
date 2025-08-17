import { EventButton } from '../../../../atoms/EventButton';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface DefaultEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function DefaultEventContent({ event, onContinue }: DefaultEventContentProps) {
  return (
    <div className="space-y-4">
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