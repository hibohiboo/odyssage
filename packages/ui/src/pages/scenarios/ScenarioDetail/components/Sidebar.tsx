import { Scenario, ScenarioStatus } from '../types';
import { ActionButtons } from './ActionButtons';
import { AuthorInfo } from './AuthorInfo';
import { PublishSettings } from './PublishSettings';
import { ScenarioStats } from './ScenarioStats';

interface SidebarProps {
  scenario: Scenario;
  onStatusChange: (status: ScenarioStatus) => void;
  onToggleGMStock?: () => void;
  onDeleteClick?: () => void;
}

export const Sidebar = ({
  scenario,
  onStatusChange,
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
    <PublishSettings status={scenario.status} onStatusChange={onStatusChange} />
  </div>
);
