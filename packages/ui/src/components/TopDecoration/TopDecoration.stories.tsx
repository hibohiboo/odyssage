import { TopDecoration } from './TopDecoration';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/TopDecoration',
  component: TopDecoration,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative w-96 h-96 border border-dashed border-gray-300 flex items-center justify-center">
        <Story />
        <p className="text-center">コンテンツエリア</p>
      </div>
    ),
  ],
} satisfies Meta<typeof TopDecoration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomSize: Story = {
  decorators: [
    (Story) => (
      <div className="relative w-64 h-64 border border-dashed border-gray-300 flex items-center justify-center">
        <Story />
        <p className="text-center">小さいコンテンツエリア</p>
      </div>
    ),
  ],
  args: {},
};
