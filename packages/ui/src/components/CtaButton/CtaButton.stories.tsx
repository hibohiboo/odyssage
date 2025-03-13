import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight } from 'lucide-react';
import { CtaButton } from './CtaButton';

const meta = {
  title: 'Components/CtaButton',
  component: CtaButton,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CtaButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    href: '#',
    variant: 'primary',
    children: 'シナリオを作成する',
  },
};

export const Outline: Story = {
  args: {
    href: '#',
    variant: 'outline',
    children: 'シナリオ一覧を見る',
  },
};

export const WithIcon: Story = {
  args: {
    href: '#',
    variant: 'primary',
    children: (
      <>
        シナリオを作成する
        <ArrowRight
          className="inline ml-2 h-5 w-5"
          aria-hidden="true"
          focusable="false"
        />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'CtaButton with an icon added as a child element.',
      },
    },
  },
};
