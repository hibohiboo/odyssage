import { ChoiceOption } from '../../atoms/ChoiceOption';
import { EventButton } from '../../atoms/EventButton';
import { type UseEventEngineProps } from '../../hooks/useEventEngine';
import type { Scene, MVPEvent } from '../../engine/EventEngine';

// PlaySessionView用のProps型
export interface PlaySessionConfig {
  /** Event処理エンジン設定 */
  eventEngine: UseEventEngineProps;
  /** セッション表示情報 */
  sessionInfo: {
    sessionId: string;
    title: string;
    description?: string;
  };
}

export interface PlaySessionViewProps {
  /** PlaySession設定 */
  config: PlaySessionConfig;
  /** メニューアクセス時のハンドラー */
  onMenuAccess: () => void;
  /** セッション終了時のハンドラー */
  onExitSession: () => void;
  /** 追加のCSSクラス */
  className?: string;
}

const AutoSaveIndicator = ({
  status,
}: {
  status: 'idle' | 'saving' | 'saved' | 'error';
}) => {
  if (status === 'idle') return null;

  const statusConfig = {
    saving: { text: '保存中...', color: 'text-yellow-600' },
    saved: { text: '保存完了', color: 'text-green-600' },
    error: { text: '保存エラー', color: 'text-red-600' },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className={`text-xs ${config.color} flex items-center`}>
      {status === 'saving' && (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
      )}
      {config.text}
    </div>
  );
};

const PlayHeader = ({
  sessionInfo,
  autoSaveStatus,
  onMenuAccess,
  onExitSession,
}: {
  sessionInfo: { sessionId: string; title: string; description?: string };
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  onMenuAccess: () => void;
  onExitSession: () => void;
}) => (
  <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <EventButton
        onClick={onExitSession}
        variant="secondary"
        className="text-sm px-3 py-1"
        ariaLabel="セッション終了"
      >
        終了
      </EventButton>
      <div>
        <h1 className="font-medium text-sm truncate max-w-[200px]">
          {sessionInfo.title}
        </h1>
        <AutoSaveIndicator status={autoSaveStatus} />
      </div>
    </div>
    <EventButton
      onClick={onMenuAccess}
      variant="secondary"
      className="text-sm px-3 py-1"
      ariaLabel="メニュー"
    >
      ⋯
    </EventButton>
  </header>
);

const SceneDisplay = ({ scene }: { scene: Scene }) => (
  <div className="relative">
    {/* 背景画像 */}
    <div className="aspect-video relative overflow-hidden">
      {scene.backgroundImage ? (
        <img
          src={scene.backgroundImage}
          alt={scene.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600"></div>
      )}
      {/* テキスト読みやすさのためのオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
    </div>

    {/* シーンタイトル */}
    <div className="absolute bottom-4 left-4 right-4">
      <h2 className="text-white text-lg font-semibold shadow-lg">
        {scene.title}
      </h2>
    </div>
  </div>
);

const ChoiceEventContent = ({
  event,
  onChoiceSelect,
}: {
  event: MVPEvent;
  onChoiceSelect: (choiceId: string) => void;
}) => (
  <div className="space-y-4">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-800 leading-relaxed font-serif text-lg">
        {event.content}
      </p>
    </div>
    {event.type === 'choice' && event.data.choices && (
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">選択肢を選んでください：</h3>
        {event.data.choices.map((choice) => (
          <ChoiceOption
            key={choice.id}
            text={choice.text}
            description={choice.description}
            onClick={() => onChoiceSelect(choice.id)}
          />
        ))}
      </div>
    )}
  </div>
);

const NarrativeEventContent = ({
  event,
  onContinue,
}: {
  event: MVPEvent;
  onContinue: () => void;
}) => (
  <div className="space-y-4">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-800 leading-relaxed font-serif text-lg whitespace-pre-line">
        {event.type === 'narrative' ? event.data.narrativeText : event.content}
      </p>
    </div>
    <div className="flex justify-center">
      <EventButton
        onClick={onContinue}
        variant="continue"
        className="px-8 py-3"
      >
        続ける
      </EventButton>
    </div>
  </div>
);

const DialogueEventContent = ({
  event,
  onContinue,
}: {
  event: MVPEvent;
  onContinue: () => void;
}) => (
  <div className="space-y-4">
    {event.type === 'dialogue' && (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {event.data.npcName.charAt(0)}
        </div>
        <h3 className="font-medium text-gray-900">{event.data.npcName}</h3>
      </div>
    )}
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-800 leading-relaxed font-serif text-lg">
        {event.type === 'dialogue' ? event.data.npcText : event.content}
      </p>
    </div>
    <div className="flex justify-center">
      <EventButton
        onClick={onContinue}
        variant="continue"
        className="px-8 py-3"
      >
        続ける
      </EventButton>
    </div>
  </div>
);

const ExplorationEventContent = ({
  event,
  onContinue,
}: {
  event: EventData;
  onContinue: () => void;
}) => (
  <div className="space-y-4">
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h3 className="font-medium text-amber-800 mb-2">
        🔍 {event.targetName || '探索'}
      </h3>
      <p className="text-amber-700 text-sm">
        探索アクションを実行しています...
      </p>
    </div>
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-800 leading-relaxed font-serif text-lg">
        {event.content}
      </p>
    </div>
    <div className="flex justify-center">
      <EventButton
        onClick={onContinue}
        variant="continue"
        className="px-8 py-3"
      >
        続ける
      </EventButton>
    </div>
  </div>
);

const SceneTransitionEventContent = ({ event }: { event: EventData }) => (
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  </div>
);

const DefaultEventContent = ({
  event,
  onContinue,
}: {
  event: EventData;
  onContinue: () => void;
}) => (
  <div className="space-y-4">
    <div className="prose prose-gray max-w-none">
      <p className="text-gray-800 leading-relaxed font-serif text-lg">
        {event.content}
      </p>
    </div>
    <div className="flex justify-center">
      <EventButton
        onClick={onContinue}
        variant="continue"
        className="px-8 py-3"
      >
        続ける
      </EventButton>
    </div>
  </div>
);

const EventDisplay = ({
  event,
  onChoiceSelect,
  onContinue,
}: {
  event: EventData;
  onChoiceSelect: (choiceId: string) => void;
  onContinue: () => void;
}) => {
  const renderEventContent = () => {
    switch (event.type) {
      case 'choice':
        return (
          <ChoiceEventContent event={event} onChoiceSelect={onChoiceSelect} />
        );
      case 'narrative':
        return <NarrativeEventContent event={event} onContinue={onContinue} />;
      case 'dialogue':
        return <DialogueEventContent event={event} onContinue={onContinue} />;
      case 'exploration':
        return (
          <ExplorationEventContent event={event} onContinue={onContinue} />
        );
      case 'scene_transition':
        return <SceneTransitionEventContent event={event} />;
      default:
        return <DefaultEventContent event={event} onContinue={onContinue} />;
    }
  };

  return (
    <div className="p-6 bg-white">
      {event.title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          {event.title}
        </h2>
      )}
      {renderEventContent()}
    </div>
  );
};

