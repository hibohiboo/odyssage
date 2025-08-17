# Player文脈MVP実装支援資料

## 📋 基本情報

**作成者**: リーダー  
**対象者**: 実装担当  
**作成日時**: 2025-08-17 午後  
**対象Sprint**: Sprint 4 - Player文脈MVP実装

## 🎯 リーダーからの実装支援指針

### 実装チームの専門性尊重
- **実装方針決定**: 実装担当の技術判断・設計決定を尊重
- **要件・制約明確化**: MVP制約・Event概念要件の明確な伝達
- **環境・リソース支援**: 必要な技術情報・設計文書の提供
- **調整・連携促進**: チーム間協働・課題解決の調整支援

## 🏗️ 技術要件・制約事項

### 必須技術要件
```typescript
// 設計文書準拠技術
- React Router v7: 宣言的ルーティング（architecture.md準拠）
- TypeScript: 厳格な型安全性適用
- Event概念: data-design.mdのEvent構造正確な実装

// 必須品質基準
- packages/ui: Component品質・StoryBook統合
- MVP制約: 除外機能の実装回避徹底
- Chrome最新版: MVP制約に基づく環境制約
```

### Event概念実装要件
```typescript
// MVP必須Event（完全実装必須）
- choice: 選択肢表示・選択・nextEventId遷移
- narrative: 物語テキスト表示・読み進め・nextEventId遷移  
- scene_transition: targetSceneId取得・シーン遷移・新シーン読み込み

// MVP最小限Event（簡素実装）
- dialogue: NPC名・テキスト基本表示
- exploration: 探索対象・結果基本テキスト表示

// 実装禁止Event（Phase 2以降）
- item_acquire, skill_use, condition: 実装しない
```

## 🎮 Event概念理解支援

### data-design.md Event概念参照
Event概念の詳細仕様・構造は以下を参照：
- **Event概念定義**: docs/02-architecture/player-context/data-design.md (131-238行)
- **EventType分類**: MVP必須・最小限・将来拡張の分類
- **Event構造**: Event・Scene・PlayRecordの関係性

### Event処理実装例・参考資料
Event処理の実装アプローチ例は以下で確認可能：
- **画面設計**: docs/02-architecture/player-context/screens/play-session.md
- **Event処理UI**: EventType別UI仕様・処理フロー・状態管理設計
- **実装指針**: Event処理の確実な動作・MVP制約適用方針

## 🗄️ データ管理・永続化実装

### LocalStorage状態管理
```typescript
// SessionStorageManager
class SessionStorageManager {
  private readonly STORAGE_KEYS = {
    CURRENT_SESSION: 'player_current_session',
    EVENT_HISTORY: 'player_event_history',
    PLAY_STATE: 'player_play_state'
  } as const;

  // セッション状態保存
  saveSessionState(sessionId: string, state: PlaySessionState): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.CURRENT_SESSION,
        JSON.stringify({ sessionId, state, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Session state save failed:', error);
    }
  }

  // Event履歴保存（Event毎の自動保存）
  saveEventHistory(sessionId: string, eventHistory: PlayEvent[]): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEYS.EVENT_HISTORY,
        JSON.stringify({ sessionId, eventHistory, timestamp: Date.now() })
      );
    } catch (error) {
      console.error('Event history save failed:', error);
    }
  }

  // 状態復旧
  loadSessionState(sessionId: string): PlaySessionState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.CURRENT_SESSION);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      if (parsed.sessionId === sessionId) {
        return parsed.state;
      }
      return null;
    } catch (error) {
      console.error('Session state load failed:', error);
      return null;
    }
  }
}

// Redux Toolkit Slice
const playSessionSlice = createSlice({
  name: 'playSession',
  initialState: {
    currentSession: null as PlaySession | null,
    currentEvent: null as Event | null,
    eventHistory: [] as PlayEvent[],
    uiState: {
      loading: false,
      error: null,
      eventProcessing: false
    }
  },
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    addEventToHistory: (state, action) => {
      state.eventHistory.push(action.payload);
      // LocalStorage自動保存
      if (state.currentSession) {
        sessionStorageManager.saveEventHistory(
          state.currentSession.id,
          state.eventHistory
        );
      }
    },
    setEventProcessing: (state, action) => {
      state.uiState.eventProcessing = action.payload;
    }
  }
});
```

