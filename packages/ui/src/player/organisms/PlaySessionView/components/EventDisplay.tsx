import {
  ChoiceEventContent,
  NarrativeEventContent,
  DialogueEventContent,
  ExplorationEventContent,
  SceneTransitionEventContent,
  DefaultEventContent,
} from './EventContent';
import type { MVPEvent } from '../../../engine/EventEngine';

interface EventDisplayProps {
  event: MVPEvent;
  onChoiceSelect: (choiceId: string) => void;
  onContinue: () => void;
}

export function EventDisplay({ event, onChoiceSelect, onContinue }: EventDisplayProps) {
  const renderEventContent = () => {
    switch (event.type) {
      case 'choice':
        return <ChoiceEventContent event={event} onChoiceSelect={onChoiceSelect} />;
      case 'narrative':
        return <NarrativeEventContent event={event} onContinue={onContinue} />;
      case 'dialogue':
        return <DialogueEventContent event={event} onContinue={onContinue} />;
      case 'exploration':
        return <ExplorationEventContent event={event} onContinue={onContinue} />;
      case 'scene_transition':
        return <SceneTransitionEventContent event={event} />;
      default:
        return <DefaultEventContent event={event} onContinue={onContinue} />;
    }
  };

  return (
    <div className="p-6 bg-white">
      {event.title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {event.title}
        </h2>
      )}
      {renderEventContent()}
    </div>
  );
}