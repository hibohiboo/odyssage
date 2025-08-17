import { EventButton } from './EventButton';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof EventButton> = {
  title: 'Player/Atoms/EventButton',
  component: EventButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Event処理用ボタンComponent。choice・narrative・continueに対応。Player文脈でのTRPG体験における選択・進行操作に使用。',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'choice', 'continue'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'セッションに参加',
    variant: 'primary',
  },
};

export const Choice: Story = {
  args: {
    children: '勇敢に森の奥へ進む',
    variant: 'choice',
  },
};

export const Continue: Story = {
  args: {
    children: '続ける',
    variant: 'continue',
  },
};

export const Loading: Story = {
  args: {
    children: '参加しています',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'セッション終了済み',
    variant: 'primary',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">基本バリエーション</h3>
        <div className="flex gap-2 flex-wrap">
          <EventButton variant="primary" onClick={() => {}}>
            プライマリ
          </EventButton>
          <EventButton variant="secondary" onClick={() => {}}>
            セカンダリ
          </EventButton>
          <EventButton variant="choice" onClick={() => {}}>
            選択肢
          </EventButton>
          <EventButton variant="continue" onClick={() => {}}>
            続行
          </EventButton>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">状態バリエーション</h3>
        <div className="flex gap-2 flex-wrap">
          <EventButton variant="primary" loading onClick={() => {}}>
            読み込み中
          </EventButton>
          <EventButton variant="choice" disabled onClick={() => {}}>
            無効状態
          </EventButton>
        </div>
      </div>
    </div>
  ),
};
