import { sampleScenes } from '../../data/sampleScenes';
import { PlaySessionView } from './PlaySessionView';
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

// 基本的な表示（最初のイベント）
export const Default: Story = {
  args: {
    currentScene: sampleScene,
    currentEvent: sampleScene.events[0], // narrative event
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 選択肢イベント
export const ChoiceEvent: Story = {
  args: {
    currentScene: sampleScene,
    currentEvent:
      sampleScene.events.find((event) => event.type === 'choice') ||
      sampleScene.events[0],
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 対話イベント
export const DialogueEvent: Story = {
  args: {
    currentScene: sampleScene,
    currentEvent:
      sampleScene.events.find((event) => event.type === 'dialogue') ||
      sampleScene.events[0],
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 探索イベント
export const ExplorationEvent: Story = {
  args: {
    currentScene: sampleScene,
    currentEvent:
      sampleScene.events.find((event) => event.type === 'exploration') ||
      sampleScene.events[0],
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// シーン遷移イベント
export const SceneTransitionEvent: Story = {
  args: {
    currentScene: sampleScene,
    currentEvent:
      sampleScene.events.find((event) => event.type === 'scene_transition') ||
      sampleScene.events[0],
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 森の深部シーン
export const ForestDepthsScene: Story = {
  args: {
    currentScene: forestDepthsScene,
    currentEvent: forestDepthsScene.events[0], // 最初のイベント
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 読み込み中状態
export const Loading: Story = {
  args: {
    currentScene: null,
    currentEvent: null,
    sessionInfo,
    loading: true,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 自動保存状態の表示
export const AutoSaveStates: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-gray-100">
      <div className="space-y-2">
        <h3 className="font-semibold">自動保存中</h3>
        <div className="border rounded overflow-hidden">
          <PlaySessionView
            currentScene={sampleScene}
            currentEvent={sampleScene.events[0]}
            sessionInfo={sessionInfo}
            autoSaveStatus="saving"
            onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
            onContinue={() => console.log('続ける')}
            onMenuAccess={() => console.log('メニュー')}
            onExitSession={() => console.log('終了')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">保存完了</h3>
        <div className="border rounded overflow-hidden">
          <PlaySessionView
            currentScene={sampleScene}
            currentEvent={sampleScene.events[0]}
            sessionInfo={sessionInfo}
            autoSaveStatus="saved"
            onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
            onContinue={() => console.log('続ける')}
            onMenuAccess={() => console.log('メニュー')}
            onExitSession={() => console.log('終了')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">保存エラー</h3>
        <div className="border rounded overflow-hidden">
          <PlaySessionView
            currentScene={sampleScene}
            currentEvent={sampleScene.events[0]}
            sessionInfo={sessionInfo}
            autoSaveStatus="error"
            onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
            onContinue={() => console.log('続ける')}
            onMenuAccess={() => console.log('メニュー')}
            onExitSession={() => console.log('終了')}
          />
        </div>
      </div>
    </div>
  ),
};

// エラー状態
export const ErrorState: Story = {
  args: {
    currentScene: null,
    currentEvent: null,
    sessionInfo,
    error:
      'セッションの読み込みに失敗しました。ネットワーク接続を確認してください。',
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// データなし状態
export const NoData: Story = {
  args: {
    currentScene: null,
    currentEvent: null,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// 背景画像なし
export const NoBackgroundImage: Story = {
  args: {
    currentScene: {
      ...sampleScene,
      backgroundImage: undefined,
    },
    currentEvent: sampleScene.events[0],
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

// Eventタイプ比較
export const EventTypeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Choice Event</h3>
          <div className="border rounded overflow-hidden h-[600px]">
            <PlaySessionView
              currentScene={sampleScene}
              currentEvent={
                sampleScene.events.find((event) => event.type === 'choice') ||
                sampleScene.events[0]
              }
              sessionInfo={sessionInfo}
              onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
              onContinue={() => console.log('続ける')}
              onMenuAccess={() => console.log('メニュー')}
              onExitSession={() => console.log('終了')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Narrative Event</h3>
          <div className="border rounded overflow-hidden h-[600px]">
            <PlaySessionView
              currentScene={sampleScene}
              currentEvent={
                sampleScene.events.find(
                  (event) => event.type === 'narrative',
                ) || sampleScene.events[0]
              }
              sessionInfo={sessionInfo}
              onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
              onContinue={() => console.log('続ける')}
              onMenuAccess={() => console.log('メニュー')}
              onExitSession={() => console.log('終了')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Dialogue Event</h3>
          <div className="border rounded overflow-hidden h-[600px]">
            <PlaySessionView
              currentScene={sampleScene}
              currentEvent={
                sampleScene.events.find((event) => event.type === 'dialogue') ||
                sampleScene.events[0]
              }
              sessionInfo={sessionInfo}
              onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
              onContinue={() => console.log('続ける')}
              onMenuAccess={() => console.log('メニュー')}
              onExitSession={() => console.log('終了')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Exploration Event</h3>
          <div className="border rounded overflow-hidden h-[600px]">
            <PlaySessionView
              currentScene={sampleScene}
              currentEvent={
                sampleScene.events.find(
                  (event) => event.type === 'exploration',
                ) || sampleScene.events[0]
              }
              sessionInfo={sessionInfo}
              onChoiceSelect={(choiceId) => console.log('選択:', choiceId)}
              onContinue={() => console.log('続ける')}
              onMenuAccess={() => console.log('メニュー')}
              onExitSession={() => console.log('終了')}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
