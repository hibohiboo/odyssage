// filepath: d:\projects\odyssage\apps\backend\src\route\gm.ts
import { vValidator } from '@hono/valibot-validator';
import { getSessionById } from '@odyssage/database/src/queries/select';
import { updateSessionStatus } from '@odyssage/database/src/queries/update_session';
import {
  idUidSchema,
  parse,
  sessionStatuSchema,
  sessionStatusUpdateSchema,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';
import { Logger } from '../utils/logger';

/**
 * GM関連のエンドポイント
 * - PATCH /gm/:uid/sessions/:id: GMがセッションの状態を更新する
 */
export const gmRoute = new Hono<Env>()
  .use('/:uid/*', authorizeMiddleware)
  // GMがセッションの状態を更新するエンドポイント
  .patch(
    '/:uid/sessions/:id',
    vValidator('param', idUidSchema),
    vValidator('json', sessionStatusUpdateSchema),
    async (c) => {
      try {
        const uid = c.req.param('uid');
        const sessionId = c.req.param('id');
        const json = c.req.valid('json');

        // セッションが存在するか確認
        const [session] = await getSessionById(
          c.env.NEON_CONNECTION_STRING,
          sessionId,
        );

        // セッションが存在しない場合
        if (!session) {
          return c.json({ message: 'セッションが見つかりません' }, 404);
        }

        // GMが一致するか確認（認可チェック）
        if (session.gmId !== uid) {
          return c.json(
            { message: 'このセッションの状態を更新する権限がありません' },
            403,
          );
        }

        // セッションの状態を更新
        await updateSessionStatus(c.env.NEON_CONNECTION_STRING, {
          id: sessionId,
          status: json.status,
        });

        // 更新後のセッションを取得
        const [updatedSession] = await getSessionById(
          c.env.NEON_CONNECTION_STRING,
          sessionId,
        );

        // レスポンス形式に整形
        return c.json({
          id: updatedSession.id,
          gm_id: updatedSession.gmId,
          scenario_id: updatedSession.scenarioId,
          title: updatedSession.title,
          status: parse(sessionStatuSchema, updatedSession.status),
          created_at: updatedSession.createdAt.toISOString(),
          updated_at: updatedSession.updatedAt.toISOString(),
          scenario_title: updatedSession.scenarioTitle,
        });
      } catch (error) {
        Logger.error('セッション状態更新エラー:', error);

        return c.json({ message: 'セッションの状態更新に失敗しました' }, 500);
      }
    },
  );
