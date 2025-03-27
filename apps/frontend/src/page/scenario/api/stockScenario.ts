import { apiClient } from '@odyssage/frontend/shared/api/client';

const { api } = apiClient;

/**
 * シナリオをGMストックに追加する
 * @param scenarioId ストックするシナリオのID
 * @param userId ユーザーID
 * @returns ストック操作の成功可否
 */
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

/**
 * シナリオをGMストックから削除する
 * @param scenarioId 削除するシナリオのID
 * @param userId ユーザーID
 * @returns 削除操作の成功可否
 */
export const removeScenarioFromStock = async (
  scenarioId: string,
  userId: string,
): Promise<boolean> => {
  try {
    // シナリオをストックから削除する処理
    const response = await api.users[':uid']['stocked-scenarios'][
      ':id'
    ].$delete({
      param: { id: scenarioId, uid: userId },
    });

    if (!response.ok) {
      throw new Error('ストック解除に失敗しました');
    }

    return true; // ストック解除成功
  } catch (error) {
    console.error('ストック解除エラー:', error);
    throw error;
  }
};

/**
 * シナリオがユーザーによってストックされているか確認する
 * @param scenarioId 確認するシナリオのID
 * @param userId ユーザーID
 * @returns ストックされている場合はtrue、そうでない場合はfalse
 */
export const isScenarioStockedByUser = async (
  scenarioId: string,
  userId: string,
): Promise<boolean> => {
  try {
    const response = await api.users[':uid']['stocked-scenarios'].$get({
      param: { uid: userId },
    });

    if (!response.ok) {
      throw new Error('ストック状態の取得に失敗しました');
    }

    const stockedScenarios = await response.json();
    return stockedScenarios.some(
      (scenario: { id: string }) => scenario.id === scenarioId,
    );
  } catch (error) {
    console.error('ストック状態確認エラー:', error);
    return false;
  }
};
