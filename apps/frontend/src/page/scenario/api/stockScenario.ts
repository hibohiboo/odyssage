import { apiClient } from '@odyssage/frontend/shared/api/client';

const { api } = apiClient;
// シナリオをGMストックに追加する
export const addScenarioToStock = async (
  scenarioId: string,
  userId: string,
): Promise<boolean> => {
  try {
    // シナリオをストックに追加する処理
    const response = await api.users[':uid']['stocked-scenarios'][':id'].$post({
      param: { id: scenarioId, uid: userId },
    });

    if (!response.ok) {
      throw new Error('ストックに失敗しました');
    }

    return true; // ストック成功
  } catch (error) {
    console.error('ストック操作エラー:', error);
    throw error;
  }
};
