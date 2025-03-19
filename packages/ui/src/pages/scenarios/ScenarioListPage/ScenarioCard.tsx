import { Clock } from 'lucide-react';
import { ScenarioActions } from './ScenarioAction';
import { Scenario } from './types';

interface ScenarioActionsProps {
  readonly scenario: Scenario;
}

// ステータスに応じたクラス名を取得
const getStatusClassName = (status: string): string => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-stone-100 text-stone-800';
  }
};

// ステータスに応じたテキストを取得
const getStatusText = (status: string): string => {
  switch (status) {
    case 'published':
      return '公開中';
    case 'draft':
      return '下書き';
    default:
      return '非公開';
  }
};

// シナリオカードコンポーネント
export function ScenarioCard({ scenario }: ScenarioActionsProps) {
  const statusClassName = getStatusClassName(scenario.status);
  const statusText = getStatusText(scenario.status);

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-serif font-bold text-amber-800">
            {scenario.title}
          </h3>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusClassName}`}
          >
            {statusText}
          </div>
        </div>

        <p className="text-stone-600 text-sm line-clamp-2 mb-3">
          {scenario.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {scenario.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <div>更新: {scenario.updatedAt}</div>
            </div>
          </div>
          {scenario.status === 'published' && scenario.usedByGMs > 0 && (
            <div className="flex items-center">
              <span>{scenario.usedByGMs}人のGMが使用中</span>
            </div>
          )}
        </div>
      </div>

      <ScenarioActions scenario={scenario} />
    </div>
  );
}
