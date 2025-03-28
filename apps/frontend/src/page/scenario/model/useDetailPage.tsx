import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { ScenarioData } from '../api/detailLoader';
import {
  addScenarioToStock,
  removeScenarioFromStock,
  isScenarioStockedByUser,
} from '../api/stockScenario';

/**
 * シナリオ詳細ページのロジックを管理するフック
 * @returns シナリオデータとストック操作のための関数
 */
export const useDetailPage = () => {
  const loaderData = useLoaderData<ScenarioData>();
  const uid = useAppSelector(uidSelector);
  const [isStocked, setIsStocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const scenario = {
    id: loaderData.id,
    title: loaderData.title,
    description: loaderData.overview,
    updatedAt: loaderData.updatedAt,
    status: loaderData.visibility as 'private' | 'public',
    tags: [],
    isStockedByGM: isStocked,
    gmCount: 0,
    nodes: [],
    connections: [],
  };

  // 初期ロード時にシナリオのストック状態を確認
  useEffect(() => {
    const checkStockStatus = async () => {
      if (uid == null) {
        setIsLoading(false);
        return;
      }

      try {
        const stocked = await isScenarioStockedByUser(loaderData.id, uid);
        setIsStocked(stocked);
      } catch (error) {
        console.error('ストック状態の確認に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStockStatus();
  }, [loaderData.id, uid]);

  /**
   * シナリオのストック状態をトグルする処理
   * すでにストックされていれば削除、されていなければ追加する
   */
  const handleToggleGMStock = async () => {
    if (uid == null) return;

    try {
      setIsLoading(true);

      if (isStocked) {
        // すでにストックされている場合は削除
        await removeScenarioFromStock(loaderData.id, uid);
        setIsStocked(false);
      } else {
        // ストックされていない場合は追加
        await addScenarioToStock(loaderData.id, uid);
        setIsStocked(true);
      }
    } catch (error) {
      console.error('ストック操作に失敗しました:', error);
      // エラーハンドリング（必要に応じて通知などを表示）
    } finally {
      setIsLoading(false);
    }
  };

  return {
    scenario,
    handleToggleGMStock,
    isStocked,
    isLoading,
  };
};
