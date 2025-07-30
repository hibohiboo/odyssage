import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScenarioWithGraphMutation } from './useScenarioWithGraphMutation';

// 依存関係をモック
vi.mock('./useScenarioCreateMutation', () => ({
  useScenarioCreateMutation: vi.fn(),
}));

vi.mock('./useGraphScenarioMutation', () => ({
  useGraphScenarioMutation: vi.fn(),
}));

describe('useScenarioWithGraphMutation', () => {
  const mockUid = 'test-user-id';
  const mockScenarioData = {
    title: 'テストシナリオ',
    overview: 'テスト用の概要',
  };

  const mockScenarioCreateMutation = {
    trigger: vi.fn(),
    isMutating: false,
    error: undefined,
  };

  const mockGraphScenarioMutation = {
    trigger: vi.fn(),
    isMutating: false,
    error: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const { useScenarioCreateMutation } = require('./useScenarioCreateMutation');
    const { useGraphScenarioMutation } = require('./useGraphScenarioMutation');
    
    useScenarioCreateMutation.mockReturnValue(mockScenarioCreateMutation);
    useGraphScenarioMutation.mockReturnValue(mockGraphScenarioMutation);
  });

  it('RDBとGraphDB両方にシナリオが正常に作成されること', async () => {
    // RDB作成成功のモック
    const rdbResponse = {
      id: 'created-scenario-id',
      title: mockScenarioData.title,
      overview: mockScenarioData.overview,
    };
    mockScenarioCreateMutation.trigger.mockResolvedValue(rdbResponse);

    // GraphDB作成成功のモック
    const graphResponse = {
      id: 'created-scenario-id',
      title: mockScenarioData.title,
      overview: mockScenarioData.overview,
    };
    mockGraphScenarioMutation.trigger.mockResolvedValue(graphResponse);

    const { result } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    let response;
    await act(async () => {
      response = await result.current.createScenario(mockScenarioData);
    });

    // RDBとGraphDB両方が呼び出されることを確認
    expect(mockScenarioCreateMutation.trigger).toHaveBeenCalledWith(mockScenarioData);
    expect(mockGraphScenarioMutation.trigger).toHaveBeenCalledWith({
      title: mockScenarioData.title,
      overview: mockScenarioData.overview,
    });

    // レスポンスの確認
    expect(response).toEqual({
      scenario: rdbResponse,
      graphSaved: true,
    });
  });

  it('RDB作成失敗時にGraphDBは呼び出されず、エラーがスローされること', async () => {
    // RDB作成失敗のモック
    const rdbError = new Error('RDB creation failed');
    mockScenarioCreateMutation.trigger.mockRejectedValue(rdbError);

    const { result } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    await act(async () => {
      try {
        await result.current.createScenario(mockScenarioData);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(rdbError);
      }
    });

    // RDBのみ呼び出され、GraphDBは呼び出されないことを確認
    expect(mockScenarioCreateMutation.trigger).toHaveBeenCalled();
    expect(mockGraphScenarioMutation.trigger).not.toHaveBeenCalled();
  });

  it('RDB成功・GraphDB失敗時でもユーザーには成功として返すこと', async () => {
    // RDB作成成功のモック
    const rdbResponse = {
      id: 'created-scenario-id',
      title: mockScenarioData.title,
      overview: mockScenarioData.overview,
    };
    mockScenarioCreateMutation.trigger.mockResolvedValue(rdbResponse);

    // GraphDB作成失敗のモック
    const graphError = new Error('GraphDB creation failed');
    mockGraphScenarioMutation.trigger.mockRejectedValue(graphError);

    const { result } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    let response;
    await act(async () => {
      response = await result.current.createScenario(mockScenarioData);
    });

    // 両方とも呼び出されることを確認
    expect(mockScenarioCreateMutation.trigger).toHaveBeenCalled();
    expect(mockGraphScenarioMutation.trigger).toHaveBeenCalled();

    // RDB成功、GraphDB失敗として返されることを確認
    expect(response).toEqual({
      scenario: rdbResponse,
      graphSaved: false,
    });
  });

  it('ローディング状態が正しく管理されること', () => {
    // ローディング中の状態をモック
    mockScenarioCreateMutation.isMutating = true;
    mockGraphScenarioMutation.isMutating = false;

    const { result } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    // いずれかがローディング中の場合、全体がローディング中
    expect(result.current.isLoading).toBe(true);

    // 両方ともローディング中でない場合
    mockScenarioCreateMutation.isMutating = false;
    mockGraphScenarioMutation.isMutating = false;

    const { result: result2 } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    expect(result2.current.isLoading).toBe(false);
  });

  it('エラー状態が正しく管理されること', () => {
    const rdbError = new Error('RDB error');
    mockScenarioCreateMutation.error = rdbError;
    mockGraphScenarioMutation.error = undefined;

    const { result } = renderHook(() =>
      useScenarioWithGraphMutation({ uid: mockUid })
    );

    // RDBエラーが優先されることを確認
    expect(result.current.error).toBe(rdbError);
  });
});