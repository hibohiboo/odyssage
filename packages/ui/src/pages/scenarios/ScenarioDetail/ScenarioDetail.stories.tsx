import { BrowserRouter } from 'react-router';
import { ScenarioDetailPage } from './ScenarioDetail';
import { scenarioData, ScenarioStatus } from './types';
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
    },
    onStatusChange: (newStatus: ScenarioStatus) => {
      console.log(`Status changed to: ${newStatus}`);
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
    onStatusChange: (newStatus: ScenarioStatus) => {
      console.log(`Status changed to: ${newStatus}`);
    },
    onToggleGMStock: () => {
      console.log('GM Stock toggled');
    },
  },
};

export const GMStockedScenario: Story = {
  args: {
    scenario: {
      ...scenarioData,
      isStockedByGM: true,
    },
    onStatusChange: (newStatus: ScenarioStatus) => {
      console.log(`Status changed to: ${newStatus}`);
    },
    onToggleGMStock: () => {
      console.log('GM Stock toggled');
    },
  },
};