## 📱 画面実装詳細指針

### 1. session-list画面実装
```typescript
// SessionListPage.tsx
const SessionListPage: React.FC = () => {
  const { data: sessions, error, isLoading } = useSWR(
    '/api/player/sessions',
    fetcher
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="session-list-page">
      <PageHeader title="セッション一覧" />
      <SessionListView 
        sessions={sessions}
        onSessionSelect={(sessionId) => 
          navigate(`/player/sessions/${sessionId}`)
        }
      />
    </div>
  );
};

// SessionListView Component (packages/ui)
const SessionListView: React.FC<SessionListViewProps> = ({
  sessions,
  onSessionSelect
}) => {
  return (
    <div className="session-list-view">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onClick={() => onSessionSelect(session.id)}
        />
      ))}
    </div>
  );
};
```

### 2. session-detail画面実装
```typescript
// SessionDetailPage.tsx
const SessionDetailPage: React.FC = () => {
  const { sessionId } = useParams();
  const { data: session, error, isLoading } = useSWR(
    `/api/player/sessions/${sessionId}`,
    fetcher
  );

  const handleJoinSession = async () => {
    try {
      await joinSession(sessionId);
      navigate(`/player/sessions/${sessionId}/play`);
    } catch (error) {
      console.error('Join session failed:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="session-detail-page">
      <SessionDetailView
        session={session}
        onJoin={handleJoinSession}
      />
    </div>
  );
};
```

### 3. play-session画面実装
```typescript
// PlaySessionPage.tsx
const PlaySessionPage: React.FC = () => {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, eventHistory, uiState } = useSelector(selectPlaySession);
  const eventProcessor = useEventProcessor();

  // セッション状態復旧
  useEffect(() => {
    const loadSession = async () => {
      const savedState = sessionStorageManager.loadSessionState(sessionId);
      if (savedState) {
        dispatch(setCurrentSession(savedState.session));
        dispatch(setCurrentEvent(savedState.currentEvent));
      } else {
        // 新規セッション開始
        await startNewSession(sessionId);
      }
    };

    loadSession();
  }, [sessionId]);

  // Event処理ハンドラー
  const handleChoiceSelect = async (choiceId: string) => {
    const result = await eventProcessor.processChoice(currentEvent.id, choiceId);
    
    // Event履歴保存
    dispatch(addEventToHistory({
      eventId: currentEvent.id,
      choiceId,
      timestamp: Date.now()
    }));

    // 次Event実行
    if (result.nextEventId) {
      await eventProcessor.executeEvent(result.nextEventId);
    }
  };

  const handleEventContinue = async () => {
    if (currentEvent.nextEventId) {
      await eventProcessor.executeEvent(currentEvent.nextEventId);
    }
  };

  const handleSceneTransition = async (targetSceneId: string) => {
    await eventProcessor.transitionToScene(targetSceneId);
  };

  if (uiState.loading) return <LoadingSpinner />;
  if (uiState.error) return <ErrorMessage error={uiState.error} />;

  return (
    <div className="play-session-page">
      <PlaySessionView
        event={currentEvent}
        onChoiceSelect={handleChoiceSelect}
        onContinue={handleEventContinue}
        onSceneTransition={handleSceneTransition}
        disabled={uiState.eventProcessing}
      />
    </div>
  );
};

// PlaySessionView Component (packages/ui)
const PlaySessionView: React.FC<PlaySessionViewProps> = ({
  event,
  onChoiceSelect,
  onContinue,
  onSceneTransition,
  disabled
}) => {
  if (!event) return <NoEventMessage />;

  return (
    <div className="play-session-view">
      <EventProcessingView
        event={event}
        onChoiceSelect={onChoiceSelect}
        onContinue={onContinue}
        onSceneTransition={onSceneTransition}
        disabled={disabled}
      />
    </div>
  );
};

// EventProcessingView Component (packages/ui)
const EventProcessingView: React.FC<EventProcessingViewProps> = ({
  event,
  onChoiceSelect,
  onContinue,
  onSceneTransition,
  disabled
}) => {
  switch (event.type) {
    case 'choice':
      return (
        <ChoiceEventComponent
          event={event}
          onChoiceSelect={onChoiceSelect}
          disabled={disabled}
        />
      );
    case 'narrative':
      return (
        <NarrativeEventComponent
          event={event}
          onContinue={onContinue}
        />
      );
    case 'scene_transition':
      return (
        <SceneTransitionEventComponent
          event={event}
          onTransition={onSceneTransition}
        />
      );
    case 'dialogue':
      return (
        <DialogueEventComponent
          event={event}
          onContinue={onContinue}
        />
      );
    case 'exploration':
      return (
        <ExplorationEventComponent
          event={event}
          onContinue={onContinue}
        />
      );
    default:
      return <UnsupportedEventMessage eventType={event.type} />;
  }
};
```

