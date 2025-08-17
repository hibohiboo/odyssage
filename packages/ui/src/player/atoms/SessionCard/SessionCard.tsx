
export interface SessionCardProps {
  // セッション基本情報
  sessionId: string;
  title: string;
  scenarioSummary: string;
  
  // セッション状態
  status: 'available' | 'ongoing' | 'completed';
  
  // セッション画像
  thumbnailUrl?: string;
  
  // アクション
  onDetailClick: (sessionId: string) => void;
  onJoinClick: (sessionId: string) => void;
  
  // オプション
  className?: string;
  tags?: string[];
}

const SESSION_STATUS_CONFIG = {
  available: {
    label: '参加募集中',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    joinButtonEnabled: true,
  },
  ongoing: {
    label: '進行中',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    joinButtonEnabled: true,
  },
  completed: {
    label: '完了',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-200',
    joinButtonEnabled: false,
  },
};

const StatusBadge = ({ status }: { status: SessionCardProps['status'] }) => {
  const config = SESSION_STATUS_CONFIG[status];
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
    >
      {config.label}
    </span>
  );
};

const SessionThumbnail = ({ thumbnailUrl, title }: { thumbnailUrl?: string; title: string }) => {
  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={`${title}のサムネイル`}
        className="w-full h-48 object-cover rounded-t-lg"
      />
    );
  }
  
  return (
    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
      <span className="text-white text-lg font-medium">TRPG</span>
    </div>
  );
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)  }...`;
};

export function SessionCard({
  sessionId,
  title,
  scenarioSummary,
  status,
  thumbnailUrl,
  onDetailClick,
  onJoinClick,
  className = '',
  tags = [],
}: SessionCardProps) {
  const statusConfig = SESSION_STATUS_CONFIG[status];
  const isJoinable = statusConfig.joinButtonEnabled;
  
  const handleDetailClick = () => onDetailClick(sessionId);
  const handleJoinClick = () => {
    if (isJoinable) {
      onJoinClick(sessionId);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}>
      {/* サムネイル */}
      <SessionThumbnail thumbnailUrl={thumbnailUrl} title={title} />
      
      {/* カード内容 */}
      <div className="p-4">
        {/* ヘッダー：タイトル・ステータス */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
            {truncateText(title, 50)}
          </h3>
          <StatusBadge status={status} />
        </div>
        
        {/* シナリオ概要 */}
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
          {truncateText(scenarioSummary, 120)}
        </p>
        
        {/* タグ表示 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-400">+{tags.length - 3}</span>
            )}
          </div>
        )}
        
        {/* アクションボタン */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDetailClick}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
          >
            詳細を見る
          </button>
          <button
            type="button"
            onClick={handleJoinClick}
            disabled={!isJoinable}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isJoinable
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            {status === 'completed' ? 'セッション終了' : '参加する'}
          </button>
        </div>
      </div>
    </div>
  );
}