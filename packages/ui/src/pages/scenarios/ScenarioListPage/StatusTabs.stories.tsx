import { StatusTabs } from './StatusTabs';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
    onTabChange: (tab: string) => console.log(`Tab changed to: ${tab}`),
  },
};

export const PublishedActive: Story = {
  args: {
    activeTab: 'public',
    onTabChange: (tab: string) => console.log(`Tab changed to: ${tab}`),
  },
};

export const DraftActive: Story = {
  args: {
    activeTab: 'draft',
    onTabChange: (tab: string) => console.log(`Tab changed to: ${tab}`),
  },
};

export const PrivateActive: Story = {
  args: {
    activeTab: 'private',
    onTabChange: (tab: string) => console.log(`Tab changed to: ${tab}`),
  },
};
