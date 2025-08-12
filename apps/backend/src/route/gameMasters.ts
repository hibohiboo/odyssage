// filepath: d:\projects\odyssage\apps\backend\src\route\gameMasters.ts
import { vValidator } from '@hono/valibot-validator';
import { getSessionsByGmId } from '@odyssage/database/src/queries/select';
import { userParamSchema } from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { Logger } from '../utils/logger';

/**
 * ゲームマスター（GM）文脈のエンドポイント
 * - GET /{uid}/sessions: 指定GMが管理するセッション一覧を取得
 */
export const gameMastersRoute = new Hono<Env>().get(
  '/:uid/sessions',
  vValidator('param', userParamSchema),
  async (c) => {
    try {
      const param = c.req.valid('param');
      const uid = param.uid;

      if (!uid) {
        return c.json({ message: 'ユーザーIDが必要です' }, 400);
      }

      const sessions = await getSessionsByGmId(
        c.env.NEON_CONNECTION_STRING,
        uid,
      );

      // 既存実装と完全同一のレスポンス形式を維持
      return c.json(
        sessions.map((session) => ({
          id: session.id,
          title: session.title,
          status: session.status,
          scenarioId: session.scenarioId,
          scenarioTitle: session.scenarioTitle,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        })),
      );
    } catch (error) {
      Logger.error('GM管理セッション一覧取得エラー:', error);
      return c.json({ message: 'セッション一覧の取得に失敗しました' }, 500);
    }
  },
);
