import { ScenarioCard } from './ScenarioCard';
import { Scenario } from './types';

// シナリオリストコンポーネント
export function ScenarioList({
  scenarios,
}: {
  readonly scenarios: Scenario[];
}) {
  return (
    <div className="space-y-6">
      {scenarios.map((scenario) => (
        <ScenarioCard key={scenario.id} scenario={scenario} editable={true} />
      ))}
    </div>
  );
}
