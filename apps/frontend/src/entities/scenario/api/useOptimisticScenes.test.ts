import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOptimisticScenes, type Scene } from './useOptimisticScenes';

// SWRのmutateをモック
vi.mock('swr', () => ({
  mutate: vi.fn(),
}));

// APIクライアントをモック
vi.mock('@odyssage/frontend/shared/api/client', () => ({
  apiClient: {
    api: {
      'graph-scenes': {
        scenario: {
          ':scenarioId': {
            batch: {
              $put: vi.fn(),
            },
          },
        },
      },
    },
  },
}));

// UUID生成をモック
vi.mock('@odyssage/frontend/shared/lib/uuid/createUUID', () => ({
  generateUuid: vi.fn(() => 'mock-uuid-123'),
}));

describe('useOptimisticScenes', () => {
  const mockScenarioId = 'test-scenario-id';
  const mockInitialScenes: Scene[] = [
    {
      id: 'scene-1',
      title: 'シーン1',
      overview: '概要1',
      scenarioId: mockScenarioId,
      order: 0,
    },
    {
      id: 'scene-2',
      title: 'シーン2',
      overview: '概要2',
      scenarioId: mockScenarioId,
      order: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    expect(result.current.scenes).toEqual(mockInitialScenes);
    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.isLoadingBatch).toBe(false);
  });

  it('楽観的作成が正しく動作すること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    act(() => {
      result.current.optimisticCreate({
        title: '新シーン',
        overview: '新概要',
        order: 2,
      });
    });

    expect(result.current.scenes).toHaveLength(3);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.scenes[2]).toEqual({
      id: 'temp_mock-uuid-123',
      title: '新シーン',
      overview: '新概要',
      order: 2,
      scenarioId: mockScenarioId,
    });
  });

  it('楽観的更新が正しく動作すること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    act(() => {
      result.current.optimisticUpdate('scene-1', {
        title: '更新シーン1',
        overview: '更新概要1',
      });
    });

    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.scenes[0]).toEqual({
      id: 'scene-1',
      title: '更新シーン1',
      overview: '更新概要1',
      scenarioId: mockScenarioId,
      order: 0,
    });
  });

  it('楽観的削除が正しく動作すること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    act(() => {
      result.current.optimisticDelete('scene-1');
    });

    expect(result.current.scenes).toHaveLength(1);
    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.scenes[0].id).toBe('scene-2');
  });

  it('変更を破棄すると元の状態に戻ること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    // 複数の変更を実行
    act(() => {
      result.current.optimisticCreate({
        title: '新シーン',
        overview: '新概要',
        order: 2,
      });
      result.current.optimisticUpdate('scene-1', { title: '更新タイトル' });
      result.current.optimisticDelete('scene-2');
    });

    expect(result.current.hasUnsavedChanges).toBe(true);
    expect(result.current.scenes).toHaveLength(2); // 1つ削除、1つ追加

    // 変更を破棄
    act(() => {
      result.current.discardAllChanges();
    });

    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.scenes).toEqual(mockInitialScenes);
  });

  it('サーバーデータでリフレッシュできること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, mockInitialScenes)
    );

    // 変更を加える
    act(() => {
      result.current.optimisticCreate({
        title: '新シーン',
        overview: '新概要',
        order: 2,
      });
    });

    expect(result.current.hasUnsavedChanges).toBe(true);

    // サーバーデータでリフレッシュ
    const newServerData: Scene[] = [
      {
        id: 'scene-3',
        title: 'サーバーシーン',
        overview: 'サーバー概要',
        scenarioId: mockScenarioId,
        order: 0,
      },
    ];

    act(() => {
      result.current.refreshFromServer(newServerData);
    });

    expect(result.current.hasUnsavedChanges).toBe(false);
    expect(result.current.scenes).toEqual(newServerData);
  });

  it('順序が正しくソートされること', () => {
    const { result } = renderHook(() =>
      useOptimisticScenes(mockScenarioId, [])
    );

    // 逆順で追加
    act(() => {
      result.current.optimisticCreate({
        title: 'シーン3',
        overview: '概要3',
        order: 2,
      });
      result.current.optimisticCreate({
        title: 'シーン1',
        overview: '概要1',
        order: 0,
      });
      result.current.optimisticCreate({
        title: 'シーン2',
        overview: '概要2',
        order: 1,
      });
    });

    // order順にソートされていることを確認
    expect(result.current.scenes[0].title).toBe('シーン1');
    expect(result.current.scenes[1].title).toBe('シーン2');
    expect(result.current.scenes[2].title).toBe('シーン3');
  });
});