import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useEditScenario } from '@odyssage/frontend/entities/scenario/hooks/useEditScenario';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';

const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const uid = useAppSelector(uidSelector);
  const { editScenario, loading, success, error } = useEditScenario();
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  useEffect(() => {
    const fetchScenario = async () => {
      if (!id || !uid) return;
      try {
        const response = await apiClient.api.scenario[':id'].$get({
          param: { id },
        });
        const data = await response.json();
        setTitle(data.title);
        setOverview(data.overview);
        if (data.visibility) {
          setVisibility(data.visibility);
        }
      } catch (err) {
        console.error('Failed to fetch scenario', err);
      }
    };

    fetchScenario();
  }, [id, uid]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!id) return;
    await editScenario({ id, title, overview, visibility });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setOverview(value);
  };

  const handleVisibilityChange = (value: 'private' | 'public') => {
    setVisibility(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScenarioEditPage
        title={title}
        description={overview}
        visibility={visibility}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        onVisibilityChange={handleVisibilityChange}
        loading={loading}
      />
      {success && <p>Scenario updated successfully!</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default EditPage;
