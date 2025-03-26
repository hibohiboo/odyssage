import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { ScenarioData } from '../api/detailLoader';
import { addScenarioToStock } from '../api/stockScenario';

export const useDetailPage = () => {
  const loaderData = useLoaderData<ScenarioData>();
  const uid = useAppSelector(uidSelector);
  const [isStocked, setIsStocked] = useState(false);
  const scenario = {
    id: loaderData.id,
    title: loaderData.title,
    description: loaderData.overview,
    updatedAt: loaderData.updatedAt,
    status: loaderData.visibility as 'private' | 'public',
    tags: [],
    isStockedByGM: false,
    gmCount: 0,
    nodes: [],
    connections: [],
  };

  // シナリオをストックする処理
  const handleToggleGMStock = async () => {
    if (uid == null) return;
    try {
      // APIを呼び出してシナリオをストック
      await addScenarioToStock(loaderData.id, uid);

      // 状態を更新
      setIsStocked(true);
    } catch (error) {
      console.error('ストック操作に失敗しました:', error);
      // エラーハンドリング（必要に応じて通知などを表示）
    }
  };
  return { scenario, handleToggleGMStock, isStocked };
};
