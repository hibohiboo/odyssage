import { ScenarioCard } from './ScenarioCard';
import { Scenario } from './types';

// シナリオリストコンポーネント
export function ScenarioList({
  scenarios,
  linkPrefix,
}: {
  readonly scenarios: Scenario[];
  readonly linkPrefix: string;
}) {
  return (
    <div className="space-y-6">
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          editable={true}
          linkPrefix={linkPrefix}
        />
      ))}
    </div>
  );
}
