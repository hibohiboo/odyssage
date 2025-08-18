import { safeValidateSessionState, type SessionState } from '@odyssage/schema';

/**
 * AutoSaveService - LocalStorageベース自動保存
 * MVP制約: バックエンドAPI呼び出しなし、LocalStorageのみの実装
 */
export class AutoSaveService {
  private readonly SESSION_STATE_KEY = 'odyssage_session_state';

  private readonly AUTO_SAVE_TIMESTAMP_KEY = 'odyssage_autosave_timestamp';

  /**
   * セッション状態をLocalStorageに保存
   */
  async saveSession(sessionState: SessionState): Promise<void> {
    try {
      const saveKey = `${this.SESSION_STATE_KEY}_${sessionState.sessionId}`;
      const timestampKey = `${this.AUTO_SAVE_TIMESTAMP_KEY}_${sessionState.sessionId}`;

      // セッションデータを保存
      const dataToSave = {
        ...sessionState,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(saveKey, JSON.stringify(dataToSave));
      localStorage.setItem(timestampKey, Date.now().toString());

      // 非同期処理をシミュレート（実際の保存時間をエミュレート）
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 50);
      });
    } catch (error) {
      console.error('セッション保存失敗:', error);
      throw new Error('セッションの保存に失敗しました');
    }
  }

  /**
   * セッション状態をLocalStorageから読み込み
   */
  async loadSession(sessionId: string): Promise<SessionState | null> {
    try {
      const saveKey = `${this.SESSION_STATE_KEY}_${sessionId}`;
      const saved = localStorage.getItem(saveKey);

      if (!saved) return null;

      const parsed = JSON.parse(saved);

      // データの有効性確認 (Valibot使用)
      const validSessionState = safeValidateSessionState(parsed);
      if (validSessionState) {
        return validSessionState;
      }

      return null;
    } catch (error) {
      console.error('セッション読み込み失敗:', error);
      return null;
    }
  }

  /**
   * 最後の保存時刻を取得
   */
  getLastSaveTime(sessionId: string): Date | null {
    try {
      const timestampKey = `${this.AUTO_SAVE_TIMESTAMP_KEY}_${sessionId}`;
      const timestamp = localStorage.getItem(timestampKey);

      if (!timestamp) return null;

      return new Date(parseInt(timestamp, 10));
    } catch (error) {
      console.error('最終保存時刻取得失敗:', error);
      return null;
    }
  }

  /**
   * 自動保存の定期実行を設定
   */
  setupAutoSave(
    sessionState: SessionState,
    interval: number,
    onSaveSuccess?: () => void,
    onSaveError?: (error: Error) => void,
  ): number {
    const intervalId = window.setInterval(async () => {
      try {
        await this.saveSession(sessionState);
        onSaveSuccess?.();
      } catch (error) {
        const saveError =
          error instanceof Error ? error : new Error('自動保存に失敗しました');
        onSaveError?.(saveError);
      }
    }, interval);

    return intervalId;
  }

  /**
   * 自動保存の停止
   */
  stopAutoSave(intervalId: number): void {
    window.clearInterval(intervalId);
  }

  /**
   * セッションデータを削除
   */
  deleteSession(sessionId: string): void {
    try {
      const saveKey = `${this.SESSION_STATE_KEY}_${sessionId}`;
      const timestampKey = `${this.AUTO_SAVE_TIMESTAMP_KEY}_${sessionId}`;

      localStorage.removeItem(saveKey);
      localStorage.removeItem(timestampKey);
    } catch (error) {
      console.error('セッション削除失敗:', error);
    }
  }

  /**
   * 保存されている全セッションのリストを取得
   */
  getAllSavedSessions(): Array<{ sessionId: string; lastSaved: Date }> {
    try {
      const sessions: Array<{ sessionId: string; lastSaved: Date }> = [];
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(this.SESSION_STATE_KEY)) {
          const sessionId = key.replace(`${this.SESSION_STATE_KEY}_`, '');
          const lastSaved = this.getLastSaveTime(sessionId);

          if (lastSaved) {
            sessions.push({ sessionId, lastSaved });
          }
        }
      });

      // 最後の保存時刻順にソート（新しい順）
      return sessions.sort(
        (a, b) => b.lastSaved.getTime() - a.lastSaved.getTime(),
      );
    } catch (error) {
      console.error('保存済みセッション取得失敗:', error);
      return [];
    }
  }

  /**
   * LocalStorageの容量確認
   */
  checkStorageSpace(): {
    used: number;
    available: number;
    isNearLimit: boolean;
  } {
    try {
      // LocalStorageの概算使用量を計算
      let used = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const key in localStorage) {
        // eslint-disable-next-line no-prototype-builtins
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // 一般的なLocalStorageの制限は約5MB
      const limit = 5 * 1024 * 1024; // 5MB in bytes
      const available = limit - used;
      const isNearLimit = used > limit * 0.8; // 80%を超えた場合

      return { used, available, isNearLimit };
    } catch (error) {
      console.error('ストレージ容量確認失敗:', error);
      return { used: 0, available: 0, isNearLimit: false };
    }
  }

  /**
   * 古いセッションデータをクリーンアップ
   */
  cleanupOldSessions(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
    try {
      const cutoffTime = Date.now() - maxAge; // デフォルト7日前
      let cleanedCount = 0;

      const sessions = this.getAllSavedSessions();
      sessions.forEach(({ sessionId, lastSaved }) => {
        if (lastSaved.getTime() < cutoffTime) {
          this.deleteSession(sessionId);
          cleanedCount += 1;
        }
      });

      return cleanedCount;
    } catch (error) {
      console.error('古いセッションクリーンアップ失敗:', error);
      return 0;
    }
  }
}
