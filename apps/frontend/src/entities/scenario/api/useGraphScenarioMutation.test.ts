import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGraphScenarioMutation } from './useGraphScenarioMutation';

// APIクライアントをモック
vi.mock('@odyssage/frontend/shared/api/client', () => ({
  apiClient: {
    api: {
      'graph-scenarios': {
        ':id': {
          $put: vi.fn(),
        },
      },
    },
  },
}));

describe('useGraphScenarioMutation', () => {
  const mockScenarioId = 'test-scenario-id';
  const mockScenarioData = {
    title: 'テストシナリオ',
    overview: 'テスト用の概要',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GraphDBシナリオ作成が成功すること', async () => {
    // モックレスポンスの設定
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        id: mockScenarioId,
        title: mockScenarioData.title,
        overview: mockScenarioData.overview,
      }),
    };

    const { apiClient } = await import('@odyssage/frontend/shared/api/client');
    (apiClient.api['graph-scenarios'][':id'].$put as any).mockResolvedValue(mockResponse);

    // フックをレンダリング
    const { result } = renderHook(() =>
      useGraphScenarioMutation({ scenarioId: mockScenarioId })
    );

    // 初期状態の確認
    expect(result.current.isMutating).toBe(false);
    expect(result.current.error).toBeUndefined();

    // mutation実行
    await act(async () => {
      const response = await result.current.trigger(mockScenarioData);
      expect(response).toEqual({
        id: mockScenarioId,
        title: mockScenarioData.title,
        overview: mockScenarioData.overview,
      });
    });

    // APIが正しいパラメータで呼び出されたことを確認
    expect(apiClient.api['graph-scenarios'][':id'].$put).toHaveBeenCalledWith({
      param: { id: mockScenarioId },
      json: mockScenarioData,
    });
  });

  it('GraphDBシナリオ作成が失敗した場合にエラーがスローされること', async () => {
    // エラーレスポンスの設定
    const mockResponse = {
      ok: false,
      status: 500,
    };

    const { apiClient } = await import('@odyssage/frontend/shared/api/client');
    (apiClient.api['graph-scenarios'][':id'].$put as any).mockResolvedValue(mockResponse);

    // フックをレンダリング
    const { result } = renderHook(() =>
      useGraphScenarioMutation({ scenarioId: mockScenarioId })
    );

    // エラーケースのテスト
    await act(async () => {
      try {
        await result.current.trigger(mockScenarioData);
        // ここに到達したらテスト失敗
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Failed to create/update graph scenario');
      }
    });
  });

  it('異なるシナリオIDで別のインスタンスが作成されること', () => {
    const scenarioId1 = 'scenario-1';
    const scenarioId2 = 'scenario-2';

    const { result: result1 } = renderHook(() =>
      useGraphScenarioMutation({ scenarioId: scenarioId1 })
    );

    const { result: result2 } = renderHook(() =>
      useGraphScenarioMutation({ scenarioId: scenarioId2 })
    );

    // 異なるインスタンスであることを確認
    expect(result1.current).not.toBe(result2.current);
  });

  it('バリデーションエラーレスポンスが適切に処理されること', async () => {
    // バリデーションエラーレスポンスの設定
    const mockResponse = {
      ok: false,
      status: 400,
    };

    const { apiClient } = await import('@odyssage/frontend/shared/api/client');
    (apiClient.api['graph-scenarios'][':id'].$put as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useGraphScenarioMutation({ scenarioId: mockScenarioId })
    );

    // バリデーションエラーのテスト
    await act(async () => {
      try {
        await result.current.trigger({
          title: '', // 不正な空文字
          overview: mockScenarioData.overview,
        });
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Failed to create/update graph scenario');
      }
    });
  });
});