import { ClientResponse } from 'hono/client';
import { apiClient } from '@odyssage/frontend/shared/api/client';

/**
 * セッション一覧の読み込みを行う関数
 * GET /api/sessions APIを呼び出しセッションデータを取得する
 */
export async function sessionListLoader() {
  try {
    const response = await apiClient.api.sessions.$get();
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
}

// Honoクライアントのレスポンス型を定義
type APIType = (typeof apiClient.api)['sessions']['$get'];
type SessionResponse = Awaited<ReturnType<APIType>>;
export type SessionListData =
  SessionResponse extends ClientResponse<infer T> ? T : never;
