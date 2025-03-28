import { Scenario } from '../types';
import { ActionButtons } from './ActionButtons';
import { AuthorInfo } from './AuthorInfo';
import { ScenarioStats } from './ScenarioStats';

interface SidebarProps {
  scenario: Scenario;
  onToggleGMStock?: () => void;
  onDeleteClick?: () => void;
  isLoading?: boolean;
}

export const Sidebar = ({
  scenario,
  onToggleGMStock,
  onDeleteClick,
  isLoading = false,
}: SidebarProps) => (
  <div className="lg:col-span-1">
    <ActionButtons
      scenarioId={scenario.id}
      isStockedByGM={scenario.isStockedByGM}
      onToggleGMStock={onToggleGMStock}
      onDeleteClick={onDeleteClick}
      isLoading={isLoading}
    />
    {scenario.author && <AuthorInfo author={scenario.author} />}

    <ScenarioStats scenario={scenario} />
  </div>
);
