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
      <div>
        <label htmlFor="title">シナリオタイトル:</label>
        <input required type="text" id="title" name="title" />
      </div>
      <div>
        <label htmlFor="overview">シナリオ概要:</label>
        <textarea id="overview" name="overview" />
      </div>

      <button className="button is-primary" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'シナリオ作成'}
      </button>
      {success && <p>Scenario created successfully!</p>}
    </form>
  );
};

export default CreateScenario;
