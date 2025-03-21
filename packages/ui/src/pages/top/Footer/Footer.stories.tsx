import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta = {
  title: 'Pages/Top/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-full max-w-screen-xl mx-auto border border-dashed border-gray-300">
        <Story />
      </div>
    ),
  ],
  args: {},
};

export const WithContent: Story = {
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow bg-stone-100 p-8">
          <p className="text-center">ページコンテンツ</p>
        </div>
        <Story />
      </div>
    ),
  ],
  args: {},
};
