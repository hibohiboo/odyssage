# フォルダ責任範囲と開発指針 - Event実装アーキテクチャ

## 📅 作成情報

**作成日時**: 2025-08-17 23:50  
**作成者**: 実装担当  
**対象**: Sprint 4 Event概念実装における正しいアーキテクチャ分離  
**背景**: packages/ui での状態管理実装の誤認識を受けた緊急整理

## 🏗️ フォルダ責任範囲の明確化

### **packages/ui/src** - UIコンポーネントライブラリ
```typescript
// ✅ 正しい責務
export interface PlaySessionConfig {
  eventEngine: UseEventEngineProps;
  sessionInfo: { sessionId: string; title: string };
}

// ✅ UIコンポーネントの定義
export function PlaySessionView({ config, onMenuAccess, onExitSession }: PlaySessionViewProps) {
  // プレゼンテーション層のみ
  // 状態管理は外部から受け取る
}

// ❌ 実装すべきでない
// - Redux store設定
// - API通信ロジック  
// - ビジネスルール実装
// - グローバル状態管理
```

**責務**:
- **再利用可能UIコンポーネント**: Button, Input, Modal等
- **プレゼンテーション専用**: 表示ロジックのみ
- **型定義・インターフェース**: Props型・UI関連型の定義
- **Storybook Stories**: コンポーネント文書化

**制約**:
- 状態管理ライブラリ（Redux等）の直接使用禁止
- API呼び出しの直接実装禁止
- ビジネスロジックの実装禁止

---

### **apps/frontend/src** - フロントエンドアプリケーション
```typescript
// ✅ 正しい責務: アプリケーション層
// app/store/eventEngineSlice.ts
export const eventEngineSlice = createSlice({
  name: 'eventEngine',
  initialState: { scenes: [], currentSession: null },
  reducers: {
    loadScenes: (state, action) => {
      state.scenes = action.payload;
    },
    updateCurrentEvent: (state, action) => {
      // 状態更新ロジック
    }
  }
});

// ✅ 正しい責務: 機能層
// features/player/eventEngine/useEventEngineWithStore.ts
export function useEventEngineWithStore(config: PlaySessionConfig) {
  const dispatch = useAppDispatch();
  const { scenes, currentSession } = useAppSelector(state => state.eventEngine);
  
  const eventEngine = useEventEngine({
    scenes,
    sessionId: config.sessionInfo.sessionId,
    startingSceneId: scenes[0]?.startingSceneId || '',
    onAutoSave: async (sessionState) => {
      await saveSessionToAPI(sessionState);
      dispatch(updateSessionState(sessionState));
    }
  });
  
  return eventEngine;
}

// ✅ 正しい責務: ページ層
// pages/play-session/PlaySessionPage.tsx
export function PlaySessionPage() {
  const { sessionId } = useParams();
  const eventEngine = useEventEngineWithStore({
    eventEngine: { /* 設定 */ },
    sessionInfo: { sessionId, title: 'Session Title' }
  });
  
  return (
    <PlaySessionView
      config={{
        eventEngine: eventEngine,
        sessionInfo: { sessionId, title: 'Session Title' }
      }}
      onMenuAccess={() => navigate('/menu')}
      onExitSession={() => navigate('/sessions')}
    />
  );
}
```

**責務**:
- **状態管理**: Redux store, global state管理
- **ビジネスロジック**: useEventEngine等のフック実装
- **API通信**: サーバーとのデータ交換
- **ルーティング**: React Router設定
- **アプリケーション設定**: 環境変数・設定管理

---

## 🔄 Event実装の正しいアーキテクチャフロー

### 1. **Event Engine Core** (packages/ui/src/player/engine/)
```typescript
// EventEngine.ts - Pure TypeScript Business Logic
export class EventEngine {
  // ドメインロジック・Event処理のみ
  executeChoiceEvent(choiceId: string): EventExecutionResult
  executeContinueEvent(): EventExecutionResult
  executeSceneTransition(): EventExecutionResult
}

// useEventEngine.ts - React Hook (状態管理なし)
export function useEventEngine(props: UseEventEngineProps) {
  // React hooks + EventEngine連携
  // 外部からの状態管理には依存しない
}
```

### 2. **State Management** (apps/frontend/src/app/store/)
```typescript
// eventEngineSlice.ts
export const eventEngineSlice = createSlice({
  name: 'eventEngine',
  initialState: EventEngineState,
  reducers: {
    loadScenes: (state, action) => { /* 状態更新 */ },
    updateCurrentEvent: (state, action) => { /* 状態更新 */ },
    saveSessionState: (state, action) => { /* 状態更新 */ }
  }
});
```

### 3. **Business Logic Integration** (apps/frontend/src/features/)
```typescript
// features/player/hooks/useEventEngineWithStore.ts
export function useEventEngineWithStore(config: PlaySessionConfig) {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.eventEngine);
  
  // packages/ui の useEventEngine を使用
  const engine = useEventEngine({
    scenes: state.scenes,
    sessionId: config.sessionInfo.sessionId,
    onAutoSave: async (sessionState) => {
      // Redux store更新
      dispatch(saveSessionState(sessionState));
      // API保存
      await api.saveSession(sessionState);
    }
  });
  
  return engine;
}
```

### 4. **UI Component Usage** (apps/frontend/src/pages/)
```typescript
// pages/play-session/PlaySessionPage.tsx
export function PlaySessionPage() {
  const eventEngine = useEventEngineWithStore(config);
  
  return (
    <PlaySessionView
      config={{
        eventEngine: eventEngine,
        sessionInfo: { sessionId: 'session-001', title: 'Forest Adventure' }
      }}
      onMenuAccess={() => navigate('/menu')}
      onExitSession={() => navigate('/sessions')}
    />
  );
}
```

