import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler, useState } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { useEditScenario } from '@odyssage/frontend/entities/scenario/hooks/useEditScenario';
import { ScenarioData } from '../api/detailLoader';

type Visibility = 'private' | 'public';
const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const loaderData = useLoaderData<ScenarioData>();

  const { editScenario, loading, success, error } = useEditScenario();
  const [title, setTitle] = useState(loaderData.title);
  const [overview, setOverview] = useState(loaderData.overview);
  const [visibility, setVisibility] = useState<Visibility>(
    (loaderData.visibility as Visibility) || 'private',
  );

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
        pageTitle="シナリオ編集"
      />
      {success && <p>Scenario updated successfully!</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default EditPage;
