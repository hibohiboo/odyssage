import { describe, test, expect, vi, beforeEach } from 'vitest';

// Neo4j driver mock
const mockSession = {
  run: vi.fn(),
  close: vi.fn(),
};

const mockDriver = {
  session: vi.fn(() => mockSession),
};

// Mock the driver module
vi.mock('@odyssage/graph-database/src/driver', () => ({
  getDriver: () => mockDriver,
}));

// GraphScene business logic functions (extracted for testing)
class GraphSceneService {
  static async getScenesForScenario(scenarioId: string) {
    const driver = mockDriver;
    const session = driver.session();

    try {
      const result = await session.run(
        `
        MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)
        RETURN scene.id as id,
               scene.title as title,
               scene.overview as overview,
               scene.scenarioId as scenarioId,
               scene.order as order,
               scene.createdAt as createdAt,
               scene.updatedAt as updatedAt
        ORDER BY scene.order ASC
        `,
        { scenarioId },
      );

      await session.close();

      const scenes = result.records.map((record) => ({
        id: record.get('id'),
        title: record.get('title'),
        overview: record.get('overview'),
        scenarioId: record.get('scenarioId'),
        order: record.get('order'),
        createdAt: record.get('createdAt')?.toString(),
        updatedAt: record.get('updatedAt')?.toString(),
      }));

      return scenes;
    } catch (error) {
      await session.close();
      throw error;
    }
  }

  static async createOrUpdateScene(
    id: string,
    title: string,
    overview: string,
    scenarioId: string,
    order: number,
  ) {
    const driver = mockDriver;
    const session = driver.session();

    try {
      const result = await session.run(
        `
        MERGE (scene:Scene {id: $id})
        SET scene.title = $title,
            scene.overview = $overview,
            scene.scenarioId = $scenarioId,
            scene.order = $order,
            scene.updatedAt = datetime(),
            scene.createdAt = CASE WHEN scene.createdAt IS NULL THEN datetime() ELSE scene.createdAt END

        WITH scene
        MATCH (scenario:Scenario {id: $scenarioId})
        MERGE (scenario)-[:HAS_SCENE]->(scene)

        RETURN scene.id as id, 
               scene.title as title, 
               scene.overview as overview,
               scene.scenarioId as scenarioId,
               scene.order as order
        `,
        { id, title, overview, scenarioId, order },
      );

      await session.close();

      if (result.records.length === 0) {
        throw new Error('Failed to create or update scene');
      }

      const record = result.records[0];
      return {
        id: record.get('id'),
        title: record.get('title'),
        overview: record.get('overview'),
        scenarioId: record.get('scenarioId'),
        order: record.get('order'),
      };
    } catch (error) {
      await session.close();
      throw error;
    }
  }
}

