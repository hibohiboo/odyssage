// Neo4j データベースへの接続を管理します。
// 環境変数から接続情報を取得するように実装する必要があります。
import neo4j from 'neo4j-driver';

const uri = process.env.NEO4J_URL || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// アプリケーション終了時にドライバーを閉じる
process.on('exit', async () => {
  if (!driver) return;
  await driver.close();
});
