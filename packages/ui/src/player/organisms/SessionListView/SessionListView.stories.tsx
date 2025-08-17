import { SessionListView } from './SessionListView';
import type { SessionData } from './SessionListView';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SessionListView> = {
  title: 'Player/Organisms/SessionListView',
  component: SessionListView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'セッション一覧表示Organism。SessionCardを使用してセッション一覧をグリッド表示。session-list画面の主要Component。\n\n**他Componentとの関係**: SessionCard（Atom）を組み合わせて一覧表示機能を提供。',
      },
    },
  },
  argTypes: {
    loading: { control: 'boolean' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// サンプルデータ
const mockSessions: SessionData[] = [
  {
    sessionId: 'session-001',
    title: '失われた森の守護者',
    scenarioSummary: '森の異変を調査する冒険者たちの物語。古代の秘密を解き明かし、森を救えるか？',
    status: 'available',
    thumbnailUrl: 'https://dummyimage.com/300x200/2563eb/ffffff?text=Forest+Guardian',
    tags: ['ファンタジー', '探索', '初心者歓迎'],
  },
  {
    sessionId: 'session-002',
    title: '薬草採取の旅',
    scenarioSummary: '病気を治すための薬草を求めて危険な山々を旅する。仲間との絆が試される物語。',
    status: 'ongoing',
    thumbnailUrl: 'https://dummyimage.com/300x200/16a34a/ffffff?text=Herb+Journey',
    tags: ['冒険', '協力'],
  },
  {
    sessionId: 'session-003',
    title: '古の遺跡探索',
    scenarioSummary: '謎に満ちた古代遺跡での宝探し。パズルとトラップが冒険者を待ち受ける。',
    status: 'completed',
    thumbnailUrl: 'https://dummyimage.com/300x200/dc2626/ffffff?text=Ancient+Ruins',
    tags: ['謎解き', '宝探し'],
  },
  {
    sessionId: 'session-004',
    title: '商人ギルドの陰謀',
    scenarioSummary: '街に潜む陰謀を暴く推理もの。情報収集と交渉が鍵となる都市型シナリオ。',
    status: 'available',
    tags: ['推理', '交渉', '都市'],
  },
  {
    sessionId: 'session-005',
    title: '竜との契約',
    scenarioSummary: '伝説の竜と取引を行う壮大な物語。選択が世界の運命を左右する。',
    status: 'available',
    thumbnailUrl: 'https://dummyimage.com/300x200/7c3aed/ffffff?text=Dragon+Contract',
    tags: ['ドラゴン', '壮大', '運命'],
  },
  {
    sessionId: 'session-006',
    title: '海賊の宝島',
    scenarioSummary: '海賊の残した宝を求めて無人島を探索。海洋冒険の醍醐味を味わえる。',
    status: 'ongoing',
    tags: ['海賊', '宝探し', '島'],
  },
];

export const Default: Story = {
  args: {
    sessions: mockSessions.slice(0, 3),
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const ManyItems: Story = {
  args: {
    sessions: mockSessions,
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const SingleItem: Story = {
  args: {
    sessions: [mockSessions[0]],
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const Loading: Story = {
  args: {
    sessions: [],
    loading: true,
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const ErrorState: Story = {
  args: {
    sessions: [],
    error: 'ネットワークエラーが発生しました。しばらく時間をおいて再試行してください。',
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const Empty: Story = {
  args: {
    sessions: [],
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const StatusVariations: Story = {
  args: {
    sessions: [
      {
        sessionId: 'session-available',
        title: '参加募集中のセッション',
        scenarioSummary: '参加者を募集しているセッションです。今すぐ参加できます。',
        status: 'available',
        tags: ['募集中'],
      },
      {
        sessionId: 'session-ongoing',
        title: '進行中のセッション',
        scenarioSummary: '現在進行中のセッションです。途中参加はできません。',
        status: 'ongoing',
        tags: ['進行中'],
      },
      {
        sessionId: 'session-completed',
        title: '完了済みのセッション',
        scenarioSummary: '既に完了したセッションです。結果を確認できます。',
        status: 'completed',
        tags: ['完了'],
      },
    ],
    onSessionDetail: (sessionId: string) => console.log('詳細表示:', sessionId),
    onSessionJoin: (sessionId: string) => console.log('セッション参加:', sessionId),
  },
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="font-semibold">デスクトップ表示（3列グリッド）</h3>
        <div className="w-full">
          <SessionListView
            sessions={mockSessions.slice(0, 6)}
            onSessionDetail={(sessionId) => console.log('詳細表示:', sessionId)}
            onSessionJoin={(sessionId) => console.log('セッション参加:', sessionId)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">タブレット表示（2列グリッド）</h3>
        <div className="w-2/3">
          <SessionListView
            sessions={mockSessions.slice(0, 4)}
            onSessionDetail={(sessionId) => console.log('詳細表示:', sessionId)}
            onSessionJoin={(sessionId) => console.log('セッション参加:', sessionId)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold">モバイル表示（1列グリッド）</h3>
        <div className="w-1/3">
          <SessionListView
            sessions={mockSessions.slice(0, 2)}
            onSessionDetail={(sessionId) => console.log('詳細表示:', sessionId)}
            onSessionJoin={(sessionId) => console.log('セッション参加:', sessionId)}
          />
        </div>
      </div>
    </div>
  ),
};