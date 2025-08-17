import { PlaySessionView } from './PlaySessionView';
import type { SceneData } from './PlaySessionView';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof PlaySessionView> = {
  title: 'Player/Organisms/PlaySessionView',
  component: PlaySessionView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'プレイ画面Organism。play-session.md設計に基づく没入的プレイ体験・Event処理・シーン進行管理統合Component。\n\n**Event対応**: choice・narrative・dialogue・scene_transition・exploration全EventType対応。data-design.mdのEvent概念実装基盤。',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
    autoSaveStatus: { 
      control: 'select',
      options: ['idle', 'saving', 'saved', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 共通のセッション情報
const sessionInfo = {
  sessionId: 'session-001',
  title: '失われた森の守護者',
};

// choice Event シーン
const choiceEventScene: SceneData = {
  id: 'scene-forest-001',
  title: '森の入り口',
  backgroundImage: 'https://dummyimage.com/800x450/2d5330/ffffff?text=Forest+Entrance',
  currentEvent: {
    id: 'event-001-choice',
    type: 'choice',
    title: '森への進入方法',
    content: '深い森の前に立つあなたたち。木々は不気味に静まり返り、いつもなら聞こえるはずの鳥のさえずりも聞こえない。どのように森に入るかを決めなければならない。',
    choices: [
      {
        id: 'choice-001-path',
        text: '獣道を慎重に歩く',
        description: '安全な道を選ぶが、時間がかかる可能性がある',
      },
      {
        id: 'choice-001-direct',
        text: '直接森の奥へ向かう',
        description: '最短ルートだが、未知の危険が待ち受けているかもしれない',
      },
      {
        id: 'choice-001-observe',
        text: 'まず周囲を観察する',
        description: '情報収集を優先して、慎重に状況を把握する',
      },
    ],
  },
};

// narrative Event シーン
const narrativeEventScene: SceneData = {
  id: 'scene-forest-002',
  title: '古い石碑',
  backgroundImage: 'https://dummyimage.com/800x450/4a5568/ffffff?text=Ancient+Stone',
  currentEvent: {
    id: 'event-002-narrative',
    type: 'narrative',
    content: `獣道を慎重に進むと、古い石碑を発見する。

文字は読めないが、なぜか懐かしさを感じる。石碑の周りには小さな花が咲いており、この荒れた森の中で唯一生命力に満ちた場所のように見える。

石碑に触れると、温かい感覚が手のひらに伝わってくる。`,
  },
};

// dialogue Event シーン
const dialogueEventScene: SceneData = {
  id: 'scene-forest-003',
  title: '森の守護者',
  backgroundImage: 'https://dummyimage.com/800x450/1a365d/ffffff?text=Forest+Guardian',
  currentEvent: {
    id: 'event-003-dialogue',
    type: 'dialogue',
    npcName: '森の守護者',
    content: '長い間、誰もこの森の奥まで来ることはなかった。お前たちは何故ここに？森の異変を感じて来たのか、それとも別の目的があるのか？',
  },
};

// exploration Event シーン
const explorationEventScene: SceneData = {
  id: 'scene-forest-004',
  title: '謎の洞窟',
  backgroundImage: 'https://dummyimage.com/800x450/2d3748/ffffff?text=Mysterious+Cave',
  currentEvent: {
    id: 'event-004-exploration',
    type: 'exploration',
    targetName: '洞窟の入り口',
    content: '洞窟を調べてみると、奥から微かな光が漏れている。壁面には古代の文字が刻まれており、何かを警告しているようだ。足元には動物の骨が散らばっている。',
  },
};

// scene_transition Event シーン
const sceneTransitionEventScene: SceneData = {
  id: 'scene-transition',
  title: 'シーン遷移',
  backgroundImage: 'https://dummyimage.com/800x450/805ad5/ffffff?text=Transition',
  currentEvent: {
    id: 'event-005-transition',
    type: 'scene_transition',
    content: 'あなたたちは森の深部へと向かう。周囲の景色が徐々に変わり、神秘的な光に包まれていく...',
  },
};

export const ChoiceEvent: Story = {
  args: {
    scene: choiceEventScene,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const NarrativeEvent: Story = {
  args: {
    scene: narrativeEventScene,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const DialogueEvent: Story = {
  args: {
    scene: dialogueEventScene,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const ExplorationEvent: Story = {
  args: {
    scene: explorationEventScene,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const SceneTransitionEvent: Story = {
  args: {
    scene: sceneTransitionEventScene,
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const Loading: Story = {
  args: {
    scene: choiceEventScene,
    sessionInfo,
    loading: true,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const AutoSaveStates: Story = {
  render: () => (
    <div className="space-y-4 p-4 bg-gray-100">
      <div className="space-y-2">
        <h3 className="font-semibold">自動保存中</h3>
        <div className="border rounded overflow-hidden">
          <PlaySessionView
            scene={narrativeEventScene}
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
            scene={narrativeEventScene}
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
            scene={narrativeEventScene}
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

export const NoBackgroundImage: Story = {
  args: {
    scene: {
      ...choiceEventScene,
      backgroundImage: undefined,
    },
    sessionInfo,
    onChoiceSelect: (choiceId: string) => console.log('選択肢選択:', choiceId),
    onContinue: () => console.log('続ける'),
    onMenuAccess: () => console.log('メニューアクセス'),
    onExitSession: () => console.log('セッション終了'),
  },
};

export const EventTypeComparison: Story = {
  render: () => (
    <div className="space-y-6 p-4 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Choice Event</h3>
          <div className="border rounded overflow-hidden h-[600px]">
            <PlaySessionView
              scene={choiceEventScene}
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
              scene={narrativeEventScene}
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
              scene={dialogueEventScene}
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
              scene={explorationEventScene}
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