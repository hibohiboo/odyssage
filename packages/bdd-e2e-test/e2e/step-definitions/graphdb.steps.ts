import { Then } from '@cucumber/cucumber';
import { neo4jHelper } from '../utils/neo4j-helper.js';

Then('GraphDBにシナリオデータが保存されている', async function (this) {
  // テストシナリオ名を使用（featureファイルの値と一致）
  const scenarioTitle = 'GraphDB連携テスト';
  const scenarioOverview = 'GraphDBとRDBの両方に保存されるテストシナリオ';
  
  await neo4jHelper.verifyScenarioExists(scenarioTitle, scenarioOverview);
});