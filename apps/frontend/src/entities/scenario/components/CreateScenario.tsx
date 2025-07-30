import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
import { useCreateScenario } from '../hooks/useCreateScenario';
import { useGraphScenarioMutation } from '../api/useGraphScenarioMutation';

const CreateScenario = () => {
  const { createScenario, loading, success } = useCreateScenario();
  const { saveToGraph } = useGraphScenarioMutation();
  const uid = useAppSelector(uidSelector);
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const form = new FormData(e.currentTarget);
    const title = form.get('title') as string;
    const overview = (form.get('overview') as string) || '';
    
    if (!uid || !title || !overview) {
      console.error('Invalid form data', { uid, title, overview });
      return;
    }

    const id = generateUuid();
    
    // 1. RDBにシナリオを作成（既存処理）
    const { error } = await createScenario({
      id,
      uid,
      title,
      overview,
      visibility,
    });
    
    if (error) {
      alert('シナリオの作成に失敗しました。');
      console.error('Error creating scenario:', error);
      return;
    }

    // 2. GraphDBに同じデータを保存（追加処理）
    try {
      await saveToGraph(id, { title, overview });
      console.log('シナリオがGraphDBにも保存されました');
    } catch (graphError) {
      // GraphDBエラーはユーザーには影響させない
      console.warn('GraphDBへの保存に失敗しましたが、シナリオは正常に作成されました', graphError);
    }

    navigate('/creator/scenario/list');
  };

  const handleVisibilityChange = (value: 'private' | 'public') => {
    setVisibility(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ScenarioEditPage
        loading={loading}
        visibility={visibility}
        onVisibilityChange={handleVisibilityChange}
      />
      {success && <p>Scenario created successfully!</p>}
    </form>
  );
};

export default CreateScenario;
