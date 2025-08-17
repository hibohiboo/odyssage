import { SessionDetailView } from './SessionDetailView';
import type { SessionDetailData } from './SessionDetailView';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof SessionDetailView> = {
  title: 'Player/Organisms/SessionDetailView',
  component: SessionDetailView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'セッション詳細画面Organism。session-detail.md設計に基づくヒーローセクション・詳細情報・参加CTA統合Component。\n\n**画面設計対応**: ヒーローセクション・詳細情報・参加確認フロー・レスポンシブレイアウト実装。',
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
const mockSessionData: SessionDetailData = {
  sessionId: 'session-001',
  title: '失われた森の守護者',
  scenarioSummary: '森の異変を調査する冒険者たちの物語。古代の秘密を解き明かし、森を救えるか？',
  overview: `深い森の奥で異変が起きている。木々は枯れ始め、動物たちは姿を消した。村人たちは恐れをなして森に近づこうとしない。

あなたたち冒険者は、この謎を解き明かすために森の奥へと向かう。そこで待ち受けているのは、古代から森を守り続けてきた守護者の試練だった。

森の秘密を知り、真の勇気を示すことができるか？ 
選択によって物語は大きく変わり、複数のエンディングが用意されている。

初心者にも優しい物語構成で、TRPGの醍醐味である「選択の重み」を存分に味わえるシナリオです。`,
  status: 'available',
  thumbnailUrl: 'https://dummyimage.com/800x450/2563eb/ffffff?text=Forest+Guardian',
  tags: ['ファンタジー', '探索', '初心者歓迎', '選択重視'],
  author: {
    name: 'シナリオ作者A',
  },
  createdAt: '2025-08-15T10:00:00Z',
};

const ongoingSessionData: SessionDetailData = {
  ...mockSessionData,
  sessionId: 'session-002',
  title: '薬草採取の旅',
  scenarioSummary: '病気を治すための薬草を求めて危険な山々を旅する。仲間との絆が試される物語。',
  overview: `村に疫病が蔓延し、多くの人々が苦しんでいる。唯一の治療法は、遥か遠い山の頂上にしか咲かない「銀の薬草」を手に入れることだ。

危険な山道を越え、モンスターの住む洞窟を抜け、厳しい自然と向き合いながら薬草を目指す旅。一人では決して成し遂げられない困難な道のりで、仲間との協力と信頼が物語の鍵となる。

果たしてあなたたちは村を救うことができるのか？`,
  status: 'ongoing',
  thumbnailUrl: 'https://dummyimage.com/800x450/16a34a/ffffff?text=Herb+Journey',
  tags: ['冒険', '協力', '感動'],
};

const completedSessionData: SessionDetailData = {
  ...mockSessionData,
  sessionId: 'session-003',
  title: '古の遺跡探索',
  scenarioSummary: '謎に満ちた古代遺跡での宝探し。パズルとトラップが冒険者を待ち受ける。',
  overview: `千年前に失われた古代文明の遺跡が発見された。そこには伝説の宝が眠っているという。

しかし遺跡は巧妙なパズルと危険なトラップで守られている。知恵と勇気、そして仲間との連携が試される謎解き冒険。

古代の技術者たちが残した仕掛けを解き明かし、最深部の宝にたどり着けるか？`,
  status: 'completed',
  thumbnailUrl: 'https://dummyimage.com/800x450/dc2626/ffffff?text=Ancient+Ruins',
  tags: ['謎解き', '宝探し', '古代'],
};

export const Available: Story = {
  args: {
    session: mockSessionData,
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const Ongoing: Story = {
  args: {
    session: ongoingSessionData,
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const Completed: Story = {
  args: {
    session: completedSessionData,
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const Loading: Story = {
  args: {
    session: mockSessionData,
    loading: true,
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const ErrorState: Story = {
  args: {
    session: mockSessionData,
    error: 'セッション情報の読み込みに失敗しました。ネットワーク接続を確認してください。',
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const NoImage: Story = {
  args: {
    session: {
      ...mockSessionData,
      thumbnailUrl: undefined,
    },
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const LongContent: Story = {
  args: {
    session: {
      ...mockSessionData,
      title: '超長大なタイトルのセッション：失われた森の古代守護者と七つの試練を乗り越える壮大な冒険の物語',
      overview: `${mockSessionData.overview}

さらに詳細な背景設定として、この森は古代エルフ王国の最後の聖域であり、長年にわたって外界から隔離されてきました。森の中央には世界樹と呼ばれる巨大な樹木があり、その根元には古代の魔法陣が刻まれています。

守護者は元々は森の精霊でしたが、長い年月の中で物質界に縛られ、半物質化した存在となっています。彼の記憶は断片的で、時として冒険者を試し、時として助けることがあります。

このシナリオでは、プレイヤーの選択によって森の運命だけでなく、守護者自身の運命も変わります。真のエンディングを迎えるためには、単なる謎解きだけでなく、登場人物の心情を理解し、適切な判断を下すことが求められます。

全体で約3-4時間のプレイ時間を想定しており、中断・再開にも対応しています。初心者から上級者まで楽しめる設計となっています。`,
      tags: ['ファンタジー', '探索', '初心者歓迎', '選択重視', 'エルフ', '精霊', '長時間', '中断可能'],
    },
    onJoinSession: (sessionId: string) => console.log('セッション参加:', sessionId),
    onBack: () => console.log('戻る'),
  },
};

export const StatusComparison: Story = {
  render: () => (
    <div className="space-y-8 bg-gray-100 p-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">参加者募集中（Available）</h3>
        <div className="border rounded-lg overflow-hidden">
          <SessionDetailView
            session={mockSessionData}
            onJoinSession={(sessionId) => console.log('参加:', sessionId)}
            onBack={() => console.log('戻る')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">進行中（Ongoing）</h3>
        <div className="border rounded-lg overflow-hidden">
          <SessionDetailView
            session={ongoingSessionData}
            onJoinSession={(sessionId) => console.log('参加:', sessionId)}
            onBack={() => console.log('戻る')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">完了済み（Completed）</h3>
        <div className="border rounded-lg overflow-hidden">
          <SessionDetailView
            session={completedSessionData}
            onJoinSession={(sessionId) => console.log('参加:', sessionId)}
            onBack={() => console.log('戻る')}
          />
        </div>
      </div>
    </div>
  ),
};