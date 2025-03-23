import { Clock } from 'lucide-react';
import { Scenario } from '../types';
import { getStatusStyles } from '../utils';

interface ScenarioHeaderProps {
  scenario: Scenario;
}

export const ScenarioHeader = ({ scenario }: ScenarioHeaderProps) => {
  const statusStyles = getStatusStyles(scenario.status);

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
            {scenario.title}
          </h1>
          <div className="flex items-center mt-2">
            <Clock className="h-4 w-4 text-stone-500 mr-1" />
            <span className="text-sm text-stone-500">
              最終更新: {scenario.updatedAt}
            </span>
          </div>
        </div>

        <div
          className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${statusStyles.bgColor} ${statusStyles.textColor}`}
        >
          {statusStyles.icon}
          {statusStyles.label}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {scenario.tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-stone-600 mb-6 whitespace-pre-line">
        {scenario.description}
      </p>

      {(scenario.difficulty ||
        scenario.estimatedTime ||
        scenario.playerCount) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {scenario.difficulty && (
            <div className="flex flex-col">
              <span className="text-stone-500">難易度</span>
              <span className="font-medium">{scenario.difficulty}</span>
            </div>
          )}
          {scenario.estimatedTime && (
            <div className="flex flex-col">
              <span className="text-stone-500">想定プレイ時間</span>
              <span className="font-medium">{scenario.estimatedTime}</span>
            </div>
          )}
          {scenario.playerCount && (
            <div className="flex flex-col">
              <span className="text-stone-500">推奨プレイヤー数</span>
              <span className="font-medium">{scenario.playerCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
