import { sampleScenes } from '../../data/sampleScenes';
import { PlaySessionView } from './PlaySessionView';
import type { PlaySessionViewProps } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof PlaySessionView> = {
  title: 'Player/Organisms/PlaySessionView',
  component: PlaySessionView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'プレイ画面Organism。play-session.md設計に基づく没入的プレイ体験・Event処理・シーン進行管理統合Component。\n\n**Event対応**: choice・narrative・dialogue・scene_transition・exploration全EventType対応。data-design.mdのEvent概念実装基盤。',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
    autoSaveStatus: {
      control: 'select',
      options: ['idle', 'saving', 'saved', 'error'],
    },
    error: { control: 'text' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータから取得
const sampleScene = sampleScenes[0]; // 森の入り口
const forestDepthsScene = sampleScenes[1]; // 森の深部

// 共通のセッション情報
const sessionInfo = {
  sessionId: 'session-001',
  title: '失われた森の守護者',
  description: '古い森で起きる不思議な現象を調査する冒険者の物語',
};

// 共通のハンドラー関数
const commonHandlers = {
  onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
  onContinue: () => console.log('続ける'),
  onMenuAccess: () => console.log('メニューアクセス'),
  onExitSession: () => console.log('セッション終了'),
};

// 基本のProps作成ヘルパー
const createStoryArgs = (overrides: Partial<PlaySessionViewProps> = {}): PlaySessionViewProps => ({
  currentScene: sampleScene,
  currentEvent: sampleScene.events[0],
  sessionInfo,
  ...commonHandlers,
  ...overrides,
});

// 基本的な表示（最初のイベント）
export const Default: Story = {
  args: createStoryArgs(),
};

// 選択肢イベント
export const ChoiceEvent: Story = {
  args: createStoryArgs({
    currentEvent: sampleScene.events.find((event) => event.type === 'choice') || sampleScene.events[0],
  }),
};

// 対話イベント
export const DialogueEvent: Story = {
  args: createStoryArgs({
    currentEvent: sampleScene.events.find((event) => event.type === 'dialogue') || sampleScene.events[0],
  }),
};

// 探索イベント
export const ExplorationEvent: Story = {
  args: createStoryArgs({
    currentEvent: sampleScene.events.find((event) => event.type === 'exploration') || sampleScene.events[0],
  }),
};

// シーン遷移イベント
export const SceneTransitionEvent: Story = {
  args: createStoryArgs({
    currentEvent: sampleScene.events.find((event) => event.type === 'scene_transition') || sampleScene.events[0],
  }),
};

// 森の深部シーン
export const ForestDepthsScene: Story = {
  args: createStoryArgs({
    currentScene: forestDepthsScene,
    currentEvent: forestDepthsScene.events[0],
  }),
};

// 読み込み中状態
export const Loading: Story = {
  args: createStoryArgs({
    currentScene: null,
    currentEvent: null,
    loading: true,
  }),
};

// 自動保存状態の表示
const AutoSaveStateDemo = ({ status, label }: { status: 'saving' | 'saved' | 'error'; label: string }) => (
  <div className="space-y-2">
    <h3 className="font-semibold">{label}</h3>
    <div className="border rounded overflow-hidden">
      <PlaySessionView {...createStoryArgs({ autoSaveStatus: status })} />
    </div>
  </div>
);

export const AutoSaveStates: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-gray-100">
      <AutoSaveStateDemo status="saving" label="自動保存中" />
      <AutoSaveStateDemo status="saved" label="保存完了" />
      <AutoSaveStateDemo status="error" label="保存エラー" />
    </div>
  ),
};

// エラー状態
export const ErrorState: Story = {
  args: createStoryArgs({
    currentScene: null,
    currentEvent: null,
    error: 'セッションの読み込みに失敗しました。ネットワーク接続を確認してください。',
  }),
};

// データなし状態
export const NoData: Story = {
  args: createStoryArgs({
    currentScene: null,
    currentEvent: null,
  }),
};

// 背景画像なし
export const NoBackgroundImage: Story = {
  args: createStoryArgs({
    currentScene: {
      ...sampleScene,
      backgroundImage: undefined,
    },
  }),
};

// Eventタイプ比較
const EventTypeDemo = ({ eventType, label }: { eventType: string; label: string }) => (
  <div className="space-y-2">
    <h3 className="font-semibold">{label}</h3>
    <div className="border rounded overflow-hidden h-[600px]">
      <PlaySessionView
        {...createStoryArgs({
          currentEvent: sampleScene.events.find((event) => event.type === eventType) || sampleScene.events[0],
        })}
      />
    </div>
  </div>
);

export const EventTypeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventTypeDemo eventType="choice" label="Choice Event" />
        <EventTypeDemo eventType="narrative" label="Narrative Event" />
        <EventTypeDemo eventType="dialogue" label="Dialogue Event" />
        <EventTypeDemo eventType="exploration" label="Exploration Event" />
      </div>
    </div>
  ),
};
