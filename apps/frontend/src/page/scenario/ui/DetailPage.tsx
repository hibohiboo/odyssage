import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { useDetailPage } from '../model/useDetailPage';

const DetailPage = ({ backLink }: { backLink: string }) => {
  const { scenario, handleToggleGMStock, isLoading } = useDetailPage();

  return (
    <ScenarioDetailPage
      scenario={scenario}
      backLink={backLink}
      onToggleGMStock={handleToggleGMStock}
      isLoading={isLoading}
    />
  );
};

export default DetailPage;
