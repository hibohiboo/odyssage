import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { PublicScenarioListData } from '../api/publicScenarioListLoader';
import {
  addScenarioToStock,
  removeScenarioFromStock,
} from '../api/stockScenario';

/**
 * 公開シナリオ一覧ページのロジックを管理するカスタムフック
 * シナリオ一覧データの状態管理およびストック操作機能を提供する
 * @returns シナリオデータとストック操作に関連する状態と関数
 */
export const usePublicScenarioListPage = () => {
  const loaderData = useLoaderData<PublicScenarioListData>();
  const uid = useAppSelector(uidSelector);
  const [stockedScenarioIds, setStockedScenarioIds] = useState<string[]>([]);
  const [loadingScenarioId, setLoadingScenarioId] = useState<
    string | undefined
  >(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期ロード時にストック済みシナリオを取得
  useEffect(() => {
    const fetchStockedScenarios = async () => {
      if (!uid) {
        setIsInitialized(true);
        return;
      }

      try {
        const response = await fetch(`/api/users/${uid}/stocked-scenarios`);
        if (response.ok) {
          const data = await response.json();
          setStockedScenarioIds(
            data.map((scenario: { id: string }) => scenario.id),
          );
        }
      } catch (error) {
        console.error('ストックシナリオの取得に失敗:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchStockedScenarios();
  }, [uid]);

  /**
   * シナリオのストック状態をトグルする
   * @param scenarioId 操作対象のシナリオID
   */
  const handleToggleStock = async (scenarioId: string) => {
    if (!uid) return;

    setLoadingScenarioId(scenarioId);

    try {
      const isStocked = stockedScenarioIds.includes(scenarioId);

      if (isStocked) {
        // ストック解除
        await removeScenarioFromStock(scenarioId, uid);
        setStockedScenarioIds((prev) => prev.filter((id) => id !== scenarioId));
      } else {
        // ストック追加
        await addScenarioToStock(scenarioId, uid);
        setStockedScenarioIds((prev) => [...prev, scenarioId]);
      }
    } catch (error) {
      console.error('ストック操作に失敗:', error);
    } finally {
      setLoadingScenarioId(undefined);
    }
  };

  // 表示用のシナリオデータを生成
  const scenarios = loaderData.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.overview || '',
    updatedAt: s.updatedAt,
    status: 'public' as const,
    usedByGMs: 0,
    tags: [],
    isStocked: stockedScenarioIds.includes(s.id),
  }));

  return {
    scenarios,
    handleToggleStock,
    loadingScenarioId,
    isInitialized,
  };
};
