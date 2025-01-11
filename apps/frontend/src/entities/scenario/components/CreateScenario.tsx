import React, { useState } from 'react';
import { useCreateScenario } from '../hooks/useCreateScenario';

const CreateScenario = () => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [error, setError] = useState('');
  const { createScenario, loading, success } = useCreateScenario();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !overview) {
      setError('All fields are required');
      return;
    }
    setError('');
    await createScenario({ id, title, overview });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="overview">Overview:</label>
        <textarea
          id="overview"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Scenario'}
      </button>
      {success && <p>Scenario created successfully!</p>}
    </form>
  );
};

export default CreateScenario;
