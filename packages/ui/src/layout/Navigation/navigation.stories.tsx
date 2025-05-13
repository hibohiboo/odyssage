import { BookOpen, Home, PlusCircle, User } from 'lucide-react';
import { BrowserRouter } from 'react-router';
import Navigation from './navigation';
import type { Meta, StoryObj } from '@storybook/react';

const navLinks = [
  { to: '/', label: 'ホーム', icon: Home },
  { to: '/dashboard', label: 'シナリオ一覧', icon: BookOpen },
  { to: '/create', label: '新規作成', icon: PlusCircle },
  { to: '/account', label: 'アカウント', icon: User },
];

const meta: Meta<typeof Navigation> = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
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
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {
    navLinks,
    currentPath: '/',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Mobile: Story = {
  args: {
    navLinks,
    currentPath: '/',
    isMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Desktop: Story = {
  args: {
    navLinks,
    currentPath: '/about',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
