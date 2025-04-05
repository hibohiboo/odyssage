import { LoadingSpinner } from './LoadingSpinner';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * `LoadingSpinner`コンポーネントはデータロード中などの待機状態を表示するためのコンポーネントです。
 * シンプルな回転スピナーとメッセージを表示します。
 */
const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

/**
 * デフォルトのLoadingSpinner。
 * デフォルトメッセージ「読み込み中...」が表示されます。
 */
export const Default: Story = {};

/**
 * カスタムメッセージを表示するLoadingSpinner。
 */
export const CustomMessage: Story = {
  args: {
    message: 'データを読み込んでいます...',
  },
};

/**
 * メッセージなしのLoadingSpinner。
 */
export const NoMessage: Story = {
  args: {
    message: '',
  },
};
