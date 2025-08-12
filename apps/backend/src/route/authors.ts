import { vValidator } from '@hono/valibot-validator';
import {
  createScenario,
} from '@odyssage/database/src/queries/insert';
import {
  getScenariosByUid,
  getScenarioById,
} from '@odyssage/database/src/queries/select';
import { updateScenario } from '@odyssage/database/src/queries/update';
import {
  userParamSchema,
  scenarioRequestSchema,
  scenarioUpdateRequestSchema,
  userScenarioParamSchema,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { authorizeMiddleware } from '../middleware/authorizeMIddleware';
import { Logger } from '../utils/logger';

/**
 * シナリオ作成者（Author）文脈のエンドポイント
 * - POST /{uid}/scenarios: 新しいシナリオを作成
 * - GET /{uid}/scenarios: 指定Authorが作成したシナリオ一覧を取得
 * - PUT /{uid}/scenarios/{id}: Authorがシナリオを更新
 */
export const authorsRoute = new Hono<Env>()
  .use('/:uid/scenarios/:id', authorizeMiddleware)
  .use('/:uid/scenarios', authorizeMiddleware)
  .post(
    '/:uid/scenarios',
    vValidator('param', userParamSchema),
    vValidator('json', scenarioRequestSchema),
    async (c) => {
      try {
        const param = c.req.valid('param');
        const json = c.req.valid('json');

        await createScenario(c.env.NEON_CONNECTION_STRING, {
          id: json.id,
          title: json.title,
          userId: param.uid,
          overview: json.overview,
          visibility: json.visibility ?? 'private', // デフォルト値を適用
        });

        // 既存実装と完全同一のレスポンス形式を維持
        return c.json({ message: 'Scenario created successfully' }, 201);
      } catch (error) {
        Logger.error('Author シナリオ作成エラー:', error);
        return c.json({ message: 'シナリオの作成に失敗しました' }, 500);
      }
    },
  )
  .get(
    '/:uid/scenarios', 
    vValidator('param', userParamSchema), 
    async (c) => {
      try {
        const param = c.req.valid('param');
        const data = await getScenariosByUid(
          c.env.NEON_CONNECTION_STRING,
          param.uid,
        );

        // 既存実装と完全同一のレスポンス形式を維持
        return c.json(data);
      } catch (error) {
        Logger.error('Author シナリオ一覧取得エラー:', error);
        return c.json({ message: 'シナリオ一覧の取得に失敗しました' }, 500);
      }
    }
  )
  .put(
    '/:uid/scenarios/:id',
    vValidator('param', userScenarioParamSchema),
    vValidator('json', scenarioUpdateRequestSchema),
    async (c) => {
      try {
        const param = c.req.valid('param');
        const json = c.req.valid('json');

        await updateScenario(c.env.NEON_CONNECTION_STRING, {
          id: param.id,
          title: json.title,
          overview: json.overview,
          visibility: json.visibility,
        });

        // 既存実装と同一のレスポンス形式（204 No Content）
        return c.body(null, 204);
      } catch (error) {
        Logger.error('Author シナリオ更新エラー:', error);
        return c.json({ message: 'シナリオの更新に失敗しました' }, 500);
      }
    },
  );