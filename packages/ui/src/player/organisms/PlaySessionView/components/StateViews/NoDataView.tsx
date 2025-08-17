interface NoDataViewProps {
  className?: string;
}

export function NoDataView({ className = '' }: NoDataViewProps) {
  return (
    <div className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center p-6">
        <div className="text-gray-600">シーンデータが読み込まれていません</div>
      </div>
    </div>
  );
}