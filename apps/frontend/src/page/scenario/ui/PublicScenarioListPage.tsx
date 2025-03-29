import { PublicScenarioListPage as PublicScenarioListPageUI } from '@odyssage/ui/page-ui';
import { usePublicScenarioListPage } from '../model/usePublicScenarioListPage';

/**
 * 公開シナリオ一覧ページ
 * シナリオ一覧の表示およびストック機能を提供する
 */
const PublicScenarioListPage = () => {
  const { scenarios, handleToggleStock, loadingScenarioId, isInitialized } =
    usePublicScenarioListPage();

  if (!isInitialized) {
    return <div className="container mx-auto px-4 py-8">読み込み中...</div>;
  }

  return (
    <PublicScenarioListPageUI
      scenarios={scenarios}
      onToggleStock={handleToggleStock}
      loadingScenarioId={loadingScenarioId}
    />
  );
};

export default PublicScenarioListPage;
