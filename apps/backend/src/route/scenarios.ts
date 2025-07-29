// @copilot-context backend
import { vValidator } from '@hono/valibot-validator';
import { HybridScenarioRepository } from '@odyssage/domain/src/repositories/hybrid-scenario-repository';
import { ScenarioCreationService } from '@odyssage/domain/src/services/scenario-creation-service';
import { Hono } from 'hono';
import { Session, driver } from 'neo4j-driver';
import * as v from 'valibot';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';

// リクエスト/レスポンススキーマ
const createScenarioSchema = v.object({
  title: v.string(),
  overview: v.string(),
  templateType: v.optional(v.union([
    v.literal('basic'),
    v.literal('simple-choice'),
    v.literal('branching-story'),
    v.literal('mystery')
  ])),
});

const updateScenarioSchema = v.object({
  title: v.optional(v.string()),
  overview: v.optional(v.string()),
  visibility: v.optional(v.union([
    v.literal('private'),
    v.literal('draft'),
    v.literal('public')
  ])),
});

const duplicateScenarioSchema = v.object({
  title: v.string(),
});

const querySchema = v.object({
  page: v.optional(v.pipe(v.string(), v.transform(Number)), 1),
  limit: v.optional(v.pipe(v.string(), v.transform(Number)), 10),
  q: v.optional(v.string()),
});

const paramSchema = v.object({
  id: v.string(),
});

/**
 * Neo4jセッションを取得するヘルパー関数
 */
function getNeo4jSession(env: Env): Session {
  const neo4jDriver = driver(
    env.NEO4J_URL,
    { username: env.NEO4J_USER, password: env.NEO4J_PASSWORD }
  );
  return neo4jDriver.session();
}

/**
 * シナリオAPIルート
 */
