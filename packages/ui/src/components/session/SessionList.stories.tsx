import { SessionList } from './SessionList';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Session/SessionList',
  component: SessionList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SessionList>;

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータの作成
const sampleSessions = [
  {
    id: '1',
    name: '失われた遺跡の秘宝',
    description:
      '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが...',
    gm: 'ダンジョンマスター',
    players: 3,
    maxPlayers: 5,
    status: 'active',
    progress: 45,
    createdAt: '2024-02-15',
    currentScene: '遺跡の入り口で選択を待っています',
    unreadMessages: 2,
  },
  {
    id: '2',
    name: '星間航路の迷子',
    description:
      '宇宙船の故障により未知の惑星に不時着した乗組員たち。生存と脱出のために奮闘する物語。',
    gm: 'スターナビゲーター',
    players: 2,
    maxPlayers: 4,
    status: 'waiting',
    progress: 30,
    createdAt: '2024-01-10',
    currentScene: 'GMからの返答を待っています',
    unreadMessages: 0,
  },
  {
    id: '3',
    name: '魔法学園の試験日',
    description:
      '魔法学園の期末試験。学生たちは試験に合格するため、様々な課題に挑む。',
    gm: 'アーケインプロフェッサー',
    players: 4,
    maxPlayers: 4,
    status: 'completed',
    progress: 100,
    createdAt: '2024-02-01',
    currentScene: 'シナリオ完了',
    unreadMessages: 0,
  },
];

/**
 * 複数のセッションを表示する標準的なリスト
 */
export const Default: Story = {
  args: {
    sessions: sampleSessions,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
    onPlay: (id) => console.log('Play session:', id),
    showSearch: true,
    showStatusTabs: true,
  },
};

/**
 * 検索機能のないリスト
 */
export const WithoutSearch: Story = {
  args: {
    sessions: sampleSessions,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
    onPlay: (id) => console.log('Play session:', id),
    showSearch: false,
    showStatusTabs: true,
  },
};

/**
 * ステータスタブのないリスト
 */
export const WithoutStatusTabs: Story = {
  args: {
    sessions: sampleSessions,
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
    onPlay: (id) => console.log('Play session:', id),
    showSearch: true,
    showStatusTabs: false,
  },
};

/**
 * シンプルなリスト（検索もタブもなし）
 */
export const SimpleList: Story = {
  args: {
    sessions: sampleSessions,
    onViewDetails: (id) => console.log('View details:', id),
    showSearch: false,
    showStatusTabs: false,
  },
};

/**
 * 空のセッションリスト
 */
export const EmptyList: Story = {
  args: {
    sessions: [],
    showSearch: true,
    showStatusTabs: true,
  },
};

/**
 * 多数のセッションを含むリスト
 */
export const ManyItems: Story = {
  args: {
    sessions: [
      ...sampleSessions,
      ...sampleSessions.map((session, index) => ({
        ...session,
        id: `extra-${index + 1}`,
        name: `追加セッション ${index + 1}: ${session.name}`,
      })),
    ],
    onViewDetails: (id) => console.log('View details:', id),
    onViewMessages: (id) => console.log('View messages:', id),
    onPlay: (id) => console.log('Play session:', id),
  },
};