## 🎨 CSS・スタイリング指針

### スタイリング戦略
```typescript
// CSS-in-JS + CSS Modules併用
// Component内スタイリング: styled-components or emotion
// 共通スタイル: CSS Modules

// packages/ui Componentスタイリング例
const ChoiceOption = styled.button<{ selected: boolean; disabled: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#007bff' : '#e9ecef'};
  border-radius: 8px;
  background: ${props => props.selected ? '#f8f9fa' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #007bff;
    background: #f8f9fa;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

// レスポンシブデザイン（Chrome最新版制約）
const ResponsiveContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;
```

## 🧪 テスト実装指針

### Unit Test実装
```typescript
// Event処理Hook Test
describe('useEventProcessor', () => {
  it('should execute choice event correctly', async () => {
    const { result } = renderHook(() => useEventProcessor());
    
    const choiceEvent = createMockChoiceEvent();
    await act(async () => {
      await result.current.executeEvent(choiceEvent.id);
    });

    expect(result.current.state.currentEvent).toEqual(choiceEvent);
    expect(result.current.state.status).toBe('displaying');
  });

  it('should process choice selection correctly', async () => {
    const { result } = renderHook(() => useEventProcessor());
    
    await act(async () => {
      await result.current.processChoice('event1', 'choice1');
    });

    expect(mockEventHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: 'event1',
        choiceId: 'choice1'
      })
    );
  });
});

// Component Test
describe('ChoiceEventComponent', () => {
  it('should render choice options correctly', () => {
    const mockEvent = createMockChoiceEvent();
    const mockOnSelect = jest.fn();

    render(
      <ChoiceEventComponent
        event={mockEvent}
        onChoiceSelect={mockOnSelect}
      />
    );

    expect(screen.getByText(mockEvent.content)).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(mockEvent.data.choices.length);
  });

  it('should handle choice selection', async () => {
    const mockEvent = createMockChoiceEvent();
    const mockOnSelect = jest.fn();

    render(
      <ChoiceEventComponent
        event={mockEvent}
        onChoiceSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('選択肢1'));
    expect(mockOnSelect).toHaveBeenCalledWith('choice1');
  });
});
```

