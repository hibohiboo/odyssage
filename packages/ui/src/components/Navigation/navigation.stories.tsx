import type { Meta, StoryObj } from '@storybook/react';
import Navigation from './navigation';
import { BookOpen, Home, PlusCircle, User } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'ホーム', icon: Home },
  { to: '/dashboard', label: 'シナリオ一覧', icon: BookOpen },
  { to: '/create', label: '新規作成', icon: PlusCircle },
  { to: '/account', label: 'アカウント', icon: User },
];

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {
    navLinks,
    currentPath: '/',
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
};
