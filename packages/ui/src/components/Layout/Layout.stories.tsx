import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Layout } from './Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    navigation: (
      <div className="fixed top-0 left-0 right-0 h-16 bg-stone-200 flex items-center px-4">
        Navigation Bar
      </div>
    ),
    children: <div className="p-4">Main Content</div>,
  },
};

export const WithSidebar: Story = {
  args: {
    navigation: (
      <div>
        <div className="fixed top-0 left-0 right-0 h-16 bg-stone-200 flex items-center px-4">
          Navigation Bar
        </div>
        <div className="fixed top-16 left-0 bottom-0 w-64 bg-stone-200 p-4">
          Sidebar
        </div>
      </div>
    ),
    children: <div className="p-4 ml-64">Main Content with Sidebar</div>,
  },
};
