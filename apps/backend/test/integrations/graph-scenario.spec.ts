import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';
/**
 * GraphDBシナリオ関連のエンドポイントに対する統合テスト
 * Neo4jのテストコンテナを使用してGraphDB操作を含む統合テストを実行します
 */
describe('GraphDBシナリオ統合テスト', () => {
  const testScenarioId = '550e8400-e29b-41d4-a716-446655440000';
  const validScenario = {
    title: 'テストシナリオ',
    overview: 'これはテスト用のシナリオです。GraphDBに保存されます。',
  };
  const updatedScenario = {
    title: '更新されたテストシナリオ',
    overview: 'これは更新されたシナリオの概要です。',
  };

  const { getApp, getEnv } = setupTestEnv();
  let app: ReturnType<typeof getApp>;

  beforeEach(() => {
    app = getApp();
    // GraphDBのクリーンアップ処理は今後実装予定
  });

  /** GraphDBシナリオをPUTで作成・更新する共通関数 */
  const putScenario = async (data: Record<string, any>) =>
    app.request(
      `/api/graph-scenarios/${testScenarioId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      getEnv(),
    );

  it('GraphDBにシナリオを作成できる', async () => {
    const res = await putScenario(validScenario);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: testScenarioId, ...validScenario });
  });

  it('GraphDBシナリオを更新できる', async () => {
    await putScenario(validScenario); // 事前作成
    const res = await putScenario(updatedScenario);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      id: testScenarioId,
      ...updatedScenario,
    });
  });

  it('空タイトルでバリデーションエラー', async () => {
    const res = await putScenario({ title: '', overview: 'テスト概要' });
    expect(res.status).toBe(400);
  });

  it('長すぎるタイトルでバリデーションエラー', async () => {
    const res = await putScenario({
      title: 'a'.repeat(101),
      overview: 'テスト概要',
    });
    expect(res.status).toBe(400);
  });
});
