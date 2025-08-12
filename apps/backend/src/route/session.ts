// filepath: d:\projects\odyssage\apps\backend\src\route\session.ts
import { vValidator } from '@hono/valibot-validator';
import {
  getSessionById,
  getSessions,
} from '@odyssage/database/src/queries/select';
import {
  idSchema,
  sessionStatuSchema,
  parse,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { Logger } from '../utils/logger';

/**
 * セッション関連のエンドポイント
 * - GET /sessions: セッション一覧を取得（公開のみ、またはGM IDを指定）
 * - GET /sessions/:id: 特定のセッションを取得
 * 
 * 注意: POST /sessions は廃止され、POST /api/game-masters/{uid}/sessions に移行済み
 */
export const sessionRoute = new Hono<Env>()
  // 1. セッション一覧を取得するルートを定義
  .get('/', async (c) => {
    try {
      // クエリパラメータからGM IDを取得（オプション）
      const gmId = c.req.query('gm_id');

      // セッション一覧を取得
      const sessions = await getSessions(c.env.NEON_CONNECTION_STRING, gmId);

      // レスポンス形式に整形
      const response = sessions.map((session) => ({
        id: session.id,
        name: session.title,
        gm: session.gmName,
        gmId: session.gmId,
        players: 0,
        maxPlayers: 5,
        status: parse(sessionStatuSchema, session.status),
        createdAt: session.createdAt.toISOString(),
      }));

      // このエンドポイントはすでにキャメルケースで統一されているため、変換は不要
      return c.json(response);
    } catch (error) {
      Logger.error('セッション一覧取得エラー:', error);
      return c.json({ message: 'セッション一覧の取得に失敗しました' }, 500);
    }
  })
  // 3. 単一のセッションを取得するルートを最後に定義
  .get('/:id', vValidator('param', idSchema), async (c) => {
    try {
      const param = c.req.valid('param');
      const [session] = await getSessionById(
        c.env.NEON_CONNECTION_STRING,
        param.id,
      );

      if (!session) {
        return c.json({ message: 'セッションが見つかりません' }, 404);
      }

      // レスポンス形式に整形し、直接キャメルケースのプロパティ名を指定
      const response = {
        id: session.id,
        gmId: session.gmId,
        scenarioId: session.scenarioId,
        title: session.title,
        status: parse(sessionStatuSchema, session.status),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        scenarioTitle: session.scenarioTitle,
      };
      return c.json(response);
    } catch (error) {
      Logger.error('セッション取得エラー:', error);
      return c.json({ message: 'セッションの取得に失敗しました' }, 500);
    }
  });
