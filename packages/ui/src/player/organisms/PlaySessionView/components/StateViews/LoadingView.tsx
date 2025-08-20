export function LoadingView() {
  return (
    <div data-testid="loading" className="flex justify-center items-center py-12">
      <div 
        data-testid="loading-spinner"
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" 
      />
      <span data-testid="loading-message" className="ml-3 text-gray-600">
        シーンを読み込み中...
      </span>
    </div>
  );
}