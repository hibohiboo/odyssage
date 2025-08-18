import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaySessionContainer } from '../../../src/page/player/containers/PlaySessionContainer';
import type { Scene } from '@odyssage/schema';

/**
 * PlaySessionContainer 統合テスト
 * テスト戦略: LocalStorageベースMVP機能のE2Eレベル検証
 * 対象範囲: SceneLoader・AutoSaveService・useEventEngine統合動作
 */
describe('PlaySessionContainer統合テスト', () => {
  const TEST_SESSION_ID = 'test-session-001';
  const TEST_STARTING_SCENE_ID = 'scene_01';

  // テスト用のクリーンアップキー
  const CLEANUP_KEYS = [
    'odyssage_scene_cache',
    `odyssage_session_scenes_${TEST_SESSION_ID}`,
    `odyssage_session_state_${TEST_SESSION_ID}`,
    `odyssage_autosave_timestamp_${TEST_SESSION_ID}`,
  ];

  beforeEach(() => {
    // LocalStorageをクリア
    CLEANUP_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    CLEANUP_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
  });

  it('初回セッション開始時の完全フロー', async () => {
    const user = userEvent.setup();

    // コンポーネントをレンダリング
    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    // 初期ローディング表示確認
    expect(screen.getByText('セッションを読み込み中...')).toBeDefined();

    // Scene読み込み完了後の表示確認
    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 5000 }
    );

    // PlaySessionViewが表示されることを確認
    expect(screen.getByRole('main')).toBeDefined();
  });

  it('LocalStorageキャッシュからのScene復元', async () => {
    // 事前にキャッシュデータを設定
    const cachedScenes: Scene[] = [
      {
        id: TEST_STARTING_SCENE_ID,
        title: 'キャッシュされたシーン',
        description: 'テスト用のキャッシュシーン',
        startingEventId: 'event_01',
        events: [
          {
            id: 'event_01',
            type: 'narrative',
            content: 'キャッシュからの復元テスト',
            data: { narrativeText: 'キャッシュからの復元テスト' }
          }
        ]
      }
    ];

    localStorage.setItem(
      `odyssage_session_scenes_${TEST_SESSION_ID}`,
      JSON.stringify(cachedScenes)
    );

    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    // キャッシュからの即座復元確認（モック読み込み待機なし）
    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 1000 } // キャッシュ読み込みは高速
    );

    expect(screen.getByRole('main')).toBeDefined();
  });

  it('Scene読み込みエラー時のエラー表示とリトライ', async () => {
    const user = userEvent.setup();

    // LocalStorageエラーをシミュレート（読み取り専用設定）
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('Storage access denied');
    };

    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    // エラー表示確認
    await waitFor(
      () => {
        expect(screen.getByText('エラーが発生しました')).toBeDefined();
        expect(screen.getByText('シーンデータの読み込みに失敗しました')).toBeDefined();
      },
      { timeout: 2000 }
    );

    // リトライボタン確認
    const retryButton = screen.getByText('再試行');
    expect(retryButton).toBeDefined();

    // LocalStorage復元
    localStorage.getItem = originalGetItem;

    // リトライボタンクリック（window.location.reloadをモック）
    const originalReload = window.location.reload;
    let reloadCalled = false;
    window.location.reload = () => {
      reloadCalled = true;
    };

    await user.click(retryButton);
    expect(reloadCalled).toBe(true);

    window.location.reload = originalReload;
  });

  it('自動保存機能の動作確認', async () => {
    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    // Scene読み込み完了待機
    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 5000 }
    );

    // 自動保存間隔待機（設定: 10秒、テスト用に短縮期待）
    await waitFor(
      () => {
        const sessionStateKey = `odyssage_session_state_${TEST_SESSION_ID}`;
        const savedState = localStorage.getItem(sessionStateKey);
        expect(savedState).toBeDefined();
        
        if (savedState) {
          const parsed = JSON.parse(savedState);
          expect(parsed.sessionId).toBe(TEST_SESSION_ID);
          expect(parsed.lastSaved).toBeDefined();
        }
      },
      { timeout: 15000 } // 自動保存間隔を考慮した十分な時間
    );
  });

  it('無効なstartingSceneIdでのエラーハンドリング', async () => {
    const INVALID_SCENE_ID = 'non-existent-scene';

    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={INVALID_SCENE_ID}
      />
    );

    // エラー表示確認（useEventEngineでのScene不存在エラー）
    await waitFor(
      () => {
        expect(screen.getByText('エラーが発生しました')).toBeDefined();
      },
      { timeout: 5000 }
    );
  });

  it('LocalStorage容量制限対応', async () => {
    // 容量制限テスト用の大量データ作成
    const largeData = 'x'.repeat(1024 * 1024); // 1MB のテストデータ

    // LocalStorage容量を意図的に埋める
    for (let i = 0; i < 5; i++) {
      try {
        localStorage.setItem(`large_data_${i}`, largeData);
      } catch {
        // 容量制限に達した時点で停止
        break;
      }
    }

    render(
      <PlaySessionContainer
        sessionId={TEST_SESSION_ID}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    // 容量制限下でも基本動作が継続することを確認
    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 5000 }
    );

    expect(screen.getByRole('main')).toBeDefined();

    // テスト用大量データをクリーンアップ
    for (let i = 0; i < 5; i++) {
      localStorage.removeItem(`large_data_${i}`);
    }
  });

  it('複数セッションの分離動作確認', async () => {
    const SESSION_A = 'session-a';
    const SESSION_B = 'session-b';

    // セッションA用のキャッシュデータ設定
    const scenesA: Scene[] = [
      {
        id: TEST_STARTING_SCENE_ID,
        title: 'セッションA専用シーン',
        startingEventId: 'event_a',
        events: [
          {
            id: 'event_a',
            type: 'narrative',
            content: 'セッションA',
            data: { narrativeText: 'セッションA' }
          }
        ]
      }
    ];

    localStorage.setItem(
      `odyssage_session_scenes_${SESSION_A}`,
      JSON.stringify(scenesA)
    );

    // セッションA描画
    const { unmount: unmountA } = render(
      <PlaySessionContainer
        sessionId={SESSION_A}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 2000 }
    );

    unmountA();

    // セッションB描画（独立したデータを持つことを確認）
    render(
      <PlaySessionContainer
        sessionId={SESSION_B}
        startingSceneId={TEST_STARTING_SCENE_ID}
      />
    );

    await waitFor(
      () => {
        expect(screen.queryByText('セッションを読み込み中...')).toBeNull();
      },
      { timeout: 5000 }
    );

    // セッション分離確認
    const sessionACache = localStorage.getItem(`odyssage_session_scenes_${SESSION_A}`);
    const sessionBCache = localStorage.getItem(`odyssage_session_scenes_${SESSION_B}`);
    
    expect(sessionACache).toBeDefined();
    expect(sessionBCache).toBeDefined();
    expect(sessionACache).not.toBe(sessionBCache);

    // クリーンアップ
    localStorage.removeItem(`odyssage_session_scenes_${SESSION_A}`);
    localStorage.removeItem(`odyssage_session_scenes_${SESSION_B}`);
  });
});