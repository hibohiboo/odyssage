import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

/**
 * BDDテストで共通利用するRDB操作のユーティリティクラス
 */
export class DatabaseHelper {
  private pool: Pool | null = null;
  private available = true;

  constructor() {
    this.initialize();
  }

  /**
   * PostgreSQL接続を初期化
   */
  private async initialize() {
    try {
      const NEON_CONNECTION_STRING = process.env.NEON_CONNECTION_STRING;
      
      if (!NEON_CONNECTION_STRING) {
        console.warn('NEON_CONNECTION_STRING not available for BDD tests');
        this.available = false;
        return;
      }

      this.pool = new Pool({
        connectionString: NEON_CONNECTION_STRING,
      });

      // 接続テスト
      const client = await this.pool.connect();
      client.release();
      
      console.log('PostgreSQL connection established for BDD tests');
    } catch (error) {
      console.warn('PostgreSQL not available for BDD tests:', error);
      this.available = false;
    }
  }

  /**
   * PostgreSQLが利用可能か確認
   */
  isAvailable(): boolean {
    return this.available && this.pool !== null;
  }

  /**
   * RDBにテストユーザーを作成する
   */
  async createTestUser(userId: string, name: string) {
    if (!this.isAvailable()) {
      console.log('PostgreSQL not available, skipping test user creation');
      return;
    }

    const client = await this.pool!.connect();
    try {
      await client.query(
        'INSERT INTO users (id, name, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET name = $2, updated_at = NOW()',
        [userId, name]
      );
      console.log(`RDBにテストユーザー「${name}」を作成しました`);
    } catch (error) {
      console.error('Test user creation failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * RDBにテストシナリオを作成する
   */
  async createTestScenario(scenarioId: string, title: string, overview: string, userId: string) {
    if (!this.isAvailable()) {
      console.log('PostgreSQL not available, skipping test scenario creation');
      return;
    }

    const client = await this.pool!.connect();
    try {
      await client.query(
        'INSERT INTO scenarios (id, title, overview, user_id, visibility, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) ON CONFLICT (id) DO UPDATE SET title = $2, overview = $3, updated_at = NOW()',
        [scenarioId, title, overview, userId, 'private']
      );
      console.log(`RDBにテストシナリオ「${title}」を作成しました`);
    } catch (error) {
      console.error('Test scenario creation failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * RDBのテストデータをクリーンアップする
   */
  async cleanupTestData() {
    if (!this.isAvailable()) {
      console.log('PostgreSQL not available, skipping cleanup');
      return;
    }

    const client = await this.pool!.connect();
    try {
      // テスト用のシナリオを削除
      await client.query(
        "DELETE FROM scenarios WHERE title LIKE '%テスト%' OR title LIKE '%test%'"
      );
      
      // テスト用のユーザーを削除
      await client.query(
        "DELETE FROM users WHERE name LIKE '%テスト%' OR name LIKE '%test%'"
      );
      
      console.log('RDBテストデータをクリーンアップしました');
    } catch (error) {
      console.error('Test data cleanup failed:', error);
    } finally {
      client.release();
    }
  }

  /**
   * 接続を閉じる
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}

// シングルトンインスタンス
export const databaseHelper = new DatabaseHelper();

// プロセス終了時に接続を閉じる
process.on('exit', async () => {
  await databaseHelper.close();
});