export const scenarioRoute = new Hono<Env>()
  // 公開シナリオ一覧取得（認証不要）
  .get('/public', vValidator('query', querySchema), async (c) => {
    const { page, limit } = c.req.valid('query');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const result = await repository.findPublicScenarios(page, limit);
      
      return c.json({
        scenarios: result.scenarios.map(scenario => ({
          id: scenario.id,
          title: scenario.title,
          overview: scenario.overview,
          userId: scenario.userId,
          visibility: scenario.visibility,
          createdAt: scenario.createdAt,
          updatedAt: scenario.updatedAt,
        })),
        pagination: {
          page,
          limit,
          total: result.total,
          hasNext: result.hasNext,
        },
      });
    } catch (error) {
      console.error('Public scenarios fetch error:', error);
      return c.json({ error: 'Failed to fetch public scenarios' }, 500);
    } finally {
      await session.close();
    }
  })

  // 以下は認証が必要なエンドポイント
  .use('/*', authorizeMiddleware)

  // ユーザーのシナリオ一覧取得
  .get('/', vValidator('query', querySchema), async (c) => {
    const { q } = c.req.valid('query');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      
      let scenarios;
      if (q) {
        scenarios = await repository.searchByTitle(q, 50);
        // ユーザー自身のシナリオのみにフィルタ
        scenarios = scenarios.filter(scenario => scenario.userId === userId);
      } else {
        scenarios = await repository.findByUserId(userId);
      }
      
      return c.json({
        scenarios: scenarios.map(scenario => ({
          id: scenario.id,
          title: scenario.title,
          overview: scenario.overview,
          visibility: scenario.visibility,
          createdAt: scenario.createdAt,
          updatedAt: scenario.updatedAt,
        })),
      });
    } catch (error) {
      console.error('User scenarios fetch error:', error);
      return c.json({ error: 'Failed to fetch scenarios' }, 500);
    } finally {
      await session.close();
    }
  })

  // シナリオ作成
  .post('/', vValidator('json', createScenarioSchema), async (c) => {
    const { title, overview, templateType = 'basic' } = c.req.valid('json');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const service = new ScenarioCreationService(repository);
      
      let scenario;
      if (templateType === 'basic') {
        scenario = await service.createBasicScenario(userId, title, overview);
      } else {
        scenario = await service.createFromTemplate(
          userId,
          templateType as 'simple-choice' | 'branching-story' | 'mystery',
          title,
          overview
        );
      }
      
      return c.json({
        id: scenario.id,
        title: scenario.title,
        overview: scenario.overview,
        visibility: scenario.visibility,
        userId: scenario.userId,
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
      }, 201);
    } catch (error) {
      console.error('Scenario creation error:', error);
      return c.json({ error: 'Failed to create scenario' }, 500);
    } finally {
      await session.close();
    }
  })

  // 特定シナリオ取得
  .get('/:id', vValidator('param', paramSchema), async (c) => {
    const { id } = c.req.valid('param');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const scenario = await repository.findById(id);
      
      if (!scenario) {
        return c.json({ error: 'Scenario not found' }, 404);
      }
      
      // 所有者またはパブリックシナリオのみアクセス可能
      if (scenario.userId !== userId && scenario.visibility !== 'public') {
        return c.json({ error: 'Access denied' }, 403);
      }
      
      return c.json({
        id: scenario.id,
        title: scenario.title,
        overview: scenario.overview,
        visibility: scenario.visibility,
        userId: scenario.userId,
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
      });
    } catch (error) {
      console.error('Scenario fetch error:', error);
      return c.json({ error: 'Failed to fetch scenario' }, 500);
    } finally {
      await session.close();
    }
  })

  // シナリオ更新
  .put('/:id', vValidator('param', paramSchema), vValidator('json', updateScenarioSchema), async (c) => {
    const { id } = c.req.valid('param');
    const updates = c.req.valid('json');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const scenario = await repository.findById(id);
      
      if (!scenario) {
        return c.json({ error: 'Scenario not found' }, 404);
      }
      
      if (scenario.userId !== userId) {
        return c.json({ error: 'Access denied' }, 403);
      }
      
      // シナリオを更新
      if (updates.title) scenario.updateTitle(updates.title);
      if (updates.overview) scenario.updateOverview(updates.overview);
      if (updates.visibility) scenario.updateVisibility(updates.visibility);
      
      await repository.save(scenario);
      
      return c.json({
        id: scenario.id,
        title: scenario.title,
        overview: scenario.overview,
        visibility: scenario.visibility,
        userId: scenario.userId,
        createdAt: scenario.createdAt,
        updatedAt: scenario.updatedAt,
      });
    } catch (error) {
      console.error('Scenario update error:', error);
      return c.json({ error: 'Failed to update scenario' }, 500);
    } finally {
      await session.close();
    }
  })

  // シナリオ複製
  .post('/:id/duplicate', vValidator('param', paramSchema), vValidator('json', duplicateScenarioSchema), async (c) => {
    const { id } = c.req.valid('param');
    const { title } = c.req.valid('json');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const service = new ScenarioCreationService(repository);
      
      const duplicatedScenario = await service.duplicateScenario(id, userId, title);
      
      return c.json({
        id: duplicatedScenario.id,
        title: duplicatedScenario.title,
        overview: duplicatedScenario.overview,
        visibility: duplicatedScenario.visibility,
        userId: duplicatedScenario.userId,
        createdAt: duplicatedScenario.createdAt,
        updatedAt: duplicatedScenario.updatedAt,
      }, 201);
    } catch (error) {
      console.error('Scenario duplication error:', error);
      if (error instanceof Error && error.message.includes('見つかりません')) {
        return c.json({ error: 'Source scenario not found' }, 404);
      }
      return c.json({ error: 'Failed to duplicate scenario' }, 500);
    } finally {
      await session.close();
    }
  })

  // シナリオ削除
  .delete('/:id', vValidator('param', paramSchema), async (c) => {
    const { id } = c.req.valid('param');
    const userId = c.get('userId');
    const session = getNeo4jSession(c.env);
    
    try {
      const repository = new HybridScenarioRepository(session);
      const scenario = await repository.findById(id);
      
      if (!scenario) {
        return c.json({ error: 'Scenario not found' }, 404);
      }
      
      if (scenario.userId !== userId) {
        return c.json({ error: 'Access denied' }, 403);
      }
      
      await repository.delete(id);
      
      return c.json({ message: 'Scenario deleted successfully' });
    } catch (error) {
      console.error('Scenario deletion error:', error);
      return c.json({ error: 'Failed to delete scenario' }, 500);
    } finally {
      await session.close();
    }
  });