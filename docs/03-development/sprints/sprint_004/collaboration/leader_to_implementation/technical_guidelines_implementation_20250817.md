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

## 🗄️ データ管理・永続化要件

### 必須実装要件
- **Event履歴保存**: Event毎の自動保存・確実な状態管理
- **セッション状態管理**: LocalStorage活用・状態復旧機能
- **エラーハンドリング**: 保存失敗・復旧失敗時の適切な対応

### 実装方針・技術選択
実装担当の技術判断により、以下技術を活用可能：
- **Redux Toolkit**: 大局的状態管理・Event処理状態
- **SWR**: データフェッチング・キャッシュ管理  
- **LocalStorage**: 永続化・Event履歴・セッション状態
- **useState**: Component内ローカル状態

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