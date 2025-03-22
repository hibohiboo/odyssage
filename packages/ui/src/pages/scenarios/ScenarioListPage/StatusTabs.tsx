function TabButton({
  children,
  active = false,
}: {
  readonly children: React.ReactNode;
  readonly active?: boolean;
  readonly onTabChange?: (tab: string) => void;
}) {
  if (active) {
    return (
      <button className="px-4 py-2 border-b-2 border-amber-700 text-amber-800 font-medium">
        {children}
      </button>
    );
  }
  return (
    <button className="px-4 py-2 border-b-2 border-transparent text-stone-600 hover:text-amber-700">
      {children}
    </button>
  );
}

// ステータスタブコンポーネント
export function StatusTabs() {
  return (
    <div className="flex border-b border-stone-200 mb-6">
      <TabButton active={true}>公開中</TabButton>
      <TabButton>非公開</TabButton>
      <TabButton>下書き</TabButton>
    </div>
  );
}
