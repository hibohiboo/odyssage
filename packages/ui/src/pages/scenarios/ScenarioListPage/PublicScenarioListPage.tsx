import { ScenarioCard } from './ScenarioCard';
import { Scenario } from './types';

export default function PublicScenarioListPage({
  scenarios,
}: {
  readonly scenarios: Scenario[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            editable={false}
            linkPrefix={`/gm/scenario`}
          />
        ))}
      </div>
    </div>
  );
}
