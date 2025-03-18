import { Link } from 'react-router';
import { ScenarioHeader } from './ScenarioHeader';
import { ScenarioList } from './ScenarioList';
import { StatusTabs } from './StatusTabs';
import { Scenario } from './types';
import { PlusCircle } from 'lucide-react';

export default function CreatorScenarios({
  scenarios,
}: {
  scenarios: Scenario[];
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <ScenarioHeader>
        <Link to="/creator/create" className="btn btn-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          新規シナリオ作成
        </Link>
      </ScenarioHeader>
      <StatusTabs />
      <ScenarioList scenarios={scenarios} />
    </div>
  );
}
