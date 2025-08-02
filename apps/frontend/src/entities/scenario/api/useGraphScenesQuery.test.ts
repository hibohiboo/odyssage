import { renderHook } from '@testing-library/react';
import useSWR from 'swr';
import { describe, test, vi, expect, beforeEach } from 'vitest';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { useGraphScenesQuery } from './useGraphScenesQuery';

// APIクライアントのモック
vi.mock('@odyssage/frontend/shared/api/client', () => ({
  apiClient: {
    api: {
      'graph-scenes': {
        scenario: {
          ':scenarioId': {
            $get: vi.fn(),
          },
        },
      },
    },
  },
}));

// SWRのモック
vi.mock('swr', () => ({
  default: vi.fn(),
}));

const mockUseSWR = vi.mocked(useSWR);
const mockApiGet = vi.mocked(
  apiClient.api['graph-scenes'].scenario[':scenarioId'].$get,
);

describe('useGraphScenesQuery Hook Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hook初期化・設定', () => {
    test('scenarioIdが存在する場合、適切なキーでデータ取得を開始する', () => {
      const scenarioId = 'test-scenario-123';
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: vi.fn(),
      } as any);

      renderHook(() => useGraphScenesQuery({ scenarioId }));

      expect(mockUseSWR).toHaveBeenCalledWith(
        `api/graph-scenes/scenario/${scenarioId}`,
        expect.any(Function),
        {
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
        },
      );
    });

    test('scenarioIdが存在しない場合、データ取得を実行しない', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: vi.fn(),
      } as any);

      renderHook(() => useGraphScenesQuery({ scenarioId: '' }));

      expect(mockUseSWR).toHaveBeenCalledWith(null, expect.any(Function), {
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      });
    });
  });

  describe('APIデータ取得処理', () => {
    test('正常な場合：APIからシーンデータを取得し、JSONとして返す', async () => {
      const mockScenes = [
        {
          id: 'scene-1',
          title: 'テストシーン1',
          overview: 'テスト概要1',
          scenarioId: 'scenario-123',
          order: 1,
        },
      ];

      mockApiGet.mockResolvedValue({
        ok: true,
        json: async () => mockScenes,
      } as any);

      let fetcherFunction: any;
      mockUseSWR.mockImplementation((_key, fetcher, _options) => {
        fetcherFunction = fetcher;
        return {
          data: undefined,
          error: undefined,
          isLoading: true,
          mutate: vi.fn(),
        } as any;
      });

      renderHook(() => useGraphScenesQuery({ scenarioId: 'scenario-123' }));

      const result = await fetcherFunction();
      expect(result).toEqual(mockScenes);
      expect(mockApiGet).toHaveBeenCalledWith({
        param: { scenarioId: 'scenario-123' },
      });
    });

    test('API応答がok=falseの場合：エラーメッセージをthrowする', async () => {
      mockApiGet.mockResolvedValue({
        ok: false,
        status: 500,
      } as any);

      let fetcherFunction: any;
      mockUseSWR.mockImplementation((_key, fetcher, _options) => {
        fetcherFunction = fetcher;
        return {
          data: undefined,
          error: undefined,
          isLoading: true,
          mutate: vi.fn(),
        } as any;
      });

      renderHook(() => useGraphScenesQuery({ scenarioId: 'scenario-123' }));

      await expect(fetcherFunction()).rejects.toThrow('Failed to fetch scenes');
    });

    test('ネットワークエラーの場合：元のエラーをそのままthrowする', async () => {
      const networkError = new Error('Network connection failed');
      mockApiGet.mockRejectedValue(networkError);

      let fetcherFunction: any;
      mockUseSWR.mockImplementation((_key, fetcher, _options) => {
        fetcherFunction = fetcher;
        return {
          data: undefined,
          error: undefined,
          isLoading: true,
          mutate: vi.fn(),
        } as any;
      });

      renderHook(() => useGraphScenesQuery({ scenarioId: 'scenario-123' }));

      await expect(fetcherFunction()).rejects.toThrow(
        'Network connection failed',
      );
    });
  });

  describe('Hook戻り値・状態管理', () => {
    test('データ取得中：isLoadingがtrueを返す', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: vi.fn(),
      } as any);

      const { result } = renderHook(() =>
        useGraphScenesQuery({ scenarioId: 'scenario-123' }),
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    test('データ取得成功：dataにシーンリストが格納される', () => {
      const mockScenes = [
        {
          id: 'scene-1',
          title: 'テストシーン1',
          overview: 'テスト概要1',
          scenarioId: 'scenario-123',
          order: 1,
        },
      ];

      mockUseSWR.mockReturnValue({
        data: mockScenes,
        error: undefined,
        isLoading: false,
        mutate: vi.fn(),
      } as any);

      const { result } = renderHook(() =>
        useGraphScenesQuery({ scenarioId: 'scenario-123' }),
      );

      expect(result.current.data).toEqual(mockScenes);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    test('データ取得失敗：errorにエラー情報が格納される', () => {
      const mockError = new Error('Fetch failed');

      mockUseSWR.mockReturnValue({
        data: undefined,
        error: mockError,
        isLoading: false,
        mutate: vi.fn(),
      } as any);

      const { result } = renderHook(() =>
        useGraphScenesQuery({ scenarioId: 'scenario-123' }),
      );

      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    test('SWRのmutate関数が適切に公開される', () => {
      const mockMutate = vi.fn();

      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: mockMutate,
      } as any);

      const { result } = renderHook(() =>
        useGraphScenesQuery({ scenarioId: 'scenario-123' }),
      );

      expect(result.current.mutate).toBe(mockMutate);
    });
  });
});
