import { ScenarioNode } from '../types';

interface SceneListProps {
  nodes: ScenarioNode[];
}

export const SceneList = ({ nodes }: SceneListProps) => (
  <div className="card p-6">
    <h2 className="text-xl font-serif font-bold text-amber-800 mb-4">
      シーン一覧
    </h2>

    <div className="space-y-4">
      {nodes.map((node) => (
        <div
          key={node.id}
          className="border border-stone-200 rounded-lg p-4 bg-white"
        >
          <h3 className="font-medium text-lg text-amber-800 mb-2">
            {node.title}
          </h3>
          <p className="text-stone-600 text-sm mb-3 line-clamp-2">
            {node.content}
          </p>

          {node.choices && node.choices.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-1">
                選択肢:
              </h4>
              <ul className="text-sm text-stone-600 space-y-1 pl-5 list-disc">
                {node.choices.map((choice) => (
                  <li key={choice.id}>{choice.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
