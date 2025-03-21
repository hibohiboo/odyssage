import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler } from 'react';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
import { useCreateScenario } from '../hooks/useCreateScenario';

const CreateScenario = () => {
  const { createScenario, loading, success } = useCreateScenario();
  const uid = useAppSelector(uidSelector);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const title = form.get('title') as string;
    const overview = (form.get('overview') as string) || '';
    if (!uid || !title || !overview) {
      console.error('Invalid form data', { uid, title, overview });
      return;
    }
    const id = generateUuid();
    await createScenario({ id, uid, title, overview });
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScenarioEditPage loading={loading} />
      {success && <p>Scenario created successfully!</p>}
    </form>
  );
};

export default CreateScenario;
