// filepath: d:\projects\odyssage\apps\backend\src\route\session.ts
import { vValidator } from '@hono/valibot-validator';
import { createSession } from '@odyssage/database/src/queries/insert';
import {
  getSessionById,
  getSessions,
  getSessionsByGmId,
} from '@odyssage/database/src/queries/select';
import {
  idSchema,
  parse,
  sessionRequestSchema,
  sessionStatuSchema,
} from '@odyssage/schema/src/schema';
import { Hono } from 'hono';
import { generateUUID } from '../utils/generateUUID';
import { Logger } from '../utils/logger';

/**
 * セッション関連のエンドポイント
 * - GET /sessions: セッション一覧を取得（公開のみ、またはGM IDを指定）
 * - POST /sessions: 新しいセッションを作成
 * - GET /sessions/:id: 特定のセッションを取得
 * - GET /sessions/gm/:gm_id: 特定のGMが管理するセッション一覧を取得
 */
export const sessionRoute = new Hono<Env>()
  // 1. 特定のパスを持つルートを先に定義
  .get('/gm/:gm_id', async (c) => {
    try {
      const gmId = c.req.param('gm_id');

      if (!gmId) {
        return c.json({ message: 'GM IDが必要です' }, 400);
      }

      const sessions = await getSessionsByGmId(
        c.env.NEON_CONNECTION_STRING,
        gmId,
      );

      // 直接キャメルケースのプロパティ名を指定してレスポンス
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
      Logger.error('セッション一覧取得エラー:', error);
      return c.json({ message: 'セッション一覧の取得に失敗しました' }, 500);
    }
  })
  // 2. セッション一覧を取得するルートを定義
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
  // 3. POST リクエストを処理するエンドポイント
  .post('/', vValidator('json', sessionRequestSchema), async (c) => {
    try {
      const json = c.req.valid('json');
      console.log('Received JSON:', json);
      // UUIDを生成
      const sessionId = generateUUID();

      // セッションをデータベースに登録
      await createSession(c.env.NEON_CONNECTION_STRING, {
        id: sessionId,
        gmId: json.gmId,
        scenarioId: json.scenarioId,
        title: json.title,
        status: '準備中',
      });

      // 作成したセッションを取得
      const [createdSession] = await getSessionById(
        c.env.NEON_CONNECTION_STRING,
        sessionId,
      );

      if (!createdSession) {
        return c.json({ message: 'Failed to retrieve created session' }, 500);
      }

      // レスポンス形式に整形し、直接キャメルケースのプロパティ名を指定
      const response = {
        id: createdSession.id,
        gmId: createdSession.gmId,
        scenarioId: createdSession.scenarioId,
        title: createdSession.title,
        status: createdSession.status,
        createdAt: createdSession.createdAt.toISOString(),
      };

      return c.json(response, 201);
    } catch (error) {
      console.log('Received JSON:', error);
      Logger.error('セッション作成エラー:', error);
      return c.json(
        {
          message: `セッションの作成に失敗しました \n ${JSON.stringify(error)}`,
        },
        500,
      );
    }
  })
  // 4. 単一のセッションを取得するルートを最後に定義
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
