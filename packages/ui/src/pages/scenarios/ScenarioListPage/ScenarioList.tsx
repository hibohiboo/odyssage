import { ScenarioCard } from './ScenrioCard';
import { Scenario } from './types';

// シナリオリストコンポーネント
export function ScenarioList({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div className="space-y-6">
      {scenarios.map((scenario) => (
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
}
