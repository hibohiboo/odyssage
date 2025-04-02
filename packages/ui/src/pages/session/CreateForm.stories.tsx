import { BrowserRouter } from 'react-router';
import { FormInput } from './CreateForm';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * セッション作成フォームコンポーネント
 *
 * セッション名とセッション説明を入力するためのフォームUIを提供します。
 * このコンポーネントは制御されていないフォーム要素を使用しており、
 * 初期値のみを props として受け取ります。
 */
const meta = {
  title: 'Page/Session/CreateForm',
  component: FormInput,
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
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * デフォルト状態のセッション作成フォーム
 *
 * 初期値が空の状態のフォーム
 */
export const Default: Story = {
  args: {
    sessionName: '',
    description: '',
  },
};

/**
 * 初期値が設定されたセッション作成フォーム
 *
 * 既存のセッション情報がある場合の表示
 */
export const WithInitialValues: Story = {
  args: {
    sessionName: '失われた遺跡の秘宝の卓',
    description:
      '古代文明の遺跡を探索するセッションです。探索とパズル解決が中心となります。初心者歓迎！',
  },
};

/**
 * 長い説明文がある場合のセッション作成フォーム
 *
 * テキストエリアの高さ調整のテスト
 */
export const WithLongDescription: Story = {
  args: {
    sessionName: '竜の帰還 - 伝説の始まり',
    description: `このセッションでは、古代の竜が目覚め、王国に危機が迫っています。
プレイヤーは勇敢な冒険者となり、竜を鎮めるための伝説の武器を探し求める旅に出ます。

【注意事項】
・セッション時間は約3時間を予定しています
・ボイスチャットを使用します（マイク必須）
・初心者歓迎！ルールの説明も行います
・キャラクターは事前に作成してください
・ファンタジー設定に合った雰囲気を大切にしましょう`,
  },
};
