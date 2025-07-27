// @copilot-context backend
import { Session, Result } from 'neo4j-driver';

export async function detectCyclicReferences(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)-[:HAS_EVENT]->(startEvent:Event)
    MATCH (startEvent)-[:HAS_MESSAGE]->(message:Message)
    MATCH cycle = (message)-[:CHOICE*1..10]->(endEvent:Event)
    WHERE startEvent = endEvent
    RETURN cycle, length(cycle) as cycleLength
    ORDER BY cycleLength
  `;

  return await session.run(query, { scenarioId });
}

export async function validateBranchingStructure(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    MATCH (scenario)-[:HAS_SCENE*]->(scene:Scene)-[:HAS_EVENT*]->(event:Event)
    MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[choice:CHOICE]->(nextEvent:Event)
    WITH event, message, collect(choice) as choices, count(choice) as choiceCount
    RETURN 
      event.id as eventId,
      message.id as messageId,
      choiceCount,
      choices,
      CASE 
        WHEN choiceCount = 0 THEN 'terminal'
        WHEN choiceCount = 1 THEN 'linear'
        ELSE 'branching'
      END as nodeType
    ORDER BY event.order
  `;

  return await session.run(query, { scenarioId });
}

export async function findOrphanedNodes(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    
    // 接続されたノードを取得
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(connectedScene:Scene)
    OPTIONAL MATCH (connectedScene)-[:HAS_EVENT]->(connectedEvent:Event)
    OPTIONAL MATCH (connectedEvent)-[:HAS_MESSAGE]->(connectedMessage:Message)
    
    WITH scenario, collect(DISTINCT connectedScene) as connectedScenes,
         collect(DISTINCT connectedEvent) as connectedEvents,
         collect(DISTINCT connectedMessage) as connectedMessages
    
    // 孤立したシーンを検索
    OPTIONAL MATCH (orphanScene:Scene)
    WHERE orphanScene.scenarioId = $scenarioId 
      AND NOT orphanScene IN connectedScenes
    
    // 孤立したイベントを検索  
    OPTIONAL MATCH (orphanEvent:Event)
    WHERE EXISTS { MATCH (s:Scene) WHERE s.id = orphanEvent.sceneId AND s IN connectedScenes }
      AND NOT orphanEvent IN connectedEvents
    
    // 孤立したメッセージを検索
    OPTIONAL MATCH (orphanMessage:Message)
    WHERE EXISTS { MATCH (e:Event) WHERE e.id = orphanMessage.eventId AND e IN connectedEvents }
      AND NOT orphanMessage IN connectedMessages
    
    RETURN 
      collect(DISTINCT orphanScene) as orphanedScenes,
      collect(DISTINCT orphanEvent) as orphanedEvents,
      collect(DISTINCT orphanMessage) as orphanedMessages
  `;

  return await session.run(query, { scenarioId });
}

export async function validateScenarioIsolation(
  session: Session,
  scenarioIds: string[],
): Promise<Result> {
  const query = `
    WITH $scenarioIds as scenarioIds
    UNWIND scenarioIds as scenarioId
    
    MATCH (scenario:Scenario {id: scenarioId})
    OPTIONAL MATCH (scenario)-[:HAS_SCENE*]->(scene:Scene)-[:HAS_EVENT*]->(event:Event)-[:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[:CHOICE]->(targetEvent:Event)
    OPTIONAL MATCH (targetEvent)<-[:HAS_EVENT*]-(targetScene:Scene)<-[:HAS_SCENE*]-(targetScenario:Scenario)
    
    WITH scenario, targetScenario, scenarioIds
    WHERE targetScenario IS NOT NULL AND targetScenario.id <> scenario.id
    
    RETURN 
      scenario.id as sourceScenario,
      targetScenario.id as targetScenario,
      scenario.id IN scenarioIds AND targetScenario.id IN scenarioIds as bothInScope
  `;

  return await session.run(query, { scenarioIds });
}

export async function getScenarioComplexityMetrics(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    
    // 基本的なカウント
    OPTIONAL MATCH (scenario)-[:HAS_SCENE]->(scene:Scene)
    OPTIONAL MATCH (scene)-[:HAS_EVENT]->(event:Event)
    OPTIONAL MATCH (event)-[:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[:CHOICE]->(nextEvent:Event)
    
    WITH scenario, 
         count(DISTINCT scene) as sceneCount,
         count(DISTINCT event) as eventCount,
         count(DISTINCT message) as messageCount,
         count(DISTINCT nextEvent) as choiceCount
    
    RETURN 
      scenario.id as scenarioId,
      sceneCount,
      eventCount,
      messageCount,
      choiceCount,
      CASE WHEN eventCount > 0 THEN toFloat(choiceCount) / eventCount ELSE 0.0 END as branchingRatio
  `;

  return await session.run(query, { scenarioId });
}

export async function cleanupOrphanedRelationships(
  session: Session,
  scenarioId: string,
): Promise<Result> {
  const query = `
    MATCH (scenario:Scenario {id: $scenarioId})
    
    // 孤立したリレーションの数をカウント（実際の削除はしない）
    OPTIONAL MATCH (scenario)-[hasScene:HAS_SCENE]->(scene:Scene)
    OPTIONAL MATCH (scene)-[hasEvent:HAS_EVENT]->(event:Event)
    OPTIONAL MATCH (event)-[hasMessage:HAS_MESSAGE]->(message:Message)
    OPTIONAL MATCH (message)-[choice:CHOICE]->(nextEvent:Event)
    
    WITH scenario,
         count(hasScene) as sceneRelCount,
         count(hasEvent) as eventRelCount,
         count(hasMessage) as messageRelCount,
         count(choice) as choiceRelCount
    
    RETURN 
      sceneRelCount + eventRelCount + messageRelCount + choiceRelCount as totalRelationships,
      0 as cleanedRelationships
  `;

  return await session.run(query, { scenarioId });
}