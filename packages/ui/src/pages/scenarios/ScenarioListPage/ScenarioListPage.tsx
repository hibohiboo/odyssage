import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router';
import { ScenarioHeader } from './ScenarioHeader';
import { ScenarioList } from './ScenarioList';
import { Scenario } from './types';

export default function CreatorScenarios({
  scenarios,
}: {
  readonly scenarios: Scenario[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ScenarioHeader>
        <Link to="/creator/scenario/create" className="btn btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          新規シナリオ作成
        </Link>
      </ScenarioHeader>

      <ScenarioList scenarios={scenarios} />
    </div>
  );
}
