import { describe, expect, it, beforeEach } from 'vitest';
import { setupTestEnv } from './test-utils';

describe('GraphDBシーン一括更新統合テスト', () => {
  const testScenarioId = '550e8400-e29b-41d4-a716-446655440000';
  const defaultScenes = [
    { title: 'オープニング', overview: '冒険の始まり', order: 0 },
    { title: '戦闘シーン', overview: 'モンスターとの戦い', order: 1 },
    { title: 'エンディング', overview: '冒険の終わり', order: 2 },
  ];

  const { getApp, getEnv } = setupTestEnv();
  let app: ReturnType<typeof getApp>;

  beforeEach(() => {
    app = getApp();
  });

  /** PUT: シーン一括更新 */
  const batchUpdateScenes = (scenarioId: string, scenes: any[]) =>
    app.request(
      `/api/graph-scenes/scenario/${scenarioId}/batch`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes }),
      },
      getEnv(),
    );

  /** GET: シーン一覧取得 */
  const getScenes = (scenarioId: string) =>
    app.request(
      `/api/graph-scenes/scenario/${scenarioId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      getEnv(),
    );

  /** テスト用大量データ生成 */
  const generateScenes = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      title: `シーン${i + 1}`,
      overview: `シーン${i + 1}の概要説明`,
      order: i,
    }));

  it('正常に一括更新できる', async () => {
    const res = await batchUpdateScenes(testScenarioId, defaultScenes);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.scenes).toHaveLength(3);
    expect(data.summary.totalScenes).toBe(3);

    data.scenes.forEach((scene: any, i: number) => {
      expect(scene.title).toBe(defaultScenes[i].title);
      expect(scene.order).toBe(defaultScenes[i].order);
      expect(scene.scenarioId).toBe(testScenarioId);
    });
  });

  it('空配列で更新すると全削除される', async () => {
    await batchUpdateScenes(testScenarioId, defaultScenes);
    const res = await batchUpdateScenes(testScenarioId, []);
    const data = await res.json();
    expect(data.scenes).toHaveLength(0);
    expect(data.summary.totalScenes).toBe(0);
  });

  it('必須フィールド不足は400エラー', async () => {
    const res = await batchUpdateScenes(testScenarioId, [
      { overview: '概要', order: 0 },
    ]);
    expect(res.status).toBe(400);
  });

  it('不正なUUIDは400エラー', async () => {
    const res = await batchUpdateScenes('invalid-uuid', defaultScenes);
    expect(res.status).toBe(400);
  });

  it('存在しないシナリオIDは404エラー', async () => {
    const id = '770e8400-e29b-41d4-a716-446655440000';
    const res = await batchUpdateScenes(id, defaultScenes);
    const data = await res.json();
    expect(res.status).toBe(404);
    expect(data.error).toBe('Scenario not found');
  });

  it('一括更新後に個別取得で一致する', async () => {
    const batchRes = await batchUpdateScenes(testScenarioId, defaultScenes);
    const listRes = await getScenes(testScenarioId);

    const batchData = await batchRes.json();
    const listData = await listRes.json();

    expect(listData).toHaveLength(batchData.scenes.length);
    expect(listData.map((s: any) => s.title)).toEqual(
      batchData.scenes.map((s: any) => s.title),
    );
  });

  it('50件でも正常に更新でき順序も保持される', async () => {
    const largeScenes = generateScenes(50);
    const res = await batchUpdateScenes(testScenarioId, largeScenes);
    const data = await res.json();

    expect(data.scenes).toHaveLength(50);
    data.scenes.forEach((scene: any, i: number) => {
      expect(scene.order).toBe(i);
      expect(scene.title).toBe(`シーン${i + 1}`);
    });
  });
});
