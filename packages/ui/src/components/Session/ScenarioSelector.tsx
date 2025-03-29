import { Link } from 'react-router';

export interface StockedScenarioBase {
  id: string;
  title: string;
  overview?: string;
  stockedAt: string | number | Date;
}

/**
 * シナリオ選択コンポーネント
 * ストックされたシナリオの一覧から1つを選択するための機能を提供
 */
export const ScenarioSelector = <T extends StockedScenarioBase>({
  scenarios,
  selectedId,
  onSelectScenario,
}: {
  scenarios: T[];
  selectedId: string;
  onSelectScenario: (id: string) => void;
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-10 text-stone-500 border border-dashed border-stone-300 rounded-md">
        <p>ストックしたシナリオがありません</p>
        <Link
          to="/gm/scenario/public"
          className="text-amber-700 hover:text-amber-800 mt-2 inline-block"
        >
          シナリオをストックする
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className={`border rounded-md p-4 cursor-pointer transition-colors ${
            selectedId === scenario.id
              ? 'border-amber-500 bg-amber-50'
              : 'border-stone-200 hover:border-amber-300'
          }`}
          onClick={() => onSelectScenario(scenario.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-amber-800">{scenario.title}</h3>
            <div className="flex items-center">
              <input
                type="radio"
                name="scenario"
                value={scenario.id}
                checked={selectedId === scenario.id}
                onChange={() => onSelectScenario(scenario.id)}
                className="h-4 w-4 text-amber-700 border-stone-300 focus:ring-amber-500"
              />
            </div>
          </div>
          {scenario.overview && (
            <p className="text-sm text-stone-600 mt-2 line-clamp-2">
              {scenario.overview}
            </p>
          )}
          <p className="text-xs text-stone-500 mt-2">
            最終更新: {new Date(scenario.stockedAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
