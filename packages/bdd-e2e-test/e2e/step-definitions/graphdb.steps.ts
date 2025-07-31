import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import neo4j, { Driver } from 'neo4j-driver';

// Neo4j接続設定
const NEO4J_URL = process.env.NEO4J_URL || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'neo4jpassword';

let driver: Driver;
let neo4jAvailable = true;

// テスト開始前にNeo4j接続を確認
async function initializeNeo4j() {
  try {
    driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
    await driver.verifyConnectivity();
    console.log('Neo4j connection established for GraphDB verification');
  } catch (error) {
    console.warn('Neo4j not available:', error);
    neo4jAvailable = false;
  }
}

initializeNeo4j();

Then('GraphDBにシナリオデータが保存されている', async function (this) {
  if (!neo4jAvailable) {
    console.log('Neo4j not available, skipping GraphDB verification');
    return;
  }

  // テストシナリオ名を使用（featureファイルの値と一致）
  const scenarioTitle = 'GraphDB連携テスト';
  
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (s:Scenario {title: $title}) RETURN s.title as title, s.overview as overview',
      { title: scenarioTitle.trim() }
    );
    
    expect(result.records.length).toBeGreaterThan(0);
    const record = result.records[0];
    expect(record.get('title')).toBe(scenarioTitle.trim());
    expect(record.get('overview')).toBe('GraphDBとRDBの両方に保存されるテストシナリオ');
    
    console.log(`GraphDBでシナリオ "${scenarioTitle}" を確認しました`);
  } catch (error) {
    console.error('GraphDB verification failed:', error);
    throw error;
  } finally {
    await session.close();
  }
});

// テスト終了時にdriver接続を閉じる
process.on('exit', async () => {
  if (driver) {
    await driver.close();
  }
});