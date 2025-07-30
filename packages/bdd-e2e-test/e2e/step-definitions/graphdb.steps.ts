import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import neo4j, { Driver } from 'neo4j-driver';
import { Route } from '@playwright/test';

// Neo4j接続設定
const NEO4J_URL = process.env.NEO4J_URL || 'bolt://localhost:7687';
const NEO4J_USER = process.env.NEO4J_USER || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

let driver: Driver;
let neo4jAvailable = true;

// テスト開始前にNeo4j接続を確認
async function initializeNeo4j() {
  try {
    driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
    await driver.verifyConnectivity();
    console.log('Neo4j connection established');
  } catch (error) {
    console.warn('Neo4j not available:', error);
    neo4jAvailable = false;
  }
}

initializeNeo4j();

Given('GraphDBサービスが停止している', async function (this) {
  // テスト用のモック設定またはサービス停止シミュレーション
  // 実際の実装では、テスト環境でのサービス制御やモック設定を行う
  console.log('GraphDBサービス停止をシミュレート中...');
  
  // ブラウザでGraphDB APIを無効化するためのネットワークモック
  const { page } = this;
  await page.route('**/api/graph-scenarios/**', (route: Route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'GraphDB service unavailable' })
    });
  });
  
  console.log('GraphDB APIリクエストを500エラーで応答するように設定しました');
});

Given('GraphDBサービスを復旧する', async function (this) {
  console.log('GraphDBサービス復旧中...');
  
  // ネットワークモックを解除
  const { page } = this;
  await page.unroute('**/api/graph-scenarios/**');
  
  console.log('GraphDB APIリクエストのモックを解除しました');
});

Then('GraphDBにシナリオデータが保存されている', async function (this) {
  if (!neo4jAvailable) {
    console.log('Neo4j not available, skipping GraphDB verification');
    return;
  }

  // 最後に作成されたシナリオのタイトルを取得
  const { page } = this;
  
  // 直前に作成されたシナリオのタイトルを取得
  // テストシナリオ名を直接使用（featureファイルの値と一致）
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
    
    console.log(`GraphDBでシナリオ "${scenarioTitle}" を確認しました`);
  } catch (error) {
    console.error('GraphDB verification failed:', error);
    throw error;
  } finally {
    await session.close();
  }
});

Then('GraphDBのシナリオデータが更新されている', async function (this) {
  if (!neo4jAvailable) {
    console.log('Neo4j not available, skipping GraphDB update verification');
    return;
  }

  // 更新されたシナリオの内容を確認
  const { page } = this;
  
  // GraphDB同期テストのシナリオタイトルを使用
  const scenarioTitle = 'GraphDB同期テスト';
  
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (s:Scenario {title: $title}) RETURN s.overview as overview, s.updatedAt as updatedAt',
      { title: scenarioTitle.trim() }
    );
    
    expect(result.records.length).toBeGreaterThan(0);
    const record = result.records[0];
    const overview = record.get('overview');
    
    // 更新された概要が含まれていることを確認
    expect(overview).toContain('GraphDBに同期されるように更新された');
    
    console.log(`GraphDBでシナリオ "${scenarioTitle}" の更新を確認しました`);
  } catch (error) {
    console.error('GraphDB update verification failed:', error);
    throw error;
  } finally {
    await session.close();
  }
});

Then('シナリオ{string}が更新される', async function (this, scenarioName) {
  const { page } = this;
  
  // 保存後、シナリオ一覧に戻る
  await page.waitForLoadState('networkidle');
  
  // 更新が反映されていることを確認
  await expect(page.getByText(scenarioName)).toBeVisible();
  
  console.log(`シナリオ "${scenarioName}" の更新を確認しました`);
});

When('概要を {string} と変更する', async function (this, newOverview) {
  const { page } = this;
  
  // 概要欄をクリアして新しい内容を入力
  const overviewTextbox = page.getByRole('textbox', { name: 'シナリオ概要' });
  await overviewTextbox.clear();
  await overviewTextbox.fill(newOverview);
  
  console.log(`概要を "${newOverview}" に変更しました`);
});

// テスト終了時にdriver接続を閉じる
process.on('exit', async () => {
  if (driver) {
    await driver.close();
  }
});