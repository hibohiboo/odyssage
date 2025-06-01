import { Footer } from './Footer';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Pages/Top/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: [
    'autodocs',
    'skip', // タグでスキップするテスト
  ],
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
