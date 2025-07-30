import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
import { useCreateScenario } from '../hooks/useCreateScenario';
import { useGraphScenarioMutation } from '../api/useGraphScenarioMutation';

const CreateScenario = () => {
  const uid = useAppSelector(uidSelector);
  const { createScenario, isLoading, error } = useScenarioWithGraphMutation({ uid: uid || '' });
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const navigate = useNavigate();
  const handleCreateScenario = async (title: string, overview: string) => {
    const result = await createScenario({ title, overview });
    
    // GraphDB保存結果をログに記録（ユーザーには影響しない）
    if (result.graphSaved) {
      console.log('シナリオがGraphDBにも保存されました');
    } else {
      console.warn('GraphDBへの保存に失敗しましたが、シナリオは正常に作成されました');
    }

    navigate('/creator/scenario/list');
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    const form = new FormData(e.currentTarget);
    const title = form.get('title') as string;
    const overview = (form.get('overview') as string) || '';
    
    if (!uid || !title || !overview) {
      console.error('Invalid form data', { uid, title, overview });
      return;
    }

    try {
      await handleCreateScenario(title, overview);
    } catch (createError) {
      alert('シナリオの作成に失敗しました。');
      console.error('Error creating scenario:', createError);
    }
  };

  const handleVisibilityChange = (value: 'private' | 'public') => {
    setVisibility(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScenarioEditPage
        loading={isLoading}
        visibility={visibility}
        onVisibilityChange={handleVisibilityChange}
      />
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default CreateScenario;
