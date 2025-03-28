import { PublicScenarioListPage as PublicScenarioListPageUI } from '@odyssage/ui/page-ui';
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
 * 公開シナリオ一覧ページ
 * シナリオ一覧の表示およびストック機能を提供する
 */
const PublicScenarioListPage = () => {
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

  if (!isInitialized) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  return (
    <PublicScenarioListPageUI
      scenarios={loaderData.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.overview || '',
        updatedAt: s.updatedAt,
        status: 'public',
        usedByGMs: 0,
        tags: [],
      }))}
      stockedScenarioIds={stockedScenarioIds}
      onToggleStock={handleToggleStock}
      loadingScenarioId={loadingScenarioId}
    />
  );
};

export default PublicScenarioListPage;
