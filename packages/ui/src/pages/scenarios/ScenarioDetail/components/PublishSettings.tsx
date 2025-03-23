import { FileEdit, Eye, EyeOff } from 'lucide-react';
import { ReactNode } from 'react';
import { ScenarioStatus } from '../types';

interface PublishSettingsProps {
  status: ScenarioStatus;
  onStatusChange: (status: ScenarioStatus) => void;
}

interface StatusButtonProps {
  currentStatus: ScenarioStatus;
  status: ScenarioStatus;
  icon: ReactNode;
  label: string;
  activeColor: string;
  activeBg: string;
  indicatorColor: string;
  onClick: () => void;
}

const StatusButton = ({
  currentStatus,
  status,
  icon,
  label,
  activeColor,
  activeBg,
  indicatorColor,
  onClick,
}: StatusButtonProps) => {
  const isActive = currentStatus === status;
  const className = isActive
    ? `bg-${activeBg} text-${activeColor} font-medium`
    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50';

  return (
    <button
      onClick={onClick}
      className={`w-full py-2 px-3 rounded-md flex items-center justify-between ${className}`}
    >
      <div className="flex items-center">
        {icon}
        {label}
      </div>
      {isActive && (
        <div className={`w-3 h-3 bg-${indicatorColor} rounded-full`}></div>
      )}
    </button>
  );
};

export const PublishSettings = ({
  status,
  onStatusChange,
}: PublishSettingsProps) => {
  const statusConfigs = [
    {
      status: 'private' as const,
      icon: <FileEdit className="h-4 w-4 mr-2" />,
      label: '作成中',
      activeColor: 'amber-800',
      activeBg: 'amber-100',
      indicatorColor: 'amber-500',
      description: 'シナリオの作成途中です。GMには表示されません。',
    },
    {
      status: 'public' as const,
      icon:
        status === 'public' ? (
          <Eye className="h-4 w-4 mr-2" />
        ) : (
          <EyeOff className="h-4 w-4 mr-2" />
        ),
      label: '公開',
      activeColor: 'green-800',
      activeBg: 'green-100',
      indicatorColor: 'green-500',
      description: 'シナリオはGMに表示され、卓を立てることができます。',
    },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-lg font-serif font-medium text-amber-800 mb-4">
        公開設定
      </h2>

      <div className="space-y-3">
        {statusConfigs.map((config) => (
          <StatusButton
            key={config.status}
            currentStatus={status}
            status={config.status}
            icon={config.icon}
            label={config.label}
            activeColor={config.activeColor}
            activeBg={config.activeBg}
            indicatorColor={config.indicatorColor}
            onClick={() => onStatusChange(config.status)}
          />
        ))}
      </div>

      <div className="mt-4 text-xs text-stone-500">
        {statusConfigs.map((config) => (
          <p
            key={config.status}
            className={config.status !== 'private' ? 'mt-1' : ''}
          >
            <span className="font-medium">{config.label}</span>:
            {config.description}
          </p>
        ))}
      </div>
    </div>
  );
};
