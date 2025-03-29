// filepath: d:\projects\odyssage\apps\frontend\src\entities\session\api\createSession.ts
import { apiClient } from '@odyssage/frontend/shared/api/client';

/**
 * セッションを作成するためのAPI関数
 * @param gmId GMのID
 * @param scenarioId シナリオID
 * @param title セッションのタイトル
 * @returns 作成されたセッションの情報
 */
export async function createSession(
  gmId: string,
  scenarioId: string,
  title: string,
) {
  try {
    const response = await apiClient.api.sessions.$post({
      json: {
        gm_id: gmId,
        scenario_id: scenarioId,
        title,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'セッションの作成に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('セッション作成エラー:', error);
    throw error;
  }
}
