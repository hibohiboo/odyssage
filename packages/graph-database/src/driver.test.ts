import { describe, it, expect } from 'vitest';
import { driver } from './driver';

describe('Neo4j Driver', () => {
  it('should connect to Neo4j and create a session', async () => {
    const session = driver.session();
    try {
      // サーバーへの接続を試みる簡単なクエリを実行
      const result = await session.run('RETURN 1');
      expect(result.records).toHaveLength(1);
      expect(result.records[0].get(0).toNumber()).toBe(1);
    } catch (error) {
      // 接続失敗時にエラーを投げることを期待
      // eslint-disable-next-line no-console
      console.error(error); // エラー内容をコンソールに出力
      throw new Error('Failed to connect to Neo4j. Please check the connection settings and ensure the database is running.');
    } finally {
      await session.close();
    }
  });
});
