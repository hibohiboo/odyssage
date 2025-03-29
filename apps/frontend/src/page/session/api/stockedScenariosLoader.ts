// filepath: d:\projects\odyssage\apps\frontend\src\page\session\api\stockedScenariosLoader.ts
import type { LoaderFunctionArgs } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { getIdToken } from '@odyssage/frontend/shared/lib/auth/firebaseAuth';

export interface StockedScenario {
  id: string;
  title: string;
  overview?: string;
  updatedAt: string;
}

/**
 * GMがストックしているシナリオ一覧を取得するローダー関数
 * @param param0 ローダー引数
 * @returns ストックしているシナリオのリスト
 */
export async function stockedScenariosLoader({ params }: LoaderFunctionArgs) {
  try {
    // 認証が必要なため、IDトークンを取得
    await getIdToken();

    const { uid } = params;
    if (!uid) {
      throw new Error('ユーザーIDが見つかりません');
    }

    const response = await apiClient.api.users[':uid'][
      'stocked-scenarios'
    ].$get({
      param: { uid },
    });

    if (!response.ok) {
      throw new Error('ストックシナリオの取得に失敗しました');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ストックシナリオ取得エラー:', error);
    return [];
  }
}
