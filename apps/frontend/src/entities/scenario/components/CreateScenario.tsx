import { ScenarioEditPage } from '@odyssage/ui/page-ui';
import { FormEventHandler, useState } from 'react';
import { useNavigate } from 'react-router';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { uidSelector } from '@odyssage/frontend/shared/auth/model/authSlice';
import { useAppSelector } from '@odyssage/frontend/shared/lib/store';
import { generateUuid } from '@odyssage/frontend/shared/lib/uuid/createUUID';
import { useCreateScenario } from '../hooks/useCreateScenario';

const CreateScenario = () => {
  const { createScenario, loading, success } = useCreateScenario();
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
      console.log(`GraphDB保存開始: id=${id}, title="${title}"`);
      const response = await apiClient.api['graph-scenarios'][':id'].$put({
        param: { id },
        json: { title, overview },
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('シナリオがGraphDBにも保存されました:', responseData);
      } else {
        const errorData = await response.text();
        console.warn(`GraphDB保存が失敗しました（status: ${response.status}）:`, errorData);
      }
    } catch (graphError) {
      // GraphDBエラーはユーザーには影響させない
      console.error('GraphDBへの保存でエラーが発生:', graphError);
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
