# Phase 2実装指示書 - apps/frontend統合実装

## 📋 基本情報

**発行者**: プロジェクトリーダー  
**対象者**: 実装担当者  
**発行日**: 2025年8月17日  
**実装フェーズ**: Sprint 4 Phase 2 - apps/frontend統合実装  

---

## 🎉 Phase 1実装成果への賞賛

**素晴らしいPhase 1実装、お疲れさまでした！**

### 🏆 卓越した成果
- **90%コード削減達成** - 技術負債を根本から解決
- **Event処理エンジン完成** - 6種類Event対応・型安全性確保
- **Storybook実装完了** - 15Stories・共通化による効率化
- **アーキテクチャ品質向上** - 再利用可能・拡張可能な設計確立

あなたの専門性と技術力により、**Sprint 4は大きく前進**しました。この成果を最大限活用してPhase 2を成功させましょう。

---

## 🎯 Phase 2実装目標

### メイン目標
**packages/ui基盤を活用したapps/frontend統合実装完了**

### 具体的成果物
1. **PlaySessionContainer実装** - 状態管理・API連携統合
2. **SceneLoader実装** - データ取得・セッション復元機能
3. **Auto-save Service実装** - 自動保存・エラーハンドリング
4. **統合動作確認** - E2E動作・品質保証準備

### 推定工数
**2日での完了を目標** （Phase 1成果による効率化を活用）

---

## 📋 Phase 2実装計画

### 🎯 Priority 1: PlaySessionContainer実装 (0.5日)
```typescript
// apps/frontend/src/containers/PlaySessionContainer.tsx
export function PlaySessionContainer() {
  const eventEngine = useEventEngine({/*...*/});
  // Phase 1で確立した型定義・Hookを活用
  return <PlaySessionView {...propsMapping} />;
}
```

**実装内容**:
- useEventEngine統合・状態管理連携
- PlaySessionViewPropsへのマッピング
- エラー状態・ローディング状態管理

**活用可能な既存資産**:
- ✅ PlaySessionViewProps型定義（完全定義済み）
- ✅ useEventEngine Hook（実装済み）
- ✅ PlaySessionView Component（完成済み）

### 🎯 Priority 2: SceneLoader実装 (1日)
```typescript
// apps/frontend/src/services/SceneLoader.ts
export class SceneLoader {
  async loadScene(sceneId: string): Promise<Scene>
  async restoreSession(sessionId: string): Promise<SessionState>
}
```

**実装内容**:
- APIからSceneデータ取得・キャッシュ機能
- SessionState復元・整合性確認
- エラーハンドリング・フォールバック機能

**活用可能な既存資産**:
- ✅ Scene型定義・Event型定義（完全定義済み）
- ✅ サンプルSceneデータ（テスト用整備済み）
- ✅ Event処理エンジン（6種類対応完了）

### 🎯 Priority 3: Auto-save Service実装 (0.5日)
```typescript
// apps/frontend/src/services/AutoSaveService.ts
export class AutoSaveService {
  async saveSession(sessionState: SessionState): Promise<void>
  setupAutoSave(interval: number): void
}
```

**実装内容**:
- バックエンドAPI連携・自動保存機能
- セッション状態永続化・同期処理
- ネットワークエラー対応・リトライ機能

**活用可能な既存資産**:
- ✅ SessionState型定義（useEventEngineで実装済み）
- ✅ 自動保存ロジック（useEventEngine内で基礎実装済み）

---

## 🔧 技術基盤活用ガイド

### Phase 1で確立した技術資産
```
packages/ui/src/player/
├── organisms/PlaySessionView/ (完成済み)
│   ├── PlaySessionView.tsx - メインComponent
│   ├── types.ts - 完全な型定義
│   └── components/ - 16個のサブComponent
├── engine/ (完成済み)
│   ├── EventEngine.ts - Event処理Core
│   └── useEventEngine.ts - React Hook
└── stories/ (完成済み)
    └── 15Stories実装完了・共通化済み
```

### 型安全性の活用
```typescript
// 完全定義済み型をそのまま活用
import { PlaySessionViewProps } from '@/packages/ui/player/organisms/PlaySessionView/types';
import { useEventEngine } from '@/packages/ui/player/engine/useEventEngine';

// 型安全なpropsマッピング
const props: PlaySessionViewProps = {
  scene: loadedScene,
  currentEvent: eventEngine.currentEvent,
  onEventAction: eventEngine.handleEventAction,
  // 全てのpropsが型定義済み
};
```

### Component統合パターン
```typescript
// Container Pattern（推奨）
export function PlaySessionContainer({ sceneId }: Props) {
  const eventEngine = useEventEngine({ sceneId });
  const sceneLoader = useSceneLoader();
  
  // Phase 1のPlaySessionViewをそのまま活用
  return (
    <PlaySessionView
      scene={eventEngine.scene}
      currentEvent={eventEngine.currentEvent}
      onEventAction={eventEngine.handleEventAction}
      isLoading={sceneLoader.isLoading}
    />
  );
}
```