const LoadingView = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">シーンを読み込み中...</span>
  </div>
);

// エラー表示用コンポーネント
const ErrorView = ({
  error,
  className,
}: {
  error: string;
  className: string;
}) => (
  <div
    className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}
  >
    <div className="text-center p-6">
      <div className="text-red-600 text-lg font-medium mb-2">
        エラーが発生しました
      </div>
      <div className="text-gray-600 mb-4">{error}</div>
      <EventButton onClick={() => window.location.reload()} variant="primary">
        再読み込み
      </EventButton>
    </div>
  </div>
);

// データなし表示用コンポーネント
const NoDataView = ({ className }: { className: string }) => (
  <div
    className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}
  >
    <div className="text-center p-6">
      <div className="text-gray-600">シーンデータが読み込まれていません</div>
    </div>
  </div>
);

// メインコンテンツ表示用コンポーネント
const MainContent = ({
  currentScene,
  currentEvent,
  sessionInfo,
  autoSaveStatus,
  onMenuAccess,
  onExitSession,
  onChoiceSelect,
  onContinue,
  className,
}: {
  currentScene: Scene;
  currentEvent: MVPEvent;
  sessionInfo: PlaySessionViewProps['sessionInfo'];
  autoSaveStatus: PlaySessionViewProps['autoSaveStatus'];
  onMenuAccess: () => void;
  onExitSession: () => void;
  onChoiceSelect: (choiceId: string) => void;
  onContinue: () => void;
  className: string;
}) => (
  <div className={`w-full min-h-screen bg-gray-50 flex flex-col ${className}`}>
    {/* ヘッダー */}
    <PlayHeader
      sessionInfo={sessionInfo}
      autoSaveStatus={autoSaveStatus}
      onMenuAccess={onMenuAccess}
      onExitSession={onExitSession}
    />

    {/* メインプレイエリア */}
    <main className="flex-1 max-w-4xl mx-auto w-full">
      {/* シーン表示 */}
      <div className="mb-6">
        <SceneDisplay scene={currentScene} />
      </div>

      {/* Event表示 */}
      <div className="mx-4">
        <EventDisplay
          event={currentEvent}
          onChoiceSelect={onChoiceSelect}
          onContinue={onContinue}
        />
      </div>
    </main>
  </div>
);

// 読み込み中表示
const renderLoadingState = (className?: string) => (
  <div className={`w-full min-h-screen bg-gray-50 ${className || ''}`}>
    <LoadingView />
  </div>
);

// 正常表示状態
const renderNormalState = (props: PlaySessionViewProps) => (
  <MainContent
    currentScene={props.currentScene!}
    currentEvent={props.currentEvent!}
    sessionInfo={props.sessionInfo}
    autoSaveStatus={props.autoSaveStatus}
    onMenuAccess={props.onMenuAccess}
    onExitSession={props.onExitSession}
    onChoiceSelect={props.onChoiceSelect}
    onContinue={props.onContinue}
    className={props.className || ''}
  />
);

// 表示状態判定・レンダリング選択
function renderViewByState(props: PlaySessionViewProps) {
  if (props.loading) {
    return renderLoadingState(props.className);
  }

  if (props.error) {
    return <ErrorView error={props.error} className={props.className || ''} />;
  }

  if (!props.currentScene || !props.currentEvent) {
    return <NoDataView className={props.className || ''} />;
  }

  return renderNormalState(props);
}

export function PlaySessionView(props: PlaySessionViewProps) {
  return renderViewByState(props);
}
