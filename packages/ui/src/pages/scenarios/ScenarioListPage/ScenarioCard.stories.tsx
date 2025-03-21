import type { Meta, StoryObj } from '@storybook/react';
import { ScenarioCard } from './ScenarioCard';
import { Scenario } from './types';
import { BrowserRouter } from 'react-router';

const meta: Meta<typeof ScenarioCard> = {
  title: 'Pages/Scenarios/ScenarioList/ScenarioCard',
  component: ScenarioCard,
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
type Story = StoryObj<typeof ScenarioCard>;

const publishedScenario: Scenario = {
  id: '1',
  title: '失われた遺跡の秘宝',
  description:
    '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが...',
  createdAt: '2023-10-15',
  updatedAt: '2023-12-10',
  status: 'published',
  usedByGMs: 5,
  tags: ['ファンタジー', '冒険', '謎解き'],
};

const draftScenario: Scenario = {
  id: '3',
  title: '霧の街の怪事件（下書き）',
  description: '霧に包まれた街で起こる連続怪事件。真相を追う探偵の物語。',
  createdAt: '2023-12-05',
  updatedAt: '2023-12-05',
  status: 'draft',
  usedByGMs: 0,
  tags: ['ミステリー', 'ホラー', '推理'],
};

const privateScenario: Scenario = {
  id: '4',
  title: '時の迷宮',
  description: '異なる時代をつなぐ不思議な迷宮を探索する冒険。',
  createdAt: '2023-11-01',
  updatedAt: '2023-12-01',
  status: 'private',
  usedByGMs: 0,
  tags: ['時間', 'ファンタジー', '異世界'],
};

export const Published: Story = {
  args: {
    scenario: publishedScenario,
  },
};

export const Draft: Story = {
  args: {
    scenario: draftScenario,
  },
};

export const Private: Story = {
  args: {
    scenario: privateScenario,
  },
};
