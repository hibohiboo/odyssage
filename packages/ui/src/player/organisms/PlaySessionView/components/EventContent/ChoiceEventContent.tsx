import { ChoiceOption } from '../../../../atoms/ChoiceOption';
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
    <div className="space-y-4">
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-800 leading-relaxed font-serif text-lg">
          {event.content}
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">選択肢を選んでください：</h3>
        {event.data.choices.map((choice) => (
          <ChoiceOption
            key={choice.id}
            text={choice.text}
            description={choice.description}
            onClick={() => onChoiceSelect(choice.id)}
          />
        ))}
      </div>
    </div>
  );
}