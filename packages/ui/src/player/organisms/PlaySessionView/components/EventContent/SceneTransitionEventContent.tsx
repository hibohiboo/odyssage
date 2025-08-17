import type { MVPEvent } from '../../../../engine/EventEngine';

interface SceneTransitionEventContentProps {
  event: MVPEvent;
}

export function SceneTransitionEventContent({ event }: SceneTransitionEventContentProps) {
  return (
    <div className="space-y-4 text-center">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="text-blue-600 font-medium">シーン遷移中...</div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed font-serif">
              {event.content}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}