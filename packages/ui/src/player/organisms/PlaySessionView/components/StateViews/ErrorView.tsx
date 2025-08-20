import { EventButton } from '../../../../atoms/EventButton';

interface ErrorViewProps {
  error: string;
  className?: string;
}

export function ErrorView({ error, className = '' }: ErrorViewProps) {
  return (
    <div 
      data-testid="error-container"
      className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}
    >
      <div className="text-center p-6">
        <div data-testid="error-title" className="text-red-600 text-lg font-medium mb-2">
          エラーが発生しました
        </div>
        <div data-testid="error-message" className="text-gray-600 mb-4">{error}</div>
        <EventButton 
          onClick={() => window.location.reload()} 
          variant="primary"
          data-testid="reload-button"
        >
          再読み込み
        </EventButton>
      </div>
    </div>
  );
}