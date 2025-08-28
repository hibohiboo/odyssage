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
        component: 'セッション詳細画面Organism。session-detail.md設計に基づくヒーローセクション・詳細情報・参加CTA統合Component。\n\n**画面設計対応**: ヒーローセクション・詳細情報・参加確認フロー・レスポンシブレイアウト実装。\n\n**データ連携**: SessionDataService モックデータと統合、BDDテスト（session-joining.feature）対応。',
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

// サンプルデータ - SessionDataService のモックデータと整合性保持
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

// BDDテスト用データ - SessionDataService.MOCK_SESSIONS と同じ内容
const bddTestSessionData: SessionDetailData = {
  sessionId: 'test-session-join',
  title: 'テストセッション（参加用）',
  scenarioSummary: '魔法の森の冒険シナリオをプレイ',
  overview: 'このセッションでは「魔法の森の冒険」シナリオをプレイします。\n\n古い森に隠された謎を解き明かし、仲間と協力して困難を乗り越える冒険が待っています。初心者の方でも楽しめる内容となっております。\n\nステータス: 参加者募集中',
  status: 'available',
  thumbnailUrl: 'https://dummyimage.com/800x450/16a34a/ffffff?text=Magic+Forest',
  tags: ['TRPG', 'オンラインセッション', '初心者歓迎'],
  author: {
    name: 'テストGM',
  },
  createdAt: '2025-08-26T00:00:00.000Z',
};

// SessionDataService モックデータに対応
const ongoingSessionData: SessionDetailData = {
  sessionId: 'session-ongoing-test',
  title: '進行中セッション',
  scenarioSummary: '都市の謎解きシナリオをプレイ',
  overview: 'このセッションでは「都市の謎解き」シナリオをプレイします。\n\n現代都市を舞台にした謎解きとサスペンスが展開される物語です。プレイヤーの推理力と判断力が試されます。\n\nステータス: 進行中',
  status: 'ongoing',
  thumbnailUrl: 'https://dummyimage.com/800x450/2563eb/ffffff?text=City+Mystery',
  tags: ['TRPG', '謎解き', '中級者向け'],
  author: {
    name: '経験豊富GM',
  },
  createdAt: '2025-08-25T12:00:00.000Z',
};

const completedSessionData: SessionDetailData = {
  sessionId: 'session-completed-test',
  title: '完了済みセッション',
  scenarioSummary: '宇宙船の危機シナリオをプレイ',
  overview: 'このセッションでは「宇宙船の危機」シナリオをプレイしました。\n\nSF世界を舞台にしたスリルあふれる冒険でした。プレイヤーの皆さんは見事に危機を乗り越え、無事に地球に帰還することができました。\n\nステータス: 完了',
  status: 'completed',
  thumbnailUrl: 'https://dummyimage.com/800x450/dc2626/ffffff?text=Space+Crisis',
  tags: ['TRPG', 'SF', '上級者向け'],
  author: {
    name: 'SF好きGM',
  },
  createdAt: '2025-08-24T18:30:00.000Z',
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

// BDDテスト専用ストーリー - session-joining.feature 対応
export const BDDTestSession: Story = {
  args: {
    session: bddTestSessionData,
    onJoinSession: (sessionId: string) => console.log('BDDテスト - セッション参加:', sessionId),
    onBack: () => console.log('BDDテスト - 戻る'),
  },
  parameters: {
    docs: {
      description: {
        story: 'BDDテスト（session-joining.feature）用のストーリー。SessionDataService のtest-session-joinデータと完全一致。',
      },
    },
  },
};

// 参加確認ダイアログ統合テスト用（将来の拡張）
export const WithJoinConfirmation: Story = {
  args: {
    session: bddTestSessionData,
    onJoinSession: (sessionId: string) => {
      console.log('参加確認ダイアログ表示想定:', sessionId);
      alert(`参加確認ダイアログが表示されます:\n${bddTestSessionData.title}`);
    },
    onBack: () => console.log('戻る'),
  },
  parameters: {
    docs: {
      description: {
        story: '参加確認ダイアログとの統合を想定したストーリー。実際のダイアログはSessionDetailPage側で実装。',
      },
    },
  },
};

export const StatusComparison: Story = {
  render: () => (
    <div className="space-y-8 bg-gray-100 p-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">BDDテストセッション（Available）</h3>
        <div className="border rounded-lg overflow-hidden">
          <SessionDetailView
            session={bddTestSessionData}
            onJoinSession={(sessionId) => console.log('参加:', sessionId)}
            onBack={() => console.log('戻る')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">進行中セッション（Ongoing）</h3>
        <div className="border rounded-lg overflow-hidden">
          <SessionDetailView
            session={ongoingSessionData}
            onJoinSession={(sessionId) => console.log('参加:', sessionId)}
            onBack={() => console.log('戻る')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">完了済みセッション（Completed）</h3>
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
  parameters: {
    docs: {
      description: {
        story: 'SessionDataService の全ステータスタイプの比較表示。実際のモックデータと一致。',
      },
    },
  },
};