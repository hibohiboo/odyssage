import { LoaderFunctionArgs } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';

/**
 * セッション詳細データの型定義
 */
export interface SessionDetailData {
  id: string;
  gm_id: string;
  scenario_id: string;
  title: string;
  status: '準備中' | '進行中' | '終了';
  created_at: string;
  updated_at: string;
  scenario_title: string;
}

/**
 * セッション詳細情報の読み込みを行うローダー関数
 * GET /api/sessions/:id APIを呼び出し、特定のセッションの詳細データを取得する
 */
export async function sessionDetailLoader(
  args: LoaderFunctionArgs,
): Promise<SessionDetailData | null> {
  const { id } = args.params;
  try {
    if (!id) {
      console.error('Session ID is required');
      return null;
    }

    const response = await apiClient.api.sessions[':id'].$get({
      param: { id },
    });

    if (!response.ok) {
      console.error('Failed to load session details');
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading session details:', error);
    return null;
  }
}
