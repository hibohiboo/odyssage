import React from 'react';

/**
 * セッションの状態バッジを表示するコンポーネント
 */
interface StatusBadgeProps {
  statusClassName: string;
  displayName: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ statusClassName, displayName }) => (
  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusClassName}`}>
    {displayName}
  </div>
);

/**
 * 進行状況を表示するコンポーネント
 */
interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1">
      <span>進行状況</span>
      <span>{progress}%</span>
    </div>
    <div className="w-full bg-stone-200 rounded-full h-2">
      <div
        className="bg-amber-600 h-2 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

/**
 * 現在の状況を表示するコンポーネント
 */
interface CurrentSceneProps {
  scene: string;
}

export const CurrentScene: React.FC<CurrentSceneProps> = ({ scene }) => (
  <div className="p-3 bg-stone-50 rounded-md mb-3">
    <h4 className="text-sm font-medium mb-1">現在の状況:</h4>
    <p className="text-sm text-stone-600">{scene}</p>
  </div>
);

/**
 * 未読メッセージの数を表示するコンポーネント
 */
interface UnreadBadgeProps {
  count: number;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count <= 0) {
    return null;
  }
  
  return (
    <span className="ml-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
      {count}
    </span>
  );
};

/**
 * アクションボタンのコンポーネント
 */
interface ActionButtonProps {
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, className, children }) => (
  <button
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
);