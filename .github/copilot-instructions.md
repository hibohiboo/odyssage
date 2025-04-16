# Copilot Instructions
## ソフトウェア設計

- 単一責任の原則に従う。クラス・関数は１つの役割のみを実行すること
- 依存性逆転の原則に従う。外部の依存関係はインターフェースを介して注入すること
- KISS原則に従う。可能な限り複雑さを避け、シンプルで誰にでも理解しやすいアーキテクチャとすること
- YAGNI原則に従う。今必要ないものは作らないこと
- DRY原則に従う。無駄な重複は避けること。ただし、過度な共通化はしないこと。


## コーディングスタイル
- 条件文ではネストを避け、コードの可読性を高めるために早期リターンを使用すること
- クラス及び関数には適切なドキュメントコメントを追加する。各関数やクラスにはその目的や使用方法を説明するコメントを追加すること
- 実装はテスト駆動開発で実施する
  - プロンプトに記載された要件からテストリストを作成すること
  - テストリストを元にテストコードを記述すること
  - テストが通るようにプロダクトコードを記述すること
  - 必ずリファクタリングを実装するか確認すること
  - リファクタリング後はCyclomatic complexityが7以下になるようにすること
  - プロダクトコードとテストコードは一度にすべて記載しないこと
  - テストリストの1ケースずつ実装を進めること
- テストケースは日本語で記載すること
- 関数の宣言位置は使用箇所より前とすること
- コードを直訳はコメントに書かず、何故そのコードにしたのかを記載する
    - bad: `setDefaultTimeout(60 * 1000);` に `// タイムアウトを60秒に設定`
    - good: `setDefaultTimeout(60 * 1000);` に `// 時間がかかるテストなのでタイムアウトを延長 （デフォルトは5秒）`
## 命名規則
- 一般的な用語以外は単語を省略せずに記載すること
  - good: errorCount, dnsConnectionIndex
  - bad: errCnt, dnsIdx
- 変数、定数、カラム名の命名規則
  - 日時を示す場合: 動詞 + at
    - 例: createdAt, allowAt
  - 値がboolean以外の場合： 形容詞 + 名詞
    - 例: allAnimal, freeWord
  - 存在有無を表現するboolean: has + 名詞
    - 例: hasAnimal
- 関数、クラスの命名規則
  - イベント関数: on + 名詞 + 形容詞
    - 例: onArrivalJust, onWageLost
  - 変換、成形関数: to + 名詞
    - 例: toUser, toAnimal
  - 状態を変更: 動詞 + 目的語 + 形容詞
    - 例: deleteUserOld

## フォルダ階層
- フォルダ名は小文字を用いる

## リポジトリ構造

```
odysseyage/
├── apps/
│   ├── backend/             # バックエンドアプリケーション
│   ├── frontend/            # フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── app/         # グローバルなアプリケーション設定（ルート、状態管理など）
│   │   │   ├── entities/    # ドメインエンティティ（Character, Scenarioなど）
│   │   │   ├── features/    # ドメイン機能（キャラクター管理、シナリオ管理など）
│   │   │   ├── pages/       # ページコンポーネント
│   │   │   ├── shared/      # 共通コンポーネント、ユーティリティ
│   │   │   └── widgets/     # UIウィジェット（ヘッダー、フッターなど）
├── packages/
│   ├── schema/              # バリデーションスキーマ。データスキーマ。
│   ├── database/            # データベーススキーマ（インフラ層）。永続化層アダプタ（リポジトリの実装）
│   ├── ui/                  # UIコンポーネントライブラリ
│   ├── lib/                 # 共通ユーティリティ
│   ├── bdd-e2e-test/        # ふるまい駆動のe2eテスト
│   ├── typescript-config    # tsconfig設定
│   └── eslint-config-custom # eslint設定
├── docs/                    # 設計ドキュメント
```

## 共通利用ライブラリ
用途|ライブラリ
--|--
テスト|vitest
言語|typescript

## フロントエンド
### フロントエンド利用ライブラリ

用途|ライブラリ
--|--
フロントエンドからバックエンドへの通信|hono rpc
フロントエンドUIライブラリ|react
ページ遷移ライブラリ|react-router
ライブラリ管理|bun



### フロントエンドの規約
- フロントエンドはFeature-Sliced Designのディレクトリ構成とする
- ビジネスロジックとUIコンポーネントを分けるため、hooksを利用する。
- 再利用可能なUIコンポーネントは packages\ui 以下に記載する
- packages\ui以下にUIコンポーネントを作成したときは、 StorybookのStoryも記載する

