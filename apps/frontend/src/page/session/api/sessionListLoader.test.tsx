import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionListLoader } from './sessionListLoader';

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

    // fetchのモック化
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSessions),
      }),
    ) as any;

    // 関数の実行
    const result = await sessionListLoader();

    // fetch関数が正しいURLで呼び出されたか確認
    expect(global.fetch).toHaveBeenCalledWith('/api/sessions');

    // 結果が期待通りか確認
    expect(result).toEqual(mockSessions);
  });

  it('APIエラー時に空の配列を返す', async () => {
    // fetchのエラーをモック化
    global.fetch = vi.fn(() => Promise.reject(new Error('API error'))) as any;

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
