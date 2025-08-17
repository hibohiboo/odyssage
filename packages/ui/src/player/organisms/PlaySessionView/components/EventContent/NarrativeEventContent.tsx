import { EventButton } from '../../../../atoms/EventButton';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface NarrativeEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function NarrativeEventContent({ event, onContinue }: NarrativeEventContentProps) {
  const narrativeText = event.type === 'narrative' ? event.data.narrativeText : event.content;

  return (
    <div className="space-y-4">
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-800 leading-relaxed font-serif text-lg whitespace-pre-line">
          {narrativeText}
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