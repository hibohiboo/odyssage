import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionListLoader } from './sessionListLoader';

// apiClientのモック化
vi.mock('../../../shared/api/client', () => ({
  apiClient: {
    api: {
      sessions: {
        $get: vi.fn(),
      },
    },
  },
}));

describe('sessionListLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('APIからのセッションデータを正しく取得できる', async () => {
    // テスト用のセッションデータ
    const mockSessions = [
      {
        id: '1',
        name: 'テストセッション1',
        gm: 'テストGM',
        players: 2,
        maxPlayers: 5,
        status: 'NotStarted',
        createdAt: '2025-04-01T00:00:00Z',
      },
    ];

    // Honoクライアントのモック化
    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockSessions),
    };
    
    // モックapiclientを取得
    const { apiClient } = await import('../../../shared/api/client');
    (apiClient.api.sessions.$get as vi.Mock).mockResolvedValue(mockResponse);

    // 関数の実行
    const result = await sessionListLoader();

    // apiClient.api.sessions.$get が呼び出されたか確認
    expect(apiClient.api.sessions.$get).toHaveBeenCalled();

    // 結果が期待通りか確認
    expect(result).toEqual(mockSessions);
  });

  it('APIエラー時に空の配列を返す', async () => {
    // Honoクライアントのエラーをモック化
    const { apiClient } = await import('../../../shared/api/client');
    (apiClient.api.sessions.$get as vi.Mock).mockRejectedValue(new Error('API error'));

    // コンソールエラーをモック化して警告を抑制
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // 関数の実行
    const result = await sessionListLoader();

    // コンソールエラーが呼ばれたか確認
    expect(consoleSpy).toHaveBeenCalled();

    // 空の配列が返されたか確認
    expect(result).toEqual([]);

    consoleSpy.mockRestore();
  });
});
