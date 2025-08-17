import { EventButton } from '../../atoms/EventButton';

export interface SessionDetailData {
  sessionId: string;
  title: string;
  scenarioSummary: string;
  overview: string;
  status: 'available' | 'ongoing' | 'completed';
  thumbnailUrl?: string;
  tags?: string[];
  author: {
    name: string;
  };
  createdAt: string;
}

export interface SessionDetailViewProps {
  /** セッション詳細データ */
  session: SessionDetailData;
  /** セッション参加時のハンドラー */
  onJoinSession: (sessionId: string) => void;
  /** 戻るボタンクリック時のハンドラー */
  onBack: () => void;
  /** 読み込み中状態 */
  loading?: boolean;
  /** エラーメッセージ */
  error?: string;
  /** 追加のCSSクラス */
  className?: string;
}

const SESSION_STATUS_CONFIG = {
  available: {
    label: '参加者募集中',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    ctaText: 'このセッションに参加',
    ctaEnabled: true,
    ctaVariant: 'primary' as const,
  },
  ongoing: {
    label: '進行中',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    ctaText: 'このセッションに参加',
    ctaEnabled: true,
    ctaVariant: 'primary' as const,
  },
  completed: {
    label: '完了',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    ctaText: 'このセッションは既に完了しています',
    ctaEnabled: false,
    ctaVariant: 'secondary' as const,
  },
};

const LoadingView = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">セッション詳細を読み込み中...</span>
  </div>
);

const ErrorView = ({ error, onBack }: { error: string; onBack: () => void }) => (
  <div className="text-center py-12">
    <div className="text-red-600 font-medium mb-2">エラーが発生しました</div>
    <div className="text-gray-600 text-sm mb-4">{error}</div>
    <EventButton onClick={onBack} variant="secondary">
      戻る
    </EventButton>
  </div>
);

const HeroSection = ({ session, statusConfig, onJoinSession }: {
  session: SessionDetailData;
  statusConfig: typeof SESSION_STATUS_CONFIG[keyof typeof SESSION_STATUS_CONFIG];
  onJoinSession: (sessionId: string) => void;
}) => (
  <div className="relative">
    {/* 背景画像 */}
    <div className="aspect-video md:aspect-[21/9] relative overflow-hidden rounded-lg">
      {session.thumbnailUrl ? (
        <img
          src={session.thumbnailUrl}
          alt={session.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
      )}
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </div>
    
    {/* ヒーロー情報 */}
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <div className="mb-3">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border`}>
          {statusConfig.label}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">{session.title}</h1>
      <p className="text-lg opacity-90 mb-4 line-clamp-2">{session.scenarioSummary}</p>
      <EventButton
        onClick={() => onJoinSession(session.sessionId)}
        variant={statusConfig.ctaVariant}
        disabled={!statusConfig.ctaEnabled}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3"
      >
        {statusConfig.ctaText}
      </EventButton>
    </div>
  </div>
);

const DetailSection = ({ session }: { session: SessionDetailData }) => (
  <div className="space-y-6">
    {/* シナリオ概要 */}
    <section>
      <h2 className="text-xl font-semibold mb-3">シナリオ概要</h2>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {session.overview}
        </p>
      </div>
    </section>
    
    {/* メタデータ */}
    <section>
      <h2 className="text-xl font-semibold mb-3">詳細情報</h2>
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">作者</span>
          <span className="font-medium">{session.author.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">作成日</span>
          <span className="font-medium">{new Date(session.createdAt).toLocaleDateString('ja-JP')}</span>
        </div>
        {session.tags && session.tags.length > 0 && (
          <div>
            <span className="text-gray-600 block mb-2">タグ</span>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  </div>
);

export function SessionDetailView({
  session,
  onJoinSession,
  onBack,
  loading = false,
  error,
  className = '',
}: SessionDetailViewProps) {
  // ローディング状態
  if (loading) {
    return (
      <div className={`w-full min-h-screen bg-white ${className}`}>
        <LoadingView />
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className={`w-full min-h-screen bg-white ${className}`}>
        <ErrorView error={error} onBack={onBack} />
      </div>
    );
  }

  const statusConfig = SESSION_STATUS_CONFIG[session.status];

  return (
    <div className={`w-full min-h-screen bg-white ${className}`}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <EventButton
            onClick={onBack}
            variant="secondary"
            className="mr-4"
            ariaLabel="戻る"
          >
            ← 戻る
          </EventButton>
          <h1 className="text-lg font-semibold truncate">{session.title}</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pb-8">
        {/* ヒーローセクション */}
        <div className="px-4 py-6">
          <HeroSection
            session={session}
            statusConfig={statusConfig}
            onJoinSession={onJoinSession}
          />
        </div>

        {/* 詳細セクション */}
        <div className="px-4">
          <DetailSection session={session} />
        </div>
      </main>

      {/* 固定CTA（モバイル） */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
        <EventButton
          onClick={() => onJoinSession(session.sessionId)}
          variant={statusConfig.ctaVariant}
          disabled={!statusConfig.ctaEnabled}
          className="w-full"
        >
          {statusConfig.ctaText}
        </EventButton>
      </div>
    </div>
  );
}