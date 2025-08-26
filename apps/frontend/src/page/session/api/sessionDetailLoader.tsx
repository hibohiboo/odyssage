import { LoaderFunctionArgs } from 'react-router';
import { SessionDataService, SessionData } from '@odyssage/frontend/page/player/services/SessionDataService';

/**
 * セッション詳細データの型定義（レガシー互換性のため維持）
 */
export interface SessionDetailData {
  id: string;
  gmId: string;
  scenarioId: string;
  title: string;
  status: '準備中' | '進行中' | '終了';
  createdAt: string;
  updatedAt: string;
  scenarioTitle: string;
}

/**
 * SessionData を SessionDetailData に変換
 * PlaySessionContainer との一貫性を保ちつつレガシー互換性を維持
 */
function mapToSessionDetailData(sessionData: SessionData): SessionDetailData {
  // status のマッピング
  const statusMapping: Record<SessionData['status'], SessionDetailData['status']> = {
    available: '準備中',
    ongoing: '進行中',
    completed: '終了',
  };

  return {
    id: sessionData.id,
    gmId: sessionData.author.name,
    scenarioId: sessionData.scenarioId,
    title: sessionData.title,
    status: statusMapping[sessionData.status],
    createdAt: sessionData.createdAt,
    updatedAt: sessionData.createdAt, // モックデータでは createdAt と同じ値を使用
    scenarioTitle: sessionData.scenarioTitle,
  };
}

/**
 * セッション詳細情報の読み込みを行うローダー関数
 * PlaySessionContainer と同じモックデータアプローチを使用
 * MVP制約: バックエンドAPI呼び出しなし、LocalStorage + モックデータベース
 */
export async function sessionDetailLoader(
  args: LoaderFunctionArgs,
): Promise<SessionDetailData | null> {
  const { id, sessionId } = args.params;
  
  // sessionId パラメータも対応（player ルート用）
  const targetId = sessionId || id;
  
  try {
    if (!targetId) {
      console.error('Session ID is required');
      return null;
    }

    const sessionDataService = new SessionDataService();
    const sessionData = await sessionDataService.loadSessionData(targetId);
    
    if (!sessionData) {
      console.error('Session not found:', targetId);
      return null;
    }

    return mapToSessionDetailData(sessionData);
  } catch (error) {
    console.error('Error loading session details:', error);
    return null;
  }
}