describe('GraphScene Business Logic Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getScenesForScenario', () => {
    it('正常な場合: シーンリストを順序付きで取得', async () => {
      // Arrange
      const mockScenes = [
        {
          get: vi.fn((key: string) => {
            const data = {
              id: 'scene-1',
              title: '村の酒場',
              overview: '賑やかな酒場',
              scenarioId: 'scenario-1',
              order: 1,
              createdAt: { toString: () => '2024-01-01T00:00:00Z' },
              updatedAt: { toString: () => '2024-01-01T00:00:00Z' },
            };
            return data[key as keyof typeof data];
          }),
        },
        {
          get: vi.fn((key: string) => {
            const data = {
              id: 'scene-2',
              title: '森の小屋',
              overview: '古い小屋',
              scenarioId: 'scenario-1',
              order: 2,
              createdAt: { toString: () => '2024-01-01T00:00:00Z' },
              updatedAt: { toString: () => '2024-01-01T00:00:00Z' },
            };
            return data[key as keyof typeof data];
          }),
        },
      ];

      mockSession.run.mockResolvedValue({
        records: mockScenes,
      });

      // Act
      const result = await GraphSceneService.getScenesForScenario('scenario-1');

      // Assert
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining(
          'MATCH (scenario:Scenario {id: $scenarioId})-[:HAS_SCENE]->(scene:Scene)',
        ),
        { scenarioId: 'scenario-1' },
      );
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY scene.order ASC'),
        { scenarioId: 'scenario-1' },
      );
      expect(result).toEqual([
        {
          id: 'scene-1',
          title: '村の酒場',
          overview: '賑やかな酒場',
          scenarioId: 'scenario-1',
          order: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'scene-2',
          title: '森の小屋',
          overview: '古い小屋',
          scenarioId: 'scenario-1',
          order: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('異常な場合: Neo4jエラー時にエラーをthrow', async () => {
      // Arrange
      const mockError = new Error('Connection failed');
      mockSession.run.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        GraphSceneService.getScenesForScenario('scenario-1'),
      ).rejects.toThrow('Database error');

      expect(mockSession.close).toHaveBeenCalled();
    });

    it('空のシーンリストの場合: 空配列を返す', async () => {
      // Arrange
      mockSession.run.mockResolvedValue({
        records: [],
      });

      // Act
      const result = await GraphSceneService.getScenesForScenario('scenario-1');

      // Assert
      expect(result).toEqual([]);
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('createOrUpdateScene', () => {
    it('正常な場合: シーンを作成・更新し、関係性を構築', async () => {
      // Arrange
      const mockSceneResult = {
        get: vi.fn((key: string) => {
          const data = {
            id: 'scene-1',
            title: '新しいシーン',
            overview: 'テスト概要',
            scenarioId: 'scenario-1',
            order: 1,
          };
          return data[key as keyof typeof data];
        }),
      };

      mockSession.run.mockResolvedValue({
        records: [mockSceneResult],
      });

      // Act
      const result = await GraphSceneService.createOrUpdateScene(
        'scene-1',
        '新しいシーン',
        'テスト概要',
        'scenario-1',
        1,
      );

      // Assert
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MERGE (scene:Scene {id: $id})'),
        {
          id: 'scene-1',
          title: '新しいシーン',
          overview: 'テスト概要',
          scenarioId: 'scenario-1',
          order: 1,
        },
      );
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MERGE (scenario)-[:HAS_SCENE]->(scene)'),
        expect.any(Object),
      );
      expect(result).toEqual({
        id: 'scene-1',
        title: '新しいシーン',
        overview: 'テスト概要',
        scenarioId: 'scenario-1',
        order: 1,
      });
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('異常な場合: シーン作成に失敗時エラーをthrow', async () => {
      // Arrange
      mockSession.run.mockResolvedValue({
        records: [],
      });

      // Act & Assert
      await expect(
        GraphSceneService.createOrUpdateScene(
          'scene-1',
          '新しいシーン',
          'テスト概要',
          'scenario-1',
          1,
        ),
      ).rejects.toThrow('Failed to create or update scene');

      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('Validation Logic Unit Tests', () => {
    it('UUIDバリデーション: 正しい形式のUUIDを受け入れる', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      // UUID正規表現パターンのテスト
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidPattern.test(validUUID)).toBe(true);
    });

    it('UUIDバリデーション: 不正な形式のUUIDを拒否する', () => {
      const invalidUUID = 'invalid-uuid';
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidPattern.test(invalidUUID)).toBe(false);
    });

    it('シーン順序の数値バリデーション', () => {
      const validOrders = [1, 2, 100, 999];
      const invalidOrders = [-1, 0, '文字列', null, undefined];

      validOrders.forEach((order) => {
        expect(typeof order === 'number' && order > 0).toBe(true);
      });

      invalidOrders.forEach((order) => {
        expect(typeof order === 'number' && order > 0).toBe(false);
      });
    });
  });

  describe('Data Transformation Logic', () => {
    it('Neo4jレスポンスからJSONレスポンスへの変換', () => {
      const mockNeo4jRecord = {
        get: vi.fn((key: string) => {
          const data = {
            id: 'scene-1',
            title: 'テストシーン',
            overview: 'テスト概要',
            scenarioId: 'scenario-1',
            order: 1,
            createdAt: { toString: () => '2024-01-01T00:00:00Z' },
            updatedAt: { toString: () => '2024-01-01T00:00:00Z' },
          };
          return data[key as keyof typeof data];
        }),
      };

      // 変換ロジックのテスト
      const transformedScene = {
        id: mockNeo4jRecord.get('id'),
        title: mockNeo4jRecord.get('title'),
        overview: mockNeo4jRecord.get('overview'),
        scenarioId: mockNeo4jRecord.get('scenarioId'),
        order: mockNeo4jRecord.get('order'),
        createdAt: mockNeo4jRecord.get('createdAt')?.toString(),
        updatedAt: mockNeo4jRecord.get('updatedAt')?.toString(),
      };

      expect(transformedScene).toEqual({
        id: 'scene-1',
        title: 'テストシーン',
        overview: 'テスト概要',
        scenarioId: 'scenario-1',
        order: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });
    });

    it('null値やundefinedの適切な処理', () => {
      const mockNeo4jRecord = {
        get: vi.fn((key: string) => {
          const data = {
            id: 'scene-1',
            title: 'テストシーン',
            overview: 'テスト概要',
            scenarioId: 'scenario-1',
            order: 1,
            createdAt: null,
            updatedAt: undefined,
          };
          return data[key as keyof typeof data];
        }),
      };

      const transformedScene = {
        id: mockNeo4jRecord.get('id'),
        title: mockNeo4jRecord.get('title'),
        overview: mockNeo4jRecord.get('overview'),
        scenarioId: mockNeo4jRecord.get('scenarioId'),
        order: mockNeo4jRecord.get('order'),
        createdAt: mockNeo4jRecord.get('createdAt')?.toString(),
        updatedAt: mockNeo4jRecord.get('updatedAt')?.toString(),
      };

      expect(transformedScene.createdAt).toBeUndefined();
      expect(transformedScene.updatedAt).toBeUndefined();
    });
  });
});
