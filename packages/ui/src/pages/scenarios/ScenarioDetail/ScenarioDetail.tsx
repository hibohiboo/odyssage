'use client';

import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { FlowchartViewer } from './components/FlowchartViewer';
import { ScenarioHeader } from './components/ScenarioHeader';
import { SceneList } from './components/SceneList';
import { Sidebar } from './components/Sidebar';
import { Scenario } from './types';

// シナリオに関するProps
interface ScenarioDetailPageProps {
  readonly scenario: Scenario;
  readonly backLink: string;
  readonly onToggleGMStock?: () => void;
  readonly isLoading?: boolean;
}

// 純粋な表示用コンポーネント
export function ScenarioDetailPage({
  scenario,
  backLink,
  onToggleGMStock,
  isLoading = false,
}: ScenarioDetailPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 戻るリンク */}
      <Link
        to={backLink}
        className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        シナリオ一覧に戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2">
          <ScenarioHeader scenario={scenario} />
          <FlowchartViewer
            nodes={scenario.nodes}
            connections={scenario.connections}
          />
          <SceneList nodes={scenario.nodes} />
        </div>

        {/* サイドバー */}
        <Sidebar
          scenario={scenario}
          onToggleGMStock={onToggleGMStock}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
