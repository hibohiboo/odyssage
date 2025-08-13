// filepath: d:\projects\odyssage\apps\backend\test\integrations\neo4j-test-utils.ts
import { Neo4jContainer } from '@testcontainers/neo4j';
import { auth, driver as createDriver, type Session } from 'neo4j-driver';
import app from '../../src'; // 実際のHonoアプリケーションをインポート

export const useNeo4J = async (
  callback: (neo4jConfig: {
    session: Session;
    app: typeof app;
    env: Record<string, string>;
  }) => Promise<void>,
) => {
  const container = await new Neo4jContainer('neo4j').start();

  const url = container.getBoltUri();
  const user = container.getUsername();
  const password = container.getPassword();
  const driver = createDriver(url, auth.basic(user, password));
  const session = driver.session();
  // Neo4j環境変数を設定（Honoアプリが接続できるように）
  process.env.NEO4J_URL = url;
  process.env.NEO4J_USER = user;
  process.env.NEO4J_PASSWORD = password;
  const env = {
    CLOUDFLARE_ENV: 'test',
    NEO4J_URL: url,
    NEO4J_USER: user,
    NEO4J_PASSWORD: password,
  };
  await callback({ session, app, env });
  await session.close();
  await driver.close();
};
