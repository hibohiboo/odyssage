import { PlusCircle } from 'lucide-react';
import { ScenarioHeader } from './ScenarioHeader';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ScenarioHeader> = {
  title: 'Pages/Scenarios/ScenarioList/ScenarioHeader',
  component: ScenarioHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScenarioHeader>;

export const Default: Story = {
  args: {
    children: (
      <button className="btn btn-primary">
        <PlusCircle className="mr-2 h-4 w-4" />
        新規シナリオ作成
      </button>
    ),
  },
};

export const WithoutChildren: Story = {
  args: {},
};
