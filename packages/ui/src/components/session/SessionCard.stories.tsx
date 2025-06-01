import { SessionCard } from './SessionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Session/SessionCard',
  component: SessionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SessionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 進行中のセッションカード
 */
export const Active: Story = {
  args: {
    id: '1',
    name: '失われた遺跡の秘宝',
    description:
      '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが...',
    gm: 'ダンジョンマスター',
    players: 3,
    maxPlayers: 5,
    status: '進行中',
    progress: 45,
    createdAt: '2024-02-15',
    currentScene: '遺跡の入り口で選択を待っています',
    unreadMessages: 2,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
    onPlay: (id) => console.log('Play session:', id),
  },
};

/**
 * 待機中のセッションカード
 */
export const Waiting: Story = {
  args: {
    id: '2',
    name: '星間航路の迷子',
    description:
      '宇宙船の故障により未知の惑星に不時着した乗組員たち。生存と脱出のために奮闘する物語。',
    gm: 'スターナビゲーター',
    players: 2,
    maxPlayers: 4,
    status: '準備中',
    progress: 30,
    createdAt: '2024-01-10',
    currentScene: 'GMからの返答を待っています',
    unreadMessages: 0,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
  },
};

/**
 * 完了したセッションカード
 */
export const Completed: Story = {
  args: {
    id: '3',
    name: '魔法学園の試験日',
    description:
      '魔法学園の期末試験。学生たちは試験に合格するため、様々な課題に挑む。',
    gm: 'アーケインプロフェッサー',
    players: 4,
    maxPlayers: 4,
    status: '終了',
    progress: 100,
    createdAt: '2024-02-01',
    currentScene: 'シナリオ完了',
    unreadMessages: 0,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
  },
};

/**
 * 最小情報のセッションカード
 */
export const Minimal: Story = {
  args: {
    id: '4',
    name: '最小情報のセッション',
    gm: 'ゲームマスター',
    players: 1,
    maxPlayers: 6,
    status: '準備中',
    createdAt: '2024-03-01',
    onViewDetails: (id) => console.log('View details:', id),
  },
};
