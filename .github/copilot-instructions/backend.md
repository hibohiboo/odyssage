# Copilot バックエンド指示書

## バックエンド利用ライブラリ

用途|ライブラリ
--|--
バックエンドフレームワーク|hono

## バックエンドの規約
- APIを追加するときには docs\redocly\openapi\api.yaml にOpenAPIで追記すること。説明は日本語で書くこと
- APIのバリデーションは packages\schema にバリデーションスキーマを定義してそれを利用すること
- RDBを利用するときは packages\database 以下のファイルを永続化層アダプタとして利用すること
- RDBを利用するときにテーブル定義が不足していた場合は packages\database 以下でコードファーストで作成すること
- GraphDBを利用するときは packages\graph-database 以下のファイルを永続化層アダプタとして利用すること

## API実装事例

### セッション状態更新APIの実装例

以下は `PATCH /api/gm/:uid/sessions/:id` というエンドポイントの実装例です。このAPIはGMがセッションの状態（「準備中」「進行中」「終了」）を更新するためのものです。

#### 実装手順

1. **データベース層の実装**:
```typescript
// packages/database/src/queries/update_session.ts
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { sessionsTable } from '../schema';

/**
 * セッションのステータスを更新する関数
 * @param connectionString データベース接続文字列
 * @param data セッションID、ステータス情報
 */
export async function updateSessionStatus(
  connectionString: string,
  data: { id: string; status: string },
) {
  const db = getDb(connectionString);
  await db
    .update(sessionsTable)
    .set({ status: data.status })
    .where(eq(sessionsTable.id, data.id));
}
```

2. **バリデーションスキーマの定義**:
```typescript
// packages/schema/src/schema.ts の一部
export const sessionStatuSchema = v.picklist([
  '準備中',
  '進行中',
  '終了',
] as const);
export type SessionStatuSchema = v.InferOutput<typeof sessionStatuSchema>;

// 状態更新用のリクエストスキーマ
export const sessionStatusUpdateSchema = v.object({
  status: sessionStatuSchema,
});
export type SessionStatusUpdate = v.InferOutput<typeof sessionStatusUpdateSchema>;
```

3. **ルートの定義**:
```typescript
// apps/backend/src/route/gm.ts
export const gmRoute = new Hono<Env>()
  .use('/:uid/*', authorizeMiddleware)
  .patch(
    '/:uid/sessions/:id',
    vValidator('param', idSchema),
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

        // 更新後のセッションを取得して返す
        // ...省略
      } catch (error) {
        // エラーハンドリング
        // ...省略
      }
    },
  );
```

4. **OpenAPIドキュメントの更新**:
   
   a. `api.yaml` への新しいパスの追加:
   ```yaml
   /api/gm/{uid}/sessions/{id}:
     $ref: './paths/gmSessionUpdate.yaml'
   ```

   b. パスの詳細を記述した新ファイル `gmSessionUpdate.yaml`:
   ```yaml
   parameters:
     - name: uid
       in: path
       description: GMのユーザーID
       required: true
       schema:
         type: string
     # ...以下省略
   
   patch:
     summary: セッション状態更新
     description: |
       GMが自分のセッションの状態を更新するためのエンドポイント。
       # ...以下省略
   ```

## HTTP メソッドとCORSの設定

1. **必要なHTTPメソッドの許可**:
   - バックエンドAPIでは、必要なすべてのHTTPメソッドを明示的に許可する必要があります
   - 特に`PATCH`メソッドを使用するエンドポイントがある場合は、CORSの`allowMethods`に必ず含めてください

```typescript
// apps/backend/src/index.ts - 正しい例
const app = new Hono<Env>()
  .use(
    '/api/*',
    cors({
      origin: [
        'https://odyssage.pages.dev',
        'https://develop.odyssage.pages.dev',
        'http://localhost:5173',
      ],
      // PATCHメソッドを含むすべての必要なメソッドを許可
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  )
```

## パラメータバリデーションとスキーマ設計

1. **複合パラメータのバリデーション**:
   - 複数のパラメータが必要なエンドポイントでは、それらをまとめて検証するスキーマを作成します
   - 例: ID と UID の両方が必要な場合は、個別のスキーマではなく複合スキーマを使用します

```typescript
// packages/schema/src/schema.ts - 正しい例
export const idSchema = v.object({
  id: v.string(),
});

// 複合パラメータ用のスキーマ
export const idUidSchema = v.object({
  id: v.string(),
  uid: v.string(),
});

// 使用例
vValidator('param', idUidSchema)
```

## API リクエスト/レスポンスの命名規則

1. **一貫した命名規則の使用**:
   - バックエンドとフロントエンド間の通信では、一貫した命名規則（キャメルケースまたはスネークケース）を使用します
   - プロジェクト全体でキャメルケースを採用する場合、API のリクエスト・レスポンスもすべてキャメルケースに統一します

2. **データベースとAPI間の変換**:
   - データベース（通常はスネークケース）と API（キャメルケース）の間に命名規則の差異がある場合、明示的な変換を行います
   - 変換は一貫した場所（データアクセスレイヤーやAPI応答前）で行うことを推奨します

```typescript
// データベースからの結果（スネークケース）をAPI応答（キャメルケース）に変換
return c.json({
  id: session.id,
  title: session.title,
  gmId: session.gm_id,           // スネークケースからキャメルケースに変換
  scenarioId: session.scenario_id, // スネークケースからキャメルケースに変換
  scenarioTitle: session.scenario_title,
});
```