### StoryBook Story作成
```typescript
// ChoiceEventComponent.stories.tsx
export default {
  title: 'Player/Events/ChoiceEventComponent',
  component: ChoiceEventComponent,
  parameters: {
    docs: {
      description: {
        component: 'TRPG選択肢イベント表示Component。プレイヤーの選択を処理する。'
      }
    }
  }
} as Meta;

export const Default: Story = {
  args: {
    event: {
      id: 'choice1',
      type: 'choice',
      content: '目の前に二つの道がある。どちらを選ぶか？',
      data: {
        choices: [
          { id: 'choice1', text: '左の道を進む', description: '森の奥へ続く道' },
          { id: 'choice2', text: '右の道を進む', description: '山の方へ続く道' }
        ]
      }
    },
    onChoiceSelect: action('choice-selected')
  }
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true
  }
};

export const ManyChoices: Story = {
  args: {
    event: {
      ...Default.args.event,
      data: {
        choices: [
          { id: 'choice1', text: '攻撃する' },
          { id: 'choice2', text: '逃げる' },
          { id: 'choice3', text: '話しかける' },
          { id: 'choice4', text: '様子を見る' },
          { id: 'choice5', text: 'アイテムを使う' }
        ]
      }
    },
    onChoiceSelect: action('choice-selected')
  }
};
```

## 🚨 重要な実装制約・注意事項

### MVP制約厳守
1. **除外機能実装禁止**: フィルタリング・ジャンル表示・参加者数表示・再プレイ・キーボード操作
2. **演出最小限**: 派手なアニメーション・エフェクト・タイプライター効果
3. **確実性優先**: 複雑な実装より確実な動作・基本的な応答性

### Event処理実装注意
1. **data-design.md完全準拠**: Event概念・EventType・データ構造の正確な実装
2. **MVP Event優先**: choice・narrative・scene_transitionの完全実装優先
3. **最小限Event**: dialogue・explorationは基本的なテキスト表示のみ
4. **Phase 2除外Event**: item_acquire・skill_use・conditionは実装しない

### 品質基準遵守
1. **TypeScript厳格**: 型安全性・厳格な型チェック
2. **人間可読性**: 既存vercel v0コード参考禁止・可読性重視
3. **Component品質**: StoryBook必須・視覚的品質確認
4. **テスト品質**: Unit Test・Component Test必須

### 状態管理・永続化注意
1. **Event毎自動保存**: LocalStorageでの確実な状態保存
2. **エラーハンドリング**: Event処理失敗時の適切な復旧
3. **状態同期**: Redux・SWR・LocalStorageの適切な同期

## 📋 実装完了チェックリスト

### Event処理実装
- [ ] choice Event: 選択肢表示・選択・nextEventId遷移の完全実装
- [ ] narrative Event: テキスト表示・読み進め・nextEventId遷移の完全実装
- [ ] scene_transition Event: targetSceneId取得・シーン遷移・新シーン読み込みの完全実装
- [ ] dialogue Event: NPC名・テキスト表示の簡素実装
- [ ] exploration Event: 探索対象・結果の基本テキスト表示

### 画面実装
- [ ] session-list画面: セッション一覧・パフォーマンス要件
- [ ] session-detail画面: セッション詳細・参加フロー
- [ ] play-session画面: Event処理・プレイ体験

### Component実装
- [ ] packages/ui Component: AtomicDesign・StoryBook統合
- [ ] Player文脈専用Component: 再利用可能・体系的構造
- [ ] 視覚的品質: StoryBook・Component品質確認

### 状態管理・永続化
- [ ] Redux Toolkit: Event処理状態・セッション状態管理
- [ ] LocalStorage: Event毎自動保存・状態復旧
- [ ] SWR: データフェッチング・キャッシュ管理

### テスト実装
- [ ] Unit Test: Hook・Component・ユーティリティ関数
- [ ] Component Test: StoryBook・視覚テスト
- [ ] Event処理Test: Event実行・選択処理・状態管理

---

**技術実装の成功指標**:

1. **Event概念実装**: data-design.mdの正確な実装・TRPG体験の確実な実現
2. **MVP制約遵守**: 除外機能回避・確実性優先の実装
3. **Component品質**: packages/ui・StoryBookでの視覚的品質確認
4. **型安全性**: TypeScript厳格適用・型安全性確保
5. **状態管理**: Event履歴・セッション状態の確実な保存・復旧

**次ステップ**: 実装環境確認・packages/ui基盤構築・session-list画面実装開始

#technical-guidelines #event-concept-implementation #packages-ui #redux-toolkit #storybook #collaboration-v2