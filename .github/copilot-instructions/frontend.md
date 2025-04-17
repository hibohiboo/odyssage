# Copilot フロントエンド指示書

## フロントエンド利用ライブラリ

用途|ライブラリ
--|--
フロントエンドからバックエンドへの通信|hono rpc
フロントエンドUIライブラリ|react
ページ遷移ライブラリ|react-router
ライブラリ管理|bun

## フロントエンドの規約
- フロントエンドはFeature-Sliced Designのディレクトリ構成とする
- ビジネスロジックとUIコンポーネントを分けるため、hooksを利用する
- 再利用可能なUIコンポーネントは packages\ui 以下に記載する
- packages\ui以下にUIコンポーネントを作成したときは、StorybookのStoryも記載する

## 利用しないライブラリ
- react-router-dom は使わない。 react-router を利用する

## 利用しない関数
- バックエンドとの通信は fetch ではなく hono rpc を利用する

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

### UIコンポーネントのデータ連携

1. **必要なすべてのデータフィールドの伝達**:
   - UIコンポーネントには、処理に必要なすべてのデータフィールドを必ず含めます
   - 例: セッションカードがGMのIDを使用する場合、APIからのレスポンスにもそのフィールドを含めます

2. **コンポーネント間のプロパティ一貫性**:
   - 親コンポーネントから子コンポーネントに渡すプロパティは型定義を一致させます
   - コールバック関数の引数も正確に一致させる必要があります
