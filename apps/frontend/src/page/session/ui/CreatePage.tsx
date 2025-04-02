import { SessionCreateForm } from '@odyssage/ui/page-ui';
import { useSessionForm } from '../hooks/useSessionForm';

/**
 * セッション作成ページ
 * GMがストックしたシナリオを選択してセッションを作成するページ
 */
const CreatePage = () => {
  const { sessionName, handleSubmit } = useSessionForm();

  return (
    <form onSubmit={handleSubmit}>
      <SessionCreateForm sessionName={sessionName} />
    </form>
  );
};

export default CreatePage;
