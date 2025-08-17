import { SessionCard } from './SessionCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SessionCard> = {
  title: 'Player/Atoms/SessionCard',
  component: SessionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'セッション情報を表示するカードComponent。Player文脈でのTRPGセッション一覧表示に使用。available・ongoing・completed状態に対応。',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['available', 'ongoing', 'completed'],
    },
    onDetailClick: { action: 'detail clicked' },
    onJoinClick: { action: 'join clicked' },
  },
  decorators: [
    (Story) => (
      <div className="w-80 max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseProps = {
  sessionId: 'session-001',
  title: '古の森に眠る謎',
  scenarioSummary: '深い森の奥で発見された古い遺跡。そこに隠された秘密とは何か？冒険者たちは真実を解き明かすことができるのだろうか。',
  onDetailClick: () => {},
  onJoinClick: () => {},
};

export const Available: Story = {
  args: {
    ...baseProps,
    status: 'available',
    tags: ['ファンタジー', '探索'],
  },
};

export const Ongoing: Story = {
  args: {
    ...baseProps,
    title: '海賊の財宝を求めて',
    scenarioSummary: '伝説の海賊キャプテン・ブラックベアードが隠したという財宝。その手がかりは古い地図に記されていた。',
    status: 'ongoing',
    tags: ['アドベンチャー', '海賊'],
  },
};

export const Completed: Story = {
  args: {
    ...baseProps,
    title: '竜の谷の戦い',
    scenarioSummary: '邪悪な竜が支配する谷。勇敢な冒険者たちが最後の戦いに挑む。果たして勝利することはできるのか？',
    status: 'completed',
    tags: ['ファンタジー', '戦闘', 'ドラゴン'],
  },
};

export const WithThumbnail: Story = {
  args: {
    ...baseProps,
    status: 'available',
    thumbnailUrl: 'https://picsum.photos/400/300?random=1',
    tags: ['ファンタジー', '謎解き'],
  },
};

export const LongTitle: Story = {
  args: {
    ...baseProps,
    title: '非常に長いタイトルのセッション：古代文明の遺跡で発見された謎の石版の解読を巡る冒険',
    scenarioSummary: '考古学者のチームが発見した古代の石版。そこには未知の文字で何かが刻まれている。その文字を解読することで、失われた文明の秘密が明らかになるかもしれない。しかし、その過程で様々な困難や危険が待ち受けている。',
    status: 'available',
    tags: ['考古学', '謎解き', '古代文明', '学術調査', 'ミステリー'],
  },
};

export const NoTags: Story = {
  args: {
    ...baseProps,
    status: 'available',
    tags: [],
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-4">全ステータス一覧</div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">参加募集中</h3>
          <SessionCard
            {...baseProps}
            status="available"
            tags={['ファンタジー', '探索']}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">進行中</h3>
          <SessionCard
            {...baseProps}
            title="進行中のセッション"
            status="ongoing"
            tags={['アクション', '戦闘']}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">完了済み</h3>
          <SessionCard
            {...baseProps}
            title="完了したセッション"
            status="completed"
            tags={['ミステリー', '完結']}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="w-80 max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <SessionCard
        {...baseProps}
        sessionId="session-001"
        status="available"
        tags={['ファンタジー']}
      />
      <SessionCard
        {...baseProps}
        sessionId="session-002"
        title="宇宙ステーションの危機"
        scenarioSummary="宇宙ステーションで発生した謎の事件。生存者を救出せよ。"
        status="ongoing"
        tags={['SF', 'サスペンス']}
      />
      <SessionCard
        {...baseProps}
        sessionId="session-003"
        title="魔法学院の秘密"
        scenarioSummary="名門魔法学院に隠された古い秘密とは。"
        status="completed"
        tags={['ファンタジー', '学園']}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
  decorators: [],
};