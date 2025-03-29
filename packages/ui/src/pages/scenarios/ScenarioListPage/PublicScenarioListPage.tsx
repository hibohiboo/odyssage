import { useState } from 'react';
import { ScenarioCard } from './ScenarioCard';
import { ScenarioTabs, ScenarioTabType } from './ScenarioTabs';
import { Scenario } from './types';

/**
 * 公開シナリオ一覧ページコンポーネント
 * @param scenarios シナリオリスト
 * @param stockedScenarioIds ストック済みシナリオIDリスト
 * @param onToggleStock ストック状態をトグルする関数
 * @param loadingScenarioId 現在ストック処理中のシナリオID
 */
export default function PublicScenarioListPage({
  scenarios,
  onToggleStock,
  loadingScenarioId,
}: {
  readonly scenarios: Scenario[];
  readonly onToggleStock?: (scenarioId: string) => void;
  readonly loadingScenarioId?: string;
}) {
  // タブの状態を管理
  const [activeTab, setActiveTab] = useState<ScenarioTabType>('public');

  // 表示するシナリオをタブに応じてフィルタリング
  const filteredScenarios =
    activeTab === 'public'
      ? scenarios
      : scenarios.filter((scenario) => scenario.isStocked);

  // ページタイトルとサブタイトルをタブに応じて変更
  const pageTitle = activeTab === 'public' ? 'シナリオ一覧' : 'ストック一覧';
  const pageSubtitle =
    activeTab === 'public'
      ? '公開されているシナリオを閲覧できます'
      : 'ストックしたシナリオを管理できます';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
            {pageTitle}
          </h1>
          <p className="text-stone-600">{pageSubtitle}</p>
        </div>
      </div>

      {/* タブ表示 */}
      <ScenarioTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        {filteredScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            editable={false}
            linkPrefix={`/gm/scenario`}
            isStocked={scenario.isStocked}
            onToggleStock={
              onToggleStock ? () => onToggleStock(scenario.id) : undefined
            }
            isStockLoading={loadingScenarioId === scenario.id}
          />
        ))}
        {filteredScenarios.length === 0 && (
          <div className="text-center py-10 text-stone-500">
            {activeTab === 'public'
              ? '公開されているシナリオがありません'
              : 'ストックしたシナリオがありません'}
          </div>
        )}
      </div>
    </div>
  );
}
