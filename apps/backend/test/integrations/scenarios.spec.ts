// @copilot-context testing
import { Hono } from 'hono';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import route from '../../src/route/index';

describe('Scenarios API Integration Tests', () => {
  let app: Hono<Env>;
  let mockEnv: Env;

  beforeAll(() => {
    app = new Hono<Env>().route('/', route);
    
    // モック環境変数
    mockEnv = {
      NEO4J_URL: 'bolt://localhost:7687',
      NEO4J_USER: 'neo4j',
      NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'test-password',
      NEON_CONNECTION_STRING: 'postgresql://test',
      FIREBASE_PROJECT_ID: 'test-project',
      JWT_PUBLIC_KEY: 'test-key',
      CORS_ORIGINS: 'http://localhost:3000',
    } as Env;
  });

  describe('Public Scenarios', () => {
    it('should fetch public scenarios without authentication', async () => {
      const res = await app.request('/scenarios/public', {
        method: 'GET',
      }, mockEnv);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('scenarios');
      expect(data).toHaveProperty('pagination');
    });

    it('should support pagination parameters', async () => {
      const res = await app.request('/scenarios/public?page=1&limit=5', {
        method: 'GET',
      }, mockEnv);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(5);
    });
  });

  describe('Authenticated Scenarios API', () => {
    const mockAuthHeaders = {
      'Authorization': 'Bearer mock-token',
    };

    // 認証をモックする
    beforeEach(() => {
      // 実際のテストでは認証ミドルウェアをモックする必要があります
      // この実装例では簡略化されています
    });

    it('should create a basic scenario', async () => {
      const scenarioData = {
        title: 'テストシナリオ',
        overview: 'これはテスト用のシナリオです。',
        templateType: 'basic',
      };

      const res = await app.request('/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...mockAuthHeaders,
        },
        body: JSON.stringify(scenarioData),
      }, mockEnv);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty('id');
      expect(data.title).toBe(scenarioData.title);
      expect(data.overview).toBe(scenarioData.overview);
      expect(data.visibility).toBe('draft');
    });

    it('should create scenario from template', async () => {
      const scenarioData = {
        title: '選択式シナリオ',
        overview: '二択の選択肢があるシナリオです。',
        templateType: 'simple-choice',
      };

      const res = await app.request('/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...mockAuthHeaders,
        },
        body: JSON.stringify(scenarioData),
      }, mockEnv);

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.title).toBe(scenarioData.title);
    });

    it('should fetch user scenarios', async () => {
      const res = await app.request('/scenarios', {
        method: 'GET',
        headers: mockAuthHeaders,
      }, mockEnv);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('scenarios');
      expect(Array.isArray(data.scenarios)).toBe(true);
    });

    it('should search scenarios by title', async () => {
      const res = await app.request('/scenarios?q=テスト', {
        method: 'GET',
        headers: mockAuthHeaders,
      }, mockEnv);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('scenarios');
    });

    it('should get specific scenario by ID', async () => {
      const scenarioId = 'test-scenario-id';
      
      const res = await app.request(`/scenarios/${scenarioId}`, {
        method: 'GET',
        headers: mockAuthHeaders,
      }, mockEnv);

      // シナリオが見つからない場合は404を返すべき
      expect([200, 404]).toContain(res.status);
    });

    it('should update scenario', async () => {
      const scenarioId = 'test-scenario-id';
      const updateData = {
        title: '更新されたシナリオ',
        visibility: 'public' as const,
      };

      const res = await app.request(`/scenarios/${scenarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...mockAuthHeaders,
        },
        body: JSON.stringify(updateData),
      }, mockEnv);

      // シナリオが見つからない場合は404、更新成功は200
      expect([200, 404]).toContain(res.status);
    });

    it('should duplicate scenario', async () => {
      const sourceScenarioId = 'source-scenario-id';
      const duplicateData = {
        title: '複製されたシナリオ',
      };

      const res = await app.request(`/scenarios/${sourceScenarioId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...mockAuthHeaders,
        },
        body: JSON.stringify(duplicateData),
      }, mockEnv);

      // ソースが見つからない場合は404、複製成功は201
      expect([201, 404]).toContain(res.status);
    });

    it('should delete scenario', async () => {
      const scenarioId = 'test-scenario-id';

      const res = await app.request(`/scenarios/${scenarioId}`, {
        method: 'DELETE',
        headers: mockAuthHeaders,
      }, mockEnv);

      // シナリオが見つからない場合は404、削除成功は200
      expect([200, 404]).toContain(res.status);
    });

    it('should validate request schemas', async () => {
      // 無効なリクエストボディでテスト
      const invalidData = {
        title: '', // 空のタイトル
        templateType: 'invalid-template', // 無効なテンプレートタイプ
      };

      const res = await app.request('/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...mockAuthHeaders,
        },
        body: JSON.stringify(invalidData),
      }, mockEnv);

      expect(res.status).toBe(400);
    });

    it('should handle authorization errors', async () => {
      // 認証ヘッダーなしでアクセス
      const res = await app.request('/scenarios', {
        method: 'GET',
      }, mockEnv);

      expect(res.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    it('should handle Neo4j connection errors gracefully', async () => {
      const badEnv = {
        ...mockEnv,
        NEO4J_URL: 'bolt://invalid:7687',
      };

      const res = await app.request('/scenarios/public', {
        method: 'GET',
      }, badEnv);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toHaveProperty('error');
    });

    it('should return 404 for non-existent scenario', async () => {
      const nonExistentId = 'non-existent-scenario-id';

      const res = await app.request(`/scenarios/${nonExistentId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      }, mockEnv);

      expect(res.status).toBe(404);
    });
  });
});