import { ScenarioDetailPage } from '@odyssage/ui/page-ui';
import { useDetailPage } from '../model/useDetailPage';

const DetailPage = ({ backLink }: { backLink: string }) => {
  const scenario = useDetailPage();

  return <ScenarioDetailPage scenario={scenario} backLink={backLink} />;
};

export default DetailPage;
