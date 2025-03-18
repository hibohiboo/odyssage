// ヘッダーコンポーネント
export const ScenarioHeader: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-800">
          シナリオ管理
        </h1>
        <p className="text-stone-600">
          作成したシナリオを管理・編集・公開できます
        </p>
      </div>
      {children}
    </div>
  );
};
