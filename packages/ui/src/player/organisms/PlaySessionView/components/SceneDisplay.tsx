import type { Scene } from '../../../engine/EventEngine';

interface SceneDisplayProps {
  scene: Scene;
}

export function SceneDisplay({ scene }: SceneDisplayProps) {
  return (
    <div className="relative">
      {/* 背景画像 */}
      <div data-testid="scene-background" className="aspect-video relative overflow-hidden">
        {scene.backgroundImage ? (
          <img
            src={scene.backgroundImage}
            alt={scene.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600" />
        )}
        {/* テキスト読みやすさのためのオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* シーンタイトル */}
      <div className="absolute bottom-4 left-4 right-4">
        <h2 data-testid="scene-title" className="text-white text-lg font-semibold shadow-lg">
          {scene.title}
        </h2>
      </div>
    </div>
  );
}