### 利用しないライブラリ
- react-router-dom は使わない。 react-router を利用する。

### 利用しない関数
- バックエンドとの通信は fetch ではなく hono rpc を利用する。

## バックエンド
### バックエンド利用ライブラリ

用途|ライブラリ
--|--
バックエンドフレームワーク|hono

### バックエンドの規約
- APIを追加するときには docs\redocly\openapi\api.yaml にOpenAPIで追記すること。説明は日本語で書くこと
- APIのバリデーションは packages\schema にバリデーションスキーマを定義してそれを利用すること
- RDBを利用するときは packages\database 以下のファイルを永続化層アダプタとして利用すること
- RDBを利用するときにテーブル定義が不足していた場合は packages\database 以下でコードファーストで作成すること

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

#### 設計上のポイント

1. **単一責任の原則**: データベース操作、バリデーション、ルートハンドラがそれぞれ異なるファイルで定義され、明確な役割分担
2. **認可**: エンドポイントでuidパラメータとセッションのgm_idの一致を確認
3. **バリデーション**: Valibotを使用したリクエスト内容の検証
4. **エラーハンドリング**: 様々なエラーケース（存在しないセッション、認可エラーなど）に対応
5. **OpenAPI**: ドキュメントを追加してAPIの情報を明確に記述

#### テストにおける注意点

1. **認証ミドルウェアのテスト**: `authorizeMiddleware`を使用するエンドポイントをテストする場合は、リクエストヘッダーに`Authorization`を含めることが必須です。
```typescript
// テスト時の認証ヘッダー例
const headerWithAuth = {
  'Content-Type': 'application/json',
  Authorization: `Bearer test`,  // テスト環境ではこの形式で認証をパスできる
};

// リクエスト送信時にヘッダーを指定
const response = await app.request(
  `/api/gm/${testUserId}/sessions/${testSessionId}`,
  {
    method: 'PATCH',
    headers: headerWithAuth,  // 認証ヘッダーを含める
    body: JSON.stringify(updateData),
  },
  env,
);
```

## Feature-Sliced Design実装のベストプラクティス

### モジュールのエクスポートとインポート

1. **公開APIの設計**:
   - 各スライスは `index.ts` ファイルでパブリックAPIを明示的に定義します
   - 実装の詳細は直接インポートせず、エントリポイント経由でアクセスします

```typescript
// entities/session/index.ts - 正しい例
export { useCreateSession } from './hooks/useCreateSession';
export { useUpdateSessionStatus } from './hooks/useUpdateSessionStatus';

// 他のモジュールからのインポート - 正しい例
import { useUpdateSessionStatus } from '@odyssage/frontend/entities/session';

// 他のモジュールからのインポート - 避けるべき例
import { useUpdateSessionStatus } from '@odyssage/frontend/entities/session/hooks/useUpdateSessionStatus';
```

2. **フックを使用したUI/ロジック分離**:
   - UIコンポーネントとビジネスロジックは明確に分離します
   - カスタムフックにビジネスロジックをカプセル化し、UIコンポーネントはデータ表示と操作のみに集中します

```tsx
// hooks/useSessionEdit.ts - ビジネスロジック
export const useSessionEdit = (sessionData: SessionDetailData | null) => {
  // Reduxからユーザー情報を取得
  const currentUserId = useSelector(uidSelector);
  
  // 状態管理と更新ロジックをカプセル化
  // ...

  return { currentStatus, isGm, loading, handleStatusChange };
};

// ui/SessionEditPage.tsx - 表示ロジックのみ
const SessionEditPage = () => {
  const sessionData = useLoaderData<SessionDetailData | null>();
  const { uid } = useParams<{ uid: string }>();
  
  // ビジネスロジックをフックから取得
  const { currentStatus, isGm, loading, handleStatusChange } = useSessionEdit(sessionData);

  // 表示ロジックのみをここに実装
  // ...
};
```

### Redux Storeの効果的な使用

1. **セレクターの活用**:
   - グローバル状態から特定のデータを取得するには、セレクターを使用します
   - セレクターはコンポーネント内ではなく、スライス定義側で作成し、再利用します

```typescript
// 状態スライスの定義
export const authSlice = createSlice({
  name: 'auth',
  // ...
});

// セレクターを同じファイルで定義
export const uidSelector = createSelector(
  state => state[authSlice.reducerPath],
  auth => auth.uid
);

// コンポーネントやフックでの使用
const currentUserId = useSelector(uidSelector);
```

### コンポーネント設計のガイドライン

1. **単一責任の原則の実践**:
   - 各コンポーネントとフックは単一の責任を持つように設計します
   - 例: `useSessionEdit` はセッション編集の状態と操作のみを扱い、他の機能は含めません

2. **型の共有と再利用**:
   - 共通の型定義は適切な場所に配置し、再利用します
   - 例: `SessionDetailData` 型は関連するローダーモジュールで定義し、複数の場所から参照します

これらのプラクティスに従うことで、コードベースの保守性、可読性、拡張性が向上します。

## APIとルーティングに関する実装ガイドライン

### HTTP メソッドとCORSの設定

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

### パラメータバリデーションとスキーマ設計

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

### API リクエスト/レスポンスの命名規則

1. **一貫した命名規則の使用**:
   - バックエンドとフロントエンド間の通信では、一貫した命名規則（キャメルケースまたはスネークケース）を使用します
   - プロジェクト全体でキャメルケースを採用する場合、API のリクエスト・レスポンスもすべてキャメルケースに統一します

```typescript
// リクエストボディの例 - キャメルケースに統一
const sessionData = {
  gmId: testUserId,      // スネークケース(gm_id)ではなくキャメルケース
  scenarioId: testId,    // スネークケース(scenario_id)ではなくキャメルケース
  title: 'テストセッション',
};

// レスポンスの検証 - キャメルケースに統一
expect(createdSession.title).toBe(sessionData.title);
expect(createdSession.gmId).toBe(sessionData.gmId);        // キャメルケース
expect(createdSession.scenarioId).toBe(sessionData.scenarioId);  // キャメルケース
```

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

3. **テストにおける命名規則の統一**:
   - テストコードでは、APIの実際の動作を正確に反映した命名規則を使用します
   - テストデータ作成時とレスポンス検証時で同じ命名規則を使用します

```typescript
// テストデータ作成（キャメルケース）
const testData = { gmId: 'user-123', title: 'テスト' };

// API呼び出し
const response = await app.request('/api/sessions', {
  method: 'POST',
  body: JSON.stringify(testData)
});

// レスポンス検証（同じくキャメルケース）
const result = await response.json();
expect(result.gmId).toBe(testData.gmId); // 同じ命名規則で検証
```

### フロントエンドUIコンポーネントのデータ連携

1. **必要なすべてのデータフィールドの伝達**:
   - UIコンポーネントには、処理に必要なすべてのデータフィールドを必ず含めます
   - 例: セッションカードがGMのIDを使用する場合、APIからのレスポンスにもそのフィールドを含めます

```typescript
// APIレスポンス形式の例 - 必要なフィールドを含む
return c.json(
  sessions.map((session) => ({
    id: session.id,
    name: session.title,
    gm: session.gmName,
    gmId: session.gmId, // GMのIDを含める
    players: session.players,
    // ...他のフィールド
  })),
);
```

2. **コンポーネント間のプロパティ一貫性**:
   - 親コンポーネントから子コンポーネントに渡すプロパティは型定義を一致させます
   - コールバック関数の引数も正確に一致させる必要があります

```typescript
// 親コンポーネントの型定義
interface SessionListProps {
  onViewDetails?: (id: string, gmId: string) => void; // 両方のパラメータを含む
}

// 子コンポーネントの型定義
interface SessionCardProps {
  onViewDetails?: (id: string, gmId: string) => void; // 親と同じシグネチャ
}
```

### フロントエンドのルーティング設計

1. **一貫したURLパス構造**:
   - APIエンドポイントとフロントエンドのルーティングパスは一貫性を持たせます
   - 例: 単数形/複数形の使い分けを統一する（`/session/:id` vs `/sessions/:id`）

```typescript
// 一貫したパス構造の例
// バックエンドAPI
.patch('/:uid/sessions/:id', ...)

// フロントエンドルーティング - APIと一致させる
{
  path: ':uid/session/:id', // 単数形を使用する場合は一貫して使用する
  element: <SessionEditPage />,
}
```

これらの実装ガイドラインに従うことで、APIとルーティングの一貫性が保たれ、予期せぬエラーやバグを防ぐことができます。


