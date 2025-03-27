import { ScenarioCard } from './ScenarioCard';
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
  stockedScenarioIds = [],
  onToggleStock,
  loadingScenarioId,
}: {
  readonly scenarios: Scenario[];
  readonly stockedScenarioIds?: string[];
  readonly onToggleStock?: (scenarioId: string) => void;
  readonly loadingScenarioId?: string;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
            シナリオ一覧
          </h1>
          <p className="text-stone-600">公開されているシナリオを閲覧できます</p>
        </div>
      </div>
      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            editable={false}
            linkPrefix={`/gm/scenario`}
            isStocked={stockedScenarioIds.includes(scenario.id)}
            onToggleStock={
              onToggleStock ? () => onToggleStock(scenario.id) : undefined
            }
            isStockLoading={loadingScenarioId === scenario.id}
          />
        ))}
        {scenarios.length === 0 && (
          <div className="text-center py-10 text-stone-500">
            公開されているシナリオがありません
          </div>
        )}
      </div>
    </div>
  );
}
