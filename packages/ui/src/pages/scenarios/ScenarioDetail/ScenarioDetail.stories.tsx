import { expect, within } from '@storybook/test';
import { BrowserRouter } from 'react-router';
import { ScenarioDetailPage } from './ScenarioDetail';
import { scenarioData } from './types';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ScenarioDetailPage> = {
  title: 'Pages/Scenarios/ScenarioDetailPage',
  component: ScenarioDetailPage,
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
type Story = StoryObj<typeof ScenarioDetailPage>;

export const Default: Story = {
  args: {
    scenario: {
      ...scenarioData,
      createdAt: undefined,
      gmCount: 0,
      difficulty: undefined,
      estimatedTime: undefined,
      playerCount: undefined,
      author: undefined,
      tags: [],
    },
    onToggleGMStock: undefined,
  },
};

export const PublicScenario: Story = {
  args: {
    scenario: {
      ...scenarioData,
      status: 'public',
    },
    onToggleGMStock: () => {
      console.log('GM Stock toggled');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ret = await canvas.findByText('このシナリオでセッションを作成');
    // セッション作成ボタンが表示されていることを確認
    expect(ret).toBeTruthy();
    // セッション作成ボタンが無効化されていることを確認
    expect(ret).toBeDisabled();
  },
};

export const GMStockedScenario: Story = {
  args: {
    scenario: {
      ...scenarioData,
      isStockedByGM: true,
    },
    onToggleGMStock: () => {
      console.log('GM Stock toggled');
    },
  },
};
