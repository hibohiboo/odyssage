import { Scenario } from '../types';

interface ScenarioStatsProps {
  scenario: Scenario;
}

export const ScenarioStats = ({ scenario }: ScenarioStatsProps) => (
  <div className="card p-6 mb-6">
    <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
      シナリオ情報
    </h2>

    <div className="space-y-4 text-sm">
      {scenario.createdAt && (
        <div className="flex justify-between">
          <span className="text-stone-500">作成日</span>
          <span className="font-medium">{scenario.createdAt}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-stone-500">最終更新日</span>
        <span className="font-medium">{scenario.updatedAt}</span>
      </div>

      {scenario.nodes.length > 0 && (
        <>
          <div className="flex justify-between">
            <span className="text-stone-500">シーン数</span>
            <span className="font-medium">{scenario.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">選択肢の総数</span>
            <span className="font-medium">
              {scenario.nodes.reduce(
                (total, node) => total + (node.choices?.length || 0),
                0,
              )}
            </span>
          </div>
        </>
      )}

      {scenario.gmCount > 0 && (
        <div className="flex justify-between">
          <span className="text-stone-500">使用中のGM</span>
          <span className="font-medium">{scenario.gmCount}人</span>
        </div>
      )}
    </div>
  </div>
);
