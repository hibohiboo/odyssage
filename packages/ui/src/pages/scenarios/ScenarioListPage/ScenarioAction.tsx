import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router';

// シナリオアクションコンポーネント
export function ScenarioActions({
  scenario,
}: {
  readonly scenario: { readonly id: string; readonly status: string };
}) {
  return (
    <div className="bg-stone-50 p-3 flex justify-between">
      <div className="flex gap-2">
        <Link
          to={`/creator/scenario/${scenario.id}`}
          className="text-sm text-amber-700 hover:text-amber-800 font-medium"
        >
          詳細を見る
        </Link>
        <Link
          to={`/creator/scenario/${scenario.id}/edit`}
          className="text-sm text-stone-600 hover:text-stone-800"
        >
          編集する
        </Link>
      </div>
      <div className="flex gap-3">
        {' '}
        <button className="text-sm text-red-600 hover:text-red-800 flex items-center">
          <Trash2 className="h-4 w-4 mr-1" />
          削除
        </button>
      </div>
    </div>
  );
}
