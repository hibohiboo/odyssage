import { Connection, ScenarioNode } from '../types';

interface FlowchartViewerProps {
  nodes: ScenarioNode[];
  connections: Connection[];
}

export const FlowchartViewer = (_: FlowchartViewerProps) => (
  <div className="card p-6 mb-6">
    <h2 className="text-xl font-serif font-bold text-amber-800 mb-4">
      シナリオフローチャート
    </h2>
    <p className="text-sm text-stone-500 mb-4">
      以下はシナリオのフローチャートです。編集するには「シナリオを編集」ボタンをクリックしてください。
    </p>

    <div className="border border-stone-200 rounded-lg bg-stone-50 h-[500px] relative overflow-hidden"></div>
  </div>
);
