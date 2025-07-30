import { useCallback } from 'react';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { useScenarioCreateMutation } from './useScenarioCreateMutation';

type Props = {
  uid: string;
};

type CreateScenarioData = {
  id: string;
  title: string;
  overview: string;
  visibility?: string;
};

type CreateScenarioResult = {
  message: string;
  id: string;
  title: string;
  overview: string;
  graphSaved: boolean;
};

export const useScenarioWithGraphMutation = (props: Props) => {
  const scenarioMutation = useScenarioCreateMutation({ uid: props.uid });
  
  const createScenario = useCallback(
    async (data: CreateScenarioData): Promise<CreateScenarioResult> => {
      // 1. RDBにシナリオを作成（失敗時は例外をスロー）
      const apiResponse = await scenarioMutation.trigger(data);
      
      // 2. GraphDBにシナリオを保存（失敗しても処理を継続）
      let graphSaved = false;
      try {
        // APIクライアントを直接使用してGraphDBに保存
        const response = await apiClient.api['graph-scenarios'][':id'].$put({
          param: { id: data.id },
          json: {
            title: data.title,
            overview: data.overview,
          },
        });
        
        if (response.ok) {
          graphSaved = true;
        } else {
          console.warn('GraphDB save failed with status:', response.status);
        }
      } catch (graphError) {
        // GraphDBエラーはログに記録するがユーザーには影響させない
        console.warn('GraphDB save failed:', graphError);
        graphSaved = false;
      }

      return {
        message: apiResponse.message,
        id: data.id,
        title: data.title,
        overview: data.overview,
        graphSaved,
      };
    },
    [scenarioMutation],
  );

  return {
    createScenario,
    isLoading: scenarioMutation.isMutating,
    error: scenarioMutation.error,
  };
};