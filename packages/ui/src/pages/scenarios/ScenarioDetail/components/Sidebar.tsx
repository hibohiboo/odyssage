import { Scenario, ScenarioStatus } from '../types';
import { ActionButtons } from './ActionButtons';
import { AuthorInfo } from './AuthorInfo';
import { ScenarioStats } from './ScenarioStats';

interface SidebarProps {
  scenario: Scenario;
  onStatusChange?: (status: ScenarioStatus) => void;
  onToggleGMStock?: () => void;
  onDeleteClick?: () => void;
}

export const Sidebar = ({
  scenario,
  onToggleGMStock,
  onDeleteClick,
}: SidebarProps) => (
  <div className="lg:col-span-1">
    <ActionButtons
      scenarioId={scenario.id}
      isStockedByGM={scenario.isStockedByGM}
      onToggleGMStock={onToggleGMStock}
      onDeleteClick={onDeleteClick}
    />
    {scenario.author && <AuthorInfo author={scenario.author} />}

    <ScenarioStats scenario={scenario} />
  </div>
);
