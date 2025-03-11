import type { Meta, StoryObj } from '@storybook/react';
import { BookOpen, Users, Map } from 'lucide-react';

import { FeatureCard } from './FeatureCard';

const meta = {
  title: 'Components/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GameBook: Story = {
  args: {
    icon: BookOpen,
    title: 'ゲームブック風TRPG',
    description:
      '選択肢によって物語が分岐するゲームブックの形式を取り入れた、新しいスタイルのTRPGを体験できます。',
  },
};

export const AsyncPlay: Story = {
  args: {
    icon: Users,
    title: '非同期プレイ',
    description:
      '時間や場所を選ばず、プレイヤーとGMが自分のペースでゲームを進行できる非同期型のプレイスタイルです。',
  },
};

export const ScenarioManagement: Story = {
  args: {
    icon: Map,
    title: 'シナリオ管理',
    description:
      '直感的なインターフェースでシナリオを作成・管理。フローチャートでストーリーの分岐を視覚的に把握できます。',
  },
};
