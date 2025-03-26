import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { useDetailPage } from '../model/useDetailPage';

const DetailPage = ({ backLink }: { backLink: string }) => {
  const { scenario, handleToggleGMStock } = useDetailPage();

  return (
    <ScenarioDetailPage
      scenario={scenario}
      backLink={backLink}
      onToggleGMStock={handleToggleGMStock}
    />
  );
};

export default DetailPage;
