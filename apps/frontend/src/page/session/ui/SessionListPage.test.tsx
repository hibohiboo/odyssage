import { render, screen } from '@testing-library/react';
import * as reactRouter from 'react-router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SessionListPage from './SessionListPage';

// react-routerをモック
vi.mock('react-router', () => ({
  useLoaderData: vi.fn(),
}));

describe('SessionListPage', () => {
  // モック関数の参照を取得
  // react-routerモジュールを手動でインポートして実装を置き換える
  const mockUseLoaderData = vi.mocked(reactRouter.useLoaderData);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('セッションがない場合に適切なメッセージが表示される', () => {
    // モック値を設定
    mockUseLoaderData.mockReturnValue([]);

    // コンポーネントをレンダリング
    render(<SessionListPage />);

    // 「セッションがありません」メッセージが表示されることを確認
    expect(screen.getByText('セッションがありません')).toBeInTheDocument();
  });

  it('セッションデータが正しく表示される', () => {
    // モックのセッションデータ
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
      {
        id: '2',
        name: 'テストセッション2',
        gm: 'テストGM2',
        players: 0,
        maxPlayers: 4,
        status: 'InProgress',
        createdAt: '2025-04-02T00:00:00Z',
      },
    ];

    // モック値を設定
    mockUseLoaderData.mockReturnValue(mockSessions);

    // コンポーネントをレンダリング
    render(<SessionListPage />);

    // セッションタイトルが表示されていることを確認
    expect(screen.getByText('テストセッション1')).toBeInTheDocument();
    expect(screen.getByText('テストセッション2')).toBeInTheDocument();

    // GMが表示されていることを確認
    expect(screen.getByText('GM: テストGM')).toBeInTheDocument();
    expect(screen.getByText('GM: テストGM2')).toBeInTheDocument();

    // プレイヤー数が表示されていることを確認
    expect(screen.getByText('プレイヤー: 2/5')).toBeInTheDocument();
    expect(screen.getByText('プレイヤー: 0/4')).toBeInTheDocument();

    // ステータスが表示されていることを確認
    expect(screen.getByText('NotStarted')).toBeInTheDocument();
    expect(screen.getByText('InProgress')).toBeInTheDocument();
  });
});
