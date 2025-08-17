import { EventContentBase, EventText, ContinueButton } from './common';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface DefaultEventContentProps {
  event: MVPEvent;
  onContinue: () => void;
}

export function DefaultEventContent({ event, onContinue }: DefaultEventContentProps) {
  return (
    <EventContentBase>
      <EventText text={event.content} />
      <ContinueButton onContinue={onContinue} />
    </EventContentBase>
  );
}