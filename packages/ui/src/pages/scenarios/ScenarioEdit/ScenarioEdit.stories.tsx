import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ScenarioEdit from './ScenarioEdit';
import { BrowserRouter } from 'react-router';

type Visibility = 'private' | 'public';
// This wrapper helps us use state in Storybook
const ScenarioEditWithState = ({
  initialTitle = '',
  initialDescription = '',
  initialTags = [] as string[],
  initialVisibility = 'private' as Visibility,
  initialDifficulty = 'normal',
  initialPlayerCount = '4-5',
  initialPlaytime = 'medium',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>(
    initialVisibility,
  );
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [playerCount, setPlayerCount] = useState(initialPlayerCount);
  const [playtime, setPlaytime] = useState(initialPlaytime);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <ScenarioEdit
      title={title}
      description={description}
      tags={tags}
      newTag={newTag}
      visibility={visibility}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onNewTagChange={setNewTag}
      onVisibilityChange={setVisibility}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
      onSave={() => alert('シナリオを保存しました')}
      difficulty={difficulty}
      onDifficultyChange={setDifficulty}
      playerCount={playerCount}
      onPlayerCountChange={setPlayerCount}
      playtime={playtime}
      onPlaytimeChange={setPlaytime}
    />
  );
};

const meta: Meta<typeof ScenarioEdit> = {
  title: 'Pages/Scenarios/ScenarioEdit',
  component: ScenarioEdit,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ScenarioEdit>;

// Standard usage with state wrapper
export const Default: Story = {
  render: () => <ScenarioEditWithState />,
};

// Pre-filled scenario example
export const WithData: Story = {
  render: () => (
    <ScenarioEditWithState
      initialTitle="古代遺跡の秘宝"
      initialDescription="失われた文明の遺跡で、伝説の宝を探す冒険。プレイヤーは様々な謎解きと罠を乗り越えながら、古代の秘密を解き明かしていきます。"
      initialTags={['冒険', 'ファンタジー', '謎解き']}
      initialVisibility="private"
      initialDifficulty="hard"
      initialPlayerCount="2-3"
      initialPlaytime="long"
    />
  ),
};

// Public visibility example
export const PublicVisibility: Story = {
  render: () => (
    <ScenarioEditWithState
      initialTitle="宇宙船の遭難"
      initialDescription="故障した宇宙船で、無人惑星からの脱出を目指す生存者達のストーリー。限られた資源と緊迫した状況の中で、プレイヤーは様々な困難に立ち向かいます。"
      initialTags={['SF', '宇宙', 'サバイバル']}
      initialVisibility="public"
      initialDifficulty="very-hard"
      initialPlayerCount="4-5"
      initialPlaytime="very-long"
    />
  ),
};

// Example of props without wrapper (for documentation)
export const PropsExample: Story = {
  args: {
    title: 'シナリオタイトル例',
    description: 'シナリオの概要や背景を説明するテキストがここに入ります。',
    tags: ['タグ1', 'タグ2', 'サンプル'],
    newTag: '',
    visibility: 'private',
    onTitleChange: () => console.log('タイトル変更'),
    onDescriptionChange: () => console.log('概要変更'),
    onNewTagChange: () => console.log('新規タグ変更'),
    onVisibilityChange: () => console.log('公開設定変更'),
    onAddTag: () => console.log('タグ追加'),
    onRemoveTag: () => console.log('タグ削除'),
    onSave: () => console.log('保存'),
    difficulty: 'normal',
    onDifficultyChange: () => console.log('難易度変更'),
    playerCount: '4-5',
    onPlayerCountChange: () => console.log('プレイヤー数変更'),
    playtime: 'medium',
    onPlaytimeChange: () => console.log('プレイ時間変更'),
  },
};
