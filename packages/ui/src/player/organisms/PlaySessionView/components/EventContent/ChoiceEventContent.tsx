import { ChoiceOption } from '../../../../atoms/ChoiceOption';
import { EventContentBase, EventText } from './common';
import type { MVPEvent } from '../../../../engine/EventEngine';

interface ChoiceEventContentProps {
  event: MVPEvent;
  onChoiceSelect: (choiceId: string) => void;
}

export function ChoiceEventContent({ event, onChoiceSelect }: ChoiceEventContentProps) {
  if (event.type !== 'choice' || !event.data.choices) {
    return null;
  }

  return (
    <EventContentBase>
      <EventText text={event.content} />
      <div data-testid="choice-container" className="space-y-3">
        <h3 data-testid="choice-instruction" className="font-medium text-gray-900">
          選択肢を選んでください：
        </h3>
        {event.data.choices.map((choice, index) => (
          <ChoiceOption
            key={choice.id}
            text={choice.text}
            description={choice.description}
            onClick={() => onChoiceSelect(choice.id)}
            data-testid={`choice-${index + 1}`}
            data-choice-id={choice.id}
          />
        ))}
      </div>
    </EventContentBase>
  );
}