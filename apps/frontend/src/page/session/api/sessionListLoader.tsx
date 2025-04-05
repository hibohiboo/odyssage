import { ClientResponse } from 'hono/client';
import { store } from '@odyssage/frontend/app/store';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';

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

/**
 * GMのセッション一覧の読み込みを行う関数
 * GET /api/sessions?gm_id=xxx APIを呼び出し、ログインユーザーが作成したセッションデータのみを取得する
 */
export async function gmSessionListLoader() {
  try {
    // Reduxストアから現在のユーザーIDを取得
    const uid = uidSelector(store.getState());

    if (!uid) {
      console.error('User not logged in');
      return [];
    }

    // ログインユーザーIDをGM IDとして使用してセッション一覧を取得
    const response = await apiClient.api.sessions.$get({
      query: { gm_id: uid },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading GM sessions:', error);
    return [];
  }
}

// Honoクライアントのレスポンス型を定義
type APIType = (typeof apiClient.api)['sessions']['$get'];
type SessionResponse = Awaited<ReturnType<APIType>>;
export type SessionListData =
  SessionResponse extends ClientResponse<infer T> ? T : never;
