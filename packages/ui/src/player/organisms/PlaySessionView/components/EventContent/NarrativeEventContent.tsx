import { EventContentBase, EventText, ContinueButton } from './common';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface NarrativeEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function NarrativeEventContent({ event, onContinue }: NarrativeEventContentProps) {
  const narrativeText = event.type === 'narrative' ? event.data.narrativeText : event.content;

  return (
    <EventContentBase>
      <EventText text={narrativeText} allowLineBreaks />
      <ContinueButton onContinue={onContinue} />
    </EventContentBase>
  );
}