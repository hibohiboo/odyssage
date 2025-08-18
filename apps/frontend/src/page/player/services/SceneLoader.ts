import { sampleScenes } from '@odyssage/ui/player/data/sampleScenes';
import { safeValidateScene, type Scene } from '@odyssage/schema';

/**
 * SceneLoader - モックJSONデータ + LocalStorage実装
 * MVP制約: バックエンドAPI呼び出しなし、LocalStorageベースの実装
 */
export class SceneLoader {
  private readonly SCENE_CACHE_KEY = 'odyssage_scene_cache';

  private readonly SESSION_SCENE_KEY = 'odyssage_session_scenes';

  /**
   * セッション用のSceneデータを読み込み
   * LocalStorage → モックJSONデータ → LocalStorage保存の流れ
   */
  async loadScenesForSession(sessionId: string): Promise<Scene[]> {
    try {
      // 1. LocalStorageから既存データ確認
      const cached = this.loadFromCache(sessionId);
      if (cached && cached.length > 0) {
        return cached;
      }

      // 2. モックJSONデータから取得
      const scenes = await this.loadFromMockData();

      // 3. LocalStorageにキャッシュ保存
      this.saveToCache(sessionId, scenes);

      return scenes;
    } catch {
      throw new Error('Sceneデータの取得に失敗しました');
    }
  }

  /**
   * 特定のSceneを読み込み
   */
  async loadScene(sceneId: string): Promise<Scene> {
    try {
      // 1. キャッシュから確認
      const allScenes = this.getAllCachedScenes();
      const scene = allScenes.find((s) => s.id === sceneId);
      if (scene) {
        return scene;
      }

      // 2. モックデータから確認
      const mockScenes = await this.loadFromMockData();
      const mockScene = mockScenes.find((s) => s.id === sceneId);
      if (mockScene) {
        return mockScene;
      }

      throw new Error(`Scene not found: ${sceneId}`);
    } catch {
      throw new Error(`Scene読み込みに失敗しました: ${sceneId}`);
    }
  }

  /**
   * セッションの既存状態を復元
   */
  async restoreSession(sessionId: string): Promise<Scene[] | null> {
    try {
      const cached = this.loadFromCache(sessionId);
      return cached || null;
    } catch (error) {
      console.error('Session復元失敗:', error);
      return null;
    }
  }

  /**
   * モックJSONデータから読み込み
   * 現在は sampleScenes を直接使用、将来的には静的JSONファイルに対応可能
   */
  private async loadFromMockData(): Promise<Scene[]> {
    // 非同期処理をシミュレート（実際のデータ読み込み時間をエミュレート）
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 100);
    });

    // モックデータのクローンを返す（参照渡しを避ける）
    return JSON.parse(JSON.stringify(sampleScenes));
  }

  /**
   * LocalStorageからSceneデータ読み込み
   */
  private loadFromCache(sessionId: string): Scene[] | null {
    try {
      const cacheKey = `${this.SESSION_SCENE_KEY}_${sessionId}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // データの有効性確認
      if (!Array.isArray(parsed) || parsed.length === 0) return null;
      
      // Scene構造の検証 (Valibot使用)
      const validatedScenes: Scene[] = [];
      for (const scene of parsed) {
        const validScene = safeValidateScene(scene);
        if (validScene) {
          validatedScenes.push(validScene);
        } else {
          console.warn('Invalid scene data found in cache:', scene);
          return null; // 不正なデータがある場合はキャッシュ無効
        }
      }
      
      if (validatedScenes.length === parsed.length) {
        return validatedScenes;
      }

      return null;
    } catch (error) {
      console.error('Cache読み込みエラー:', error);
      return null;
    }
  }

  /**
   * LocalStorageにSceneデータ保存
   */
  private saveToCache(sessionId: string, scenes: Scene[]): void {
    try {
      const cacheKey = `${this.SESSION_SCENE_KEY}_${sessionId}`;
      const data = JSON.stringify(scenes);
      localStorage.setItem(cacheKey, data);

      // 共通キャッシュにも保存（Scene単体検索用）
      this.updateCommonCache(scenes);
    } catch (error) {
      console.error('Cache保存エラー:', error);
      // エラーでも処理を継続（キャッシュ失敗は致命的ではない）
    }
  }

  /**
   * 全キャッシュされたSceneを取得
   */
  private getAllCachedScenes(): Scene[] {
    try {
      const cached = localStorage.getItem(this.SCENE_CACHE_KEY);
      if (!cached) return [];

      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('共通キャッシュ読み込みエラー:', error);
      return [];
    }
  }

  /**
   * 共通キャッシュを更新
   */
  private updateCommonCache(newScenes: Scene[]): void {
    try {
      const existing = this.getAllCachedScenes();
      const updated = [...existing];

      // 新しいSceneで既存を更新、または追加
      newScenes.forEach((newScene) => {
        const existingIndex = updated.findIndex((s) => s.id === newScene.id);
        if (existingIndex >= 0) {
          updated[existingIndex] = newScene;
        } else {
          updated.push(newScene);
        }
      });

      localStorage.setItem(this.SCENE_CACHE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('共通キャッシュ更新エラー:', error);
    }
  }

  /**
   * キャッシュクリア（開発・デバッグ用）
   */
  clearCache(sessionId?: string): void {
    try {
      if (sessionId) {
        // 特定セッションのキャッシュのみクリア
        const cacheKey = `${this.SESSION_SCENE_KEY}_${sessionId}`;
        localStorage.removeItem(cacheKey);
      } else {
        // 全Sceneキャッシュをクリア
        localStorage.removeItem(this.SCENE_CACHE_KEY);
        
        // セッション別キャッシュも全てクリア
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.SESSION_SCENE_KEY)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('キャッシュクリアエラー:', error);
    }
  }
}