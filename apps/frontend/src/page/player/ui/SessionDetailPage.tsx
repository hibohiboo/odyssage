import { SessionDetailView, type SessionDetailData as UISessionData } from '@odyssage/ui/player/organisms/SessionDetailView/index';
import { useLoaderData, useNavigate } from 'react-router';
import { SessionDetailData } from '../../session/api/sessionDetailLoader';

/**
 * セッションステータスを UIコンポーネント用に変換
 */
function getSessionStatus(status: string): 'available' | 'ongoing' | 'completed' {
  if (status === '準備中') return 'available';
  if (status === '進行中') return 'ongoing';
  return 'completed';
}

/**
 * SessionDetailPage - Player文脈でのセッション詳細表示
 * packages/ui/src/player/organisms/SessionDetailView使用
 * テスト: session-joining.feature対応
 */
export function SessionDetailPage() {
  const sessionData = useLoaderData<SessionDetailData>();
  const navigate = useNavigate();

  // データ取得失敗時の処理
  if (!sessionData) {
    return (
      <SessionDetailView
        session={{} as UISessionData}
        onJoinSession={() => {}}
        onBack={() => navigate('/player/sessions')}
        error="セッションが見つかりません。指定されたセッションは存在しないか、アクセスできません。"
      />
    );
  }

  // APIデータをUIコンポーネント用に変換
  const mapToUISessionData = (): UISessionData => ({
    sessionId: sessionData.id,
    title: sessionData.title,
    scenarioSummary: `${sessionData.scenarioTitle}シナリオをプレイ`,
    overview: `このセッションでは「${sessionData.scenarioTitle}」シナリオをプレイします。\n\nステータス: ${sessionData.status}\n作成日: ${new Date(sessionData.createdAt).toLocaleDateString('ja-JP')}\n最終更新: ${new Date(sessionData.updatedAt).toLocaleDateString('ja-JP')}`,
    status: getSessionStatus(sessionData.status),
    author: {
      name: sessionData.gmId, // 将来的にはGM名を取得
    },
    createdAt: sessionData.createdAt,
    tags: ['TRPG', 'オンラインセッション'],
  });

  // 参加ボタンクリック処理 - Phase 2で参加確認ダイアログを実装予定
  const handleJoinSession = (sessionId: string) => {
    console.log('Join session clicked:', sessionId);
  };

  // 戻るボタン処理
  const handleBack = () => {
    navigate('/player/sessions');
  };

  return (
    <SessionDetailView
      session={mapToUISessionData()}
      onJoinSession={handleJoinSession}
      onBack={handleBack}
    />
  );
}