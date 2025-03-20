import type { Meta, StoryObj } from '@storybook/react';
import { StatusTabs } from './StatusTabs';

const meta: Meta<typeof StatusTabs> = {
  title: 'Pages/Scenarios/ScenarioList/StatusTabs',
  component: StatusTabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusTabs>;

export const Default: Story = {
  args: {
    activeTab: 'all',
    onTabChange: (tab) => console.log(`Tab changed to: ${tab}`),
  },
};

export const PublishedActive: Story = {
  args: {
    activeTab: 'published',
    onTabChange: (tab) => console.log(`Tab changed to: ${tab}`),
  },
};

export const DraftActive: Story = {
  args: {
    activeTab: 'draft',
    onTabChange: (tab) => console.log(`Tab changed to: ${tab}`),
  },
};

export const PrivateActive: Story = {
  args: {
    activeTab: 'private',
    onTabChange: (tab) => console.log(`Tab changed to: ${tab}`),
  },
};
