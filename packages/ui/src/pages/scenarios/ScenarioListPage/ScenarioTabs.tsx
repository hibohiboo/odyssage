import React from 'react';

interface TabButtonProps {
  readonly children: React.ReactNode;
  readonly active?: boolean;
  readonly onClick?: () => void;
  readonly name?: string;
}

/**
 * タブボタンコンポーネント
 * @param children 子要素
 * @param active アクティブ状態
 * @param onClick クリックハンドラー
 * @param name タブ名（ARIA用）
 */
function TabButton({
  children,
  active = false,
  onClick,
  name,
}: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={active}
      name={name}
      className={`px-4 py-2 border-b-2 ${
        active
          ? 'border-amber-700 text-amber-800 font-medium'
          : 'border-transparent text-stone-600 hover:text-amber-700'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export type ScenarioTabType = 'public' | 'stocked';

interface ScenarioTabsProps {
  readonly activeTab: ScenarioTabType;
  readonly onTabChange: (tab: ScenarioTabType) => void;
}

/**
 * シナリオタブコンポーネント
 * 公開シナリオ一覧とストック一覧を切り替えるタブを提供する
 * @param activeTab 現在のアクティブタブ
 * @param onTabChange タブ変更時のコールバック
 */
export function ScenarioTabs({ activeTab, onTabChange }: ScenarioTabsProps) {
  return (
    <div role="tablist" className="flex border-b border-stone-200 mb-6">
      <TabButton
        active={activeTab === 'public'}
        onClick={() => onTabChange('public')}
        name="公開シナリオ"
      >
        公開シナリオ
      </TabButton>
      <TabButton
        active={activeTab === 'stocked'}
        onClick={() => onTabChange('stocked')}
        name="ストック一覧"
      >
        ストック一覧
      </TabButton>
    </div>
  );
}
