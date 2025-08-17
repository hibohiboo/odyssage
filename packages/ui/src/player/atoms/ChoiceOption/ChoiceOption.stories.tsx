import { ChoiceOption } from './ChoiceOption';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ChoiceOption> = {
  title: 'Player/Atoms/ChoiceOption',
  component: ChoiceOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'choice Event用の選択肢表示Component。Player文脈でのTRPG体験における選択肢表示・選択操作に使用。プレイヤーの選択による物語分岐を支援。\n\n**EventButtonとの使い分け**: EventButtonは汎用的なEvent処理用ボタン（参加・続行・キャンセル等）、ChoiceOptionは選択肢専用（物語の分岐選択・choice Event処理）で使用。',
      },
    },
  },
  argTypes: {
    text: { control: 'text' },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '慎重に獣道を進む',
    description: '安全な道を選ぶが、時間がかかる可能性がある',
    onClick: () => console.log('Choice selected'),
  },
};

export const WithoutDescription: Story = {
  args: {
    text: '森の奥へ向かう',
    onClick: () => console.log('Choice selected'),
  },
};

export const Selected: Story = {
  args: {
    text: '周囲を観察する',
    description: '情報収集を優先して、慎重に状況を把握する',
    selected: true,
    onClick: () => console.log('Choice selected'),
  },
};

export const Disabled: Story = {
  args: {
    text: '魔法を使う',
    description: 'この選択肢は現在利用できません',
    disabled: true,
    onClick: () => console.log('Choice selected'),
  },
};

export const LongText: Story = {
  args: {
    text: '森の守護者として深い森の奥へと向かい、古代の秘密を解き明かすための危険な旅路に出る',
    description: '非常に危険な道のりですが、森に隠された真実を知ることができるかもしれません。この選択は物語の展開に大きな影響を与える可能性があります。',
    onClick: () => console.log('Choice selected'),
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="space-y-2">
        <h3 className="font-semibold">基本状態</h3>
        <ChoiceOption
          text="獣道を慎重に歩く"
          description="安全な道を選ぶが、時間がかかる可能性がある"
          onClick={() => console.log('Choice 1')}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">選択済み状態</h3>
        <ChoiceOption
          text="直接森の奥へ向かう"
          description="最短ルートだが、未知の危険が待ち受けているかもしれない"
          selected={true}
          onClick={() => console.log('Choice 2')}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">無効状態</h3>
        <ChoiceOption
          text="魔法で瞬間移動する"
          description="魔力が足りないため使用できません"
          disabled={true}
          onClick={() => console.log('Choice 3')}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">説明なし</h3>
        <ChoiceOption
          text="まず周囲を観察する"
          onClick={() => console.log('Choice 4')}
        />
      </div>
    </div>
  ),
};

export const ChoiceList: Story = {
  render: () => (
    <div className="space-y-3 w-96">
      <h3 className="font-semibold text-lg mb-4">森への進入方法を選択してください</h3>
      
      <ChoiceOption
        text="獣道を慎重に歩く"
        description="安全な道を選ぶが、時間がかかる可能性がある"
        onClick={() => console.log('獣道を選択')}
      />
      
      <ChoiceOption
        text="直接森の奥へ向かう"
        description="最短ルートだが、未知の危険が待ち受けているかもしれない"
        onClick={() => console.log('直接ルートを選択')}
      />
      
      <ChoiceOption
        text="まず周囲を観察する"
        description="情報収集を優先して、慎重に状況を把握する"
        onClick={() => console.log('観察を選択')}
      />
    </div>
  ),
};