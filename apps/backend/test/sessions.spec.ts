// テスト対象のモジュールをインポートする前に、先にモックを設定する
import * as selectQueries from '@odyssage/database/src/queries/select';
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
} from 'cloudflare:test';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// テスト対象のモジュールをモック設定の後にインポート
import worker from '../src/index';

// モックを設定
vi.mock('@odyssage/database/src/queries/select', () => ({
  getSessions: vi.fn(),
  getSessionById: vi.fn(),
  getSessionsByGmId: vi.fn(),
  getScenarios: vi.fn(),
  getScenariosByid: vi.fn(),
  getPublicScenarios: vi.fn(),
}));

describe('Sessions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/sessions', () => {
    it('公開セッション一覧を取得できること', async () => {
      // モックデータを設定
      const mockSessions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'テストセッション1',
          status: '募集中',
          gmId: 'user123',
          gmName: 'テストGM',
          scenarioId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date('2025-04-01T10:00:00Z'),
          updatedAt: new Date('2025-04-01T10:00:00Z'),
          scenarioTitle: 'テストシナリオ1',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'テストセッション2',
          status: '進行中',
          gmId: 'user456',
          gmName: '別のGM',
          scenarioId: '123e4567-e89b-12d3-a456-426614174003',
          createdAt: new Date('2025-04-02T10:00:00Z'),
          updatedAt: new Date('2025-04-02T10:00:00Z'),
          scenarioTitle: 'テストシナリオ2',
        },
      ];

      // モック関数の戻り値を設定
      selectQueries.getSessions = vi.fn().mockResolvedValue(mockSessions);

      // リクエストを実行
      const request = new Request<unknown, IncomingRequestCfProperties>(
        'http://example.com/api/sessions',
      );
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      // レスポンスの検証
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      // レスポンスのフォーマットを確認
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(2);

      // 期待する形式のデータが返されることを確認
      expect(responseBody[0]).toHaveProperty('id');
      expect(responseBody[0]).toHaveProperty('name');
      expect(responseBody[0]).toHaveProperty('gm');
      expect(responseBody[0]).toHaveProperty('players');
      expect(responseBody[0]).toHaveProperty('maxPlayers');
      expect(responseBody[0]).toHaveProperty('status');
      expect(responseBody[0]).toHaveProperty('createdAt');

      // getSessions関数が正しく呼び出されたことを確認
      expect(selectQueries.getSessions).toHaveBeenCalledWith(
        expect.any(String),
        undefined,
      );
    });

    it('GMがリクエストした場合、自分の非公開セッションも取得できること', async () => {
      // GMのIDを指定
      const gmId = 'user123';

      // モックデータを設定（GMの非公開セッションを含む）
      const mockSessions = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'テストセッション1',
          status: '募集中',
          gmId,
          gmName: 'テストGM',
          scenarioId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date('2025-04-01T10:00:00Z'),
          updatedAt: new Date('2025-04-01T10:00:00Z'),
          scenarioTitle: 'テストシナリオ1',
        },
      ];

      // モック関数の戻り値を設定
      selectQueries.getSessions = vi.fn().mockResolvedValue(mockSessions);

      // GM IDをクエリパラメータとして渡す
      const request = new Request<unknown, IncomingRequestCfProperties>(
        `http://example.com/api/sessions?gm_id=${gmId}`,
      );

      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      // レスポンスの検証
      expect(response.status).toBe(200);
      const responseBody = await response.json();

      // 期待する形式のデータが返されることを確認
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(1);

      // getSessions関数がGM IDで呼び出されたことを確認
      expect(selectQueries.getSessions).toHaveBeenCalledWith(
        expect.any(String),
        gmId,
      );
    });

    it('エラー時に適切なレスポンスを返すこと', async () => {
      // モック関数でエラーをスローするように設定
      selectQueries.getSessions = vi
        .fn()
        .mockRejectedValue(new Error('Database error'));

      // リクエストを実行
      const request = new Request<unknown, IncomingRequestCfProperties>(
        'http://example.com/api/sessions',
      );
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      // レスポンスの検証
      expect(response.status).toBe(500);
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('message');
      expect(responseBody.message).toContain(
        'セッション一覧の取得に失敗しました',
      );
    });
  });
});