## 🎯 開発指針とベストプラクティス

### **packages/ui** 開発指針

#### ✅ 実装すべきもの
```typescript
// 1. Pure UI Components
export function ChoiceOption({ text, onClick }: ChoiceOptionProps) {
  return <button onClick={onClick}>{text}</button>;
}

// 2. UI特化型定義
export interface PlaySessionViewProps {
  config: PlaySessionConfig;
  onMenuAccess: () => void;
  onExitSession: () => void;
}

// 3. プレゼンテーション専用Hook
export function useEventEngine(props: UseEventEngineProps) {
  // React state + EventEngine の統合のみ
  // 外部依存なし
}

// 4. ドメインロジック（Pure TypeScript）
export class EventEngine {
  // ビジネスルール実装
  // React/Redux依存なし
}
```

#### ❌ 実装してはいけないもの
```typescript
// Redux store設定
const store = configureStore({ /* */ }); // ❌

// API通信
const response = await fetch('/api/sessions'); // ❌

// ルーティング
const navigate = useNavigate(); // ❌

// グローバル状態管理
const dispatch = useAppDispatch(); // ❌
```

### **apps/frontend** 開発指針

#### ✅ 実装すべきもの
```typescript
// 1. Redux Store設定
export const store = configureStore({
  reducer: {
    eventEngine: eventEngineSlice.reducer,
    auth: authSlice.reducer
  }
});

// 2. API通信
export async function saveSessionToAPI(sessionState: SessionState) {
  return await api.post('/api/sessions', sessionState);
}

// 3. ビジネスロジック統合
export function useEventEngineWithStore(config: PlaySessionConfig) {
  const dispatch = useAppDispatch();
  const eventEngine = useEventEngine(/* packages/ui hook */);
  return eventEngine;
}

// 4. アプリケーション設定
export const router = createBrowserRouter([
  { path: '/play/:sessionId', Component: PlaySessionPage }
]);
```

## 🔧 実装修正指針

### 現在の修正が必要な箇所

#### 1. **PlaySessionView** (packages/ui)
```typescript
// ❌ 現在: Event Engine統合をコンポーネント内で実装
export function PlaySessionView({ config }: PlaySessionViewProps) {
  const eventEngine = useEventEngine(config.eventEngine); // ❌
  // ...
}

// ✅ 修正後: Event Engineは外部から受け取る
export function PlaySessionView({ 
  currentScene,
  currentEvent, 
  onChoiceSelect,
  onContinue,
  onMenuAccess,
  onExitSession,
  loading,
  autoSaveStatus
}: PlaySessionViewProps) {
  // プレゼンテーション専用
}
```

#### 2. **Event Engine Hook** (packages/ui)
```typescript
// ✅ 現在の useEventEngine は正しい
// packages/ui/src/player/hooks/useEventEngine.ts
export function useEventEngine(props: UseEventEngineProps) {
  // React hooks + EventEngine
  // 外部依存なし - 正しい実装
}
```

#### 3. **State Management** (apps/frontend - 新規作成必要)
```typescript
// 新規作成: apps/frontend/src/app/store/eventEngineSlice.ts
export const eventEngineSlice = createSlice({
  name: 'eventEngine',
  initialState: {
    scenes: [],
    currentSession: null,
    loading: false
  },
  reducers: {
    // Redux actions
  }
});
```

## 📋 具体的な作業計画

### Phase 1: packages/ui 修正
1. **PlaySessionView Props修正**: Event Engine統合を削除し、プレゼンテーション専用に
2. **型定義整理**: UI特化の型定義に修正
3. **useEventEngine維持**: 現在の実装は正しいため維持

### Phase 2: apps/frontend Event実装
1. **Redux Slice作成**: eventEngineSlice.ts
2. **API Layer作成**: Event関連API通信
3. **Business Hook作成**: useEventEngineWithStore.ts
4. **Page Layer作成**: PlaySessionPage.tsx

### Phase 3: 統合テスト
1. **Component Storybook**: packages/ui コンポーネント確認
2. **Integration Test**: apps/frontend での統合動作確認
3. **E2E Test**: 実際のユーザーフロー確認

## 🎯 アーキテクチャ判断基準

### 「どこに実装すべきか」の判断フロー
```typescript
interface ImplementationDecision {
  question: string;
  if_yes: string;
  if_no: string;
}

const decisions: ImplementationDecision[] = [
  {
    question: "Reactコンポーネント・UI表示ロジックか？",
    if_yes: "packages/ui に実装",
    if_no: "次の質問へ"
  },
  {
    question: "Redux store・API通信・ルーティングか？",
    if_yes: "apps/frontend に実装",
    if_no: "次の質問へ"
  },
  {
    question: "Pure TypeScript・ドメインロジックか？",
    if_yes: "packages/ui/engine に実装",
    if_no: "アーキテクチャ見直し必要"
  }
];
```

## 🔗 関連ドキュメント

- [フロントエンドアーキテクチャ設計](../../../02-architecture/frontend-architecture.md)
- [Player文脈データ設計](../../../02-architecture/player-context/data-design.md)
- [システム概要](../../../02-architecture/overview.md)

---

**まとめ**: Event実装においては、**packages/ui**は純粋なUIコンポーネント・型定義・Presentation専用Hook、**apps/frontend**は状態管理・API通信・ビジネスロジック統合を担当する。この分離により、再利用性・保守性・テスタビリティを確保する。

#architecture #event-implementation #folder-structure #development-guidelines #separation-of-concerns