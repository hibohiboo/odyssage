import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { SceneManagement } from '@odyssage/frontend/entities/scenario/components/SceneManagement';
import { useDetailPage } from '../model/useDetailPage';

const DetailPage = ({ backLink }: { backLink: string }) => {
  const { scenario, handleToggleGMStock, isLoading } = useDetailPage();

  // モックのシーンデータ（後でAPIから取得）
  const mockScenes = [];

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
        <SceneManagement
          scenarioId={scenario.id}
          scenes={mockScenes}
          onSceneUpdated={() => {
            // シーン更新後の処理（後で実装）
            console.log('Scene updated, refresh scene list');
          }}
        />
      </div>
    </>
  );
};

export default DetailPage;
