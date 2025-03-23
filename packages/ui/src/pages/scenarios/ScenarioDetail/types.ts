// シナリオの状態タイプ
export type ScenarioStatus = 'private' | 'public';

// シナリオデータの型定義
export type ScenarioNode = {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  choices?: { id: string; text: string }[];
  image?: string;
};

export type Connection = {
  id: string;
  from: string;
  to: string;
  choice: string;
};

export type Author = {
  id: string;
  name: string;
  avatar?: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt: string;
  status: ScenarioStatus;
  tags: string[];
  author?: Author;
  difficulty?: string;
  estimatedTime?: string;
  playerCount?: string;
  isStockedByGM: boolean;
  gmCount: number;
  nodes: ScenarioNode[];
  connections: Connection[];
};

// モックデータ
export const scenarioData: Scenario = {
  id: '1',
  title: '失われた遺跡の秘宝',
  description:
    '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが潜んでいた。あなたは秘宝を手に入れることができるだろうか？それとも呪いに飲み込まれてしまうのか？',
  createdAt: '2024-02-15',
  updatedAt: '2024-03-20',
  status: 'private',
  tags: ['ファンタジー', '冒険', '謎解き', '遺跡', '古代文明'],
  author: {
    id: 'author1',
    name: 'ダンジョンマスター',
    avatar: '/placeholder.svg?height=40&width=40',
  },
  difficulty: '普通',
  estimatedTime: '約2時間',
  playerCount: '2〜4人',
  isStockedByGM: false,
  gmCount: 3,
  nodes: [
    {
      id: '1',
      title: '冒険の始まり',
      content:
        'あなたは古代遺跡の入り口に立っています。苔むした石柱が両側に並び、不気味な雰囲気を醸し出しています。入り口の奥には暗闇が広がっています。',
      position: { x: 300, y: 100 },
      choices: [
        { id: 'c1', text: '松明を灯して中に入る' },
        { id: 'c2', text: '入り口周辺を調査する' },
        { id: 'c3', text: '引き返す' },
      ],
      image: '/placeholder.svg?height=200&width=300',
    },
    {
      id: '2',
      title: '遺跡内部',
      content:
        '松明の光が壁に描かれた古代の壁画を照らし出します。廊下は二手に分かれており、左側からは水の滴る音が、右側からはかすかな風が感じられます。',
      position: { x: 600, y: 50 },
      choices: [
        { id: 'c4', text: '左の通路へ進む' },
        { id: 'c5', text: '右の通路へ進む' },
      ],
    },
    {
      id: '3',
      title: '遺跡の周辺',
      content:
        '入り口周辺を調査すると、地面に何かの足跡を発見しました。また、壁には奇妙な記号が刻まれています。',
      position: { x: 600, y: 250 },
      choices: [
        { id: 'c6', text: '足跡を追跡する' },
        { id: 'c7', text: '記号を詳しく調べる' },
        { id: 'c8', text: '遺跡内に入る' },
      ],
    },
    {
      id: '4',
      title: '村への帰還',
      content:
        '危険を感じて引き返すことにしました。村に戻り、発見したことを報告します。',
      position: { x: 600, y: 450 },
      choices: [
        { id: 'c9', text: '冒険家ギルドに報告する' },
        { id: 'c10', text: '村長に報告する' },
      ],
    },
    {
      id: '5',
      title: '水の通路',
      content:
        '左の通路を進むと、小さな地下水路に出ました。水は膝ほどの深さで、奥へと続いています。',
      position: { x: 900, y: 0 },
      choices: [
        { id: 'c11', text: '水路を進む' },
        { id: 'c12', text: '引き返す' },
      ],
    },
  ],
  connections: [
    { id: 'conn1', from: '1', to: '2', choice: 'c1' },
    { id: 'conn2', from: '1', to: '3', choice: 'c2' },
    { id: 'conn3', from: '1', to: '4', choice: 'c3' },
    { id: 'conn4', from: '2', to: '5', choice: 'c4' },
  ],
};
