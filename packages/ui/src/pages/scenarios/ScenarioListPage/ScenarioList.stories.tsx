import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioList } from './ScenarioList';
import { BrowserRouter } from 'react-router';

const meta: Meta<typeof ScenarioList> = {
  title: 'Pages/Scenarios/ScenarioList',
  component: ScenarioList,
  parameters: {
    layout: 'padded',
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
type Story = StoryObj<typeof ScenarioList>;

const mockScenarios = [
  {
    id: '1',
    title: '失われた遺跡の秘宝',
    description:
      '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが...',
    createdAt: '2023-10-15',
    updatedAt: '2023-12-10',
    status: 'published',
    usedByGMs: 5,
    tags: ['ファンタジー', '冒険', '謎解き'],
  },
  {
    id: '2',
    title: '星間航路の迷子',
    description:
      '宇宙船の故障により未知の惑星に不時着した乗組員たち。生存と脱出のために奮闘する物語。',
    createdAt: '2023-11-20',
    updatedAt: '2023-11-25',
    status: 'published',
    usedByGMs: 2,
    tags: ['SF', 'サバイバル', '宇宙'],
  },
  {
    id: '3',
    title: '霧の街の怪事件（下書き）',
    description: '霧に包まれた街で起こる連続怪事件。真相を追う探偵の物語。',
    createdAt: '2023-12-05',
    updatedAt: '2023-12-05',
    status: 'draft',
    usedByGMs: 0,
    tags: ['ミステリー', 'ホラー', '推理'],
  },
];

export const Default: Story = {
  args: {
    scenarios: mockScenarios,
  },
};

export const Empty: Story = {
  args: {
    scenarios: [],
  },
};
