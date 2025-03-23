import { ScenarioDetailPage } from '@odyssage/ui/page-ui';

const DetailPage = () => (
  <ScenarioDetailPage
    scenario={{
      id: '1',
      title: '失われた遺跡の秘宝',
      description:
        '古代文明の遺跡で眠る秘宝を求めて冒険者たちが集まる。しかし、遺跡には古代の呪いが潜んでいた。あなたは秘宝を手に入れることができるだろうか？それとも呪いに飲み込まれてしまうのか？',
      updatedAt: '2024-03-20',
      status: 'private',
      tags: [],
      isStockedByGM: false,
      gmCount: 0,
      nodes: [],
      connections: [],
    }}
  />
);

export default DetailPage;