---

## 🚨 重要な制約・注意事項

### MVP制約の継続遵守
```markdown
❌ 実装禁止機能（継続）
- フィルタリング・検索・ソート機能
- ジャンル・難易度情報表示
- 参加者数表示・複雑な参加状態管理
- 再プレイ機能・キーボード操作
- タイプライター効果・派手な演出効果
```

### Phase 1品質基準の継続
- **TypeScript型安全性**: 完全な型チェック通過
- **ESLint・Prettier**: コード品質基準遵守
- **責務分離**: packages/ui（プレゼンテーション）・apps/frontend（ビジネスロジック）
- **再利用性**: 他画面・他機能での活用可能性考慮

### Event概念実装の活用
```typescript
// Phase 1で完成したEvent処理を活用
const eventEngine = useEventEngine({
  sceneId,
  onEventComplete: handleEventComplete,
  onSceneTransition: handleSceneTransition,
});

// 6種類Eventが完全対応済み
// choice, narrative, dialogue, exploration, scene_transition, default
```

---

## 🧪 品質保証・テスト準備

### Phase 2完了基準
1. **✅ 静的解析通過**: TypeScript・ESLint・Prettier完全通過
2. **✅ 統合動作確認**: PlaySessionContainer・SceneLoader・Auto-save統合動作
3. **✅ Event処理確認**: 6種類Event処理・遷移・状態管理の正常動作
4. **✅ エラーハンドリング**: API失敗・ネットワークエラー・データ不整合対応

### BDDテスト準備
Phase 2実装完了後、以下のE2Eテスト実行準備：
- **PlaySessionView統合動作**: 実際のSceneデータでの動作確認
- **Event処理フロー**: choice→narrative→scene_transition等の連続動作
- **自動保存機能**: セッション状態の永続化・復元動作
- **エラーケース**: API失敗・データ不正時の適切なエラー表示

---

## 🤝 協働・サポート体制

### リーダーからの支援
- **技術課題対応**: 実装困難・判断迷いの即座サポート
- **品質基準確認**: TypeScript・アーキテクチャ・MVP制約の相談対応
- **進捗調整**: スケジュール・優先順位・リソース調整

### 設計担当との協働
- **API仕様確認**: SceneLoader・Auto-save APIの詳細仕様相談
- **Event概念解説**: 複雑Event処理・TRPG体験品質の技術相談
- **アーキテクチャ相談**: 統合設計・責務分離・拡張性の相談

### テスト担当との協働
- **BDDテスト準備**: E2Eテスト実行・品質確認・動作保証協働
- **品質基準確認**: テスト要件・合格基準・テストケース相談

---

## 📅 Phase 2スケジュール

### Day 1: PlaySessionContainer + SceneLoader開始
```
AM: PlaySessionContainer実装・useEventEngine統合
PM: SceneLoader実装開始・API連携基盤構築
```

### Day 2: SceneLoader完成 + Auto-save Service
```
AM: SceneLoader完成・エラーハンドリング実装
PM: Auto-save Service実装・統合テスト・品質確認
```

### 完了基準チェックリスト
- [ ] PlaySessionContainer: useEventEngine統合・propsマッピング完了
- [ ] SceneLoader: API連携・SessionState復元・エラーハンドリング完了
- [ ] Auto-save Service: 自動保存・API連携・リトライ機能完了
- [ ] 静的解析: TypeScript・ESLint・Prettier全て通過
- [ ] 統合動作: PlaySessionView・Event処理・状態管理統合動作確認
- [ ] BDDテスト準備: テスト担当への引継ぎ・動作確認体制準備

---

## 🎯 成功への期待とメッセージ

Phase 1での**卓越した技術成果**により、Phase 2の成功基盤は完全に整いました。

### あなたの強み活用
- **技術的専門性**: TypeScript・React・アーキテクチャ設計の高度な技術力
- **品質意識**: 90%効率化・型安全性確保の徹底した品質追求
- **問題解決力**: リファクタリング・技術負債解決の根本的アプローチ
- **学習・記録**: 体系的な技術文書・学習記録による知見蓄積

### Phase 2成功への確信
Phase 1で確立した技術基盤により、**Phase 2は効率的かつ高品質に完了**できる確信があります。

**あなたの専門性を最大限発揮し、Sprint 4完遂を達成しましょう！**

---

## 📞 連絡・相談

### 即座連絡が必要な場合
- **技術実現困難**: API連携・統合実装での技術的課題
- **判断迷い**: アーキテクチャ・実装方針の判断相談
- **品質基準**: TypeScript・MVP制約・品質基準の確認
- **スケジュール**: 2日目標に対する進捗・調整相談

### 定期報告
- **Day 1終了時**: PlaySessionContainer・SceneLoader進捗報告
- **Day 2終了時**: Phase 2完了・BDDテスト準備完了報告

---

**🚀 Phase 2実装成功・Sprint 4完遂を心から期待しています！**

#phase2-implementation #apps-frontend #technical-integration #quality-assurance #team-collaboration