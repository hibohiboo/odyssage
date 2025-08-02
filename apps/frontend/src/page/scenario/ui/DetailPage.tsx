import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { useGraphScenesQuery, SceneManagement } from '@odyssage/frontend/entities/scenario';
import { useDetailPage } from '../model/useDetailPage';

const DetailPage = ({ backLink }: { backLink: string }) => {
  const { scenario, handleToggleGMStock, isLoading } = useDetailPage();

  // シーンデータをAPIから取得
  const { data: scenes = [], error: scenesError, mutate: refreshScenes } = useGraphScenesQuery({
    scenarioId: scenario.id,
  });

  return (
    <>
      <ScenarioDetailPage
        scenario={scenario}
        backLink={backLink}
        onToggleGMStock={handleToggleGMStock}
        isLoading={isLoading}
      />
      
      {/* シーン管理セクションを追加 */}
      <div className="container mx-auto px-4 mt-8">
        {scenesError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            シーンデータの取得に失敗しました: {scenesError.message}
          </div>
        )}
        <SceneManagement
          scenarioId={scenario.id}
          scenes={scenes}
          onSceneUpdated={() => {
            // シーン更新後にデータを再取得
            refreshScenes();
          }}
        />
      </div>
    </>
  );
};

export default DetailPage;
