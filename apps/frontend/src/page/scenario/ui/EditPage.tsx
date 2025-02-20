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
      } catch (err) {
        console.error('Failed to fetch scenario', err);
      }
    };

    fetchScenario();
  }, [id]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!id) return;
    await editScenario({ id, title, overview });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">シナリオタイトル:</label>
        <input
          required
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="overview">シナリオ概要:</label>
        <textarea
          id="overview"
          name="overview"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />
      </div>

      <button className="button is-primary" type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'シナリオ更新'}
      </button>
      {success && <p>Scenario updated successfully!</p>}
      {error && <p>{error}</p>}
    </form>
  );
};

export default EditPage;
