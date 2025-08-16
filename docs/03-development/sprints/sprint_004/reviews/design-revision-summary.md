# 設計修正版要約書

## 📅 修正概要

**修正日**: 2025-08-16  
**修正者**: 設計担当Claude Code  
**修正理由**: プロジェクトオーナーからの最終設計決定反映  

## 🎯 主要な設計変更

### 1. Event概念の導入（MVP範囲内）

#### 変更前
```typescript
interface Scene {
  choices: Choice[];  // 選択肢を直接管理
}
```

#### 変更後
```typescript
interface Scene {
  events: Event[];    // TRPG的なイベント集合体として管理
}

interface Event {
  type: EventType;    // choice, narrative, dialogue, exploration等
  data: EventData;    // タイプ別のデータ構造
}
```

#### 設計判断
- **TRPG的思考の導入**: シーン = 複数イベントの集合体
- **選択肢の再定義**: ChoiceはEventの一種として位置づけ
- **MVP実装可能性**: 基本的なchoice + narrativeイベントに集中

### 2. 選択肢提案機能の分離（将来機能化）

#### 決定事項
- **extensionData削除**: MVP実装用の枠は用意しない
- **独立文書化**: 要件レベルのドキュメントとして詳細仕様を作成
- **Phase 2移行**: MVP完了後の将来機能として位置づけ

#### 理由
- リアルタイム通知システム（WebSocket等）が必要
- GM-Player間の複雑な相互作用が必要
- MVP目標「2シナリオ、3セッション以下」に対して過度に複雑

### 3. MVP範囲内での複雑度維持

#### Event実装の簡略化
```typescript
// MVP必須
| 'choice'     // 選択肢（従来のChoice）
| 'narrative'  // 物語進行（テキスト表示）

// MVP最小限実装
| 'dialogue'   // NPC会話
| 'exploration' // 探索アクション

// 将来拡張（型定義のみ）
| 'item_acquire' // アイテム獲得
| 'skill_use'    // スキル使用
| 'condition'    // 条件判定
```

#### 実装制約の明確化
- DialogueEventData: 単純なNPCテキスト表示のみ
- ExplorationEventData: シンプルな探索対象と説明のみ
- MVP段階では高度なイベント連携は除外

## 📊 修正されたファイル一覧

### 1. モックデータ設計の修正
**ファイル**: `mock-data-design.md`
**主な変更**:
- Scene構造にEvent概念を導入
- Event/EventDataの型定義追加
- MVP実装制約の明記
- 将来機能の独立化

### 2. 将来機能要件書の作成
**新規ファイル**: `future-player-choice-proposal-feature.md`
**内容**:
- プレイヤー選択肢提案機能の詳細要件
- Phase 2以降の実装計画
- データ構造・UX設計
- 技術実装方針

## 🎯 MVP設計の品質確保

### 実装可能性の確保
```markdown
✅ **2シナリオ対応**: Event構造でも最小限のデータ量
✅ **3セッション以下**: 複雑な状態管理を回避
✅ **フロントエンド単体**: バックエンド非依存を維持
✅ **30-45分体験**: choice + narrativeイベントで実現可能
```

### 拡張性の確保
```markdown
✅ **Event拡張**: 将来的なイベントタイプ追加が容易
✅ **データ構造**: EventDataのunion型で柔軟な拡張
✅ **選択肢提案**: 将来機能として詳細設計済み
✅ **Phase 2準備**: Author/GM文脈追加への準備
```

## 🔄 実装への影響

### 開発工数への影響
- **増加要因**: Event概念の導入による型定義・コンポーネント設計
- **削減要因**: 選択肢提案機能の除外による実装スコープ削減
- **全体影響**: 実装工数はほぼ同等（複雑度は適切に管理）

### 技術的な考慮事項
```typescript
// MVP実装時の重点項目
1. Event表示コンポーネントの設計
2. EventType別の条件分岐処理
3. choice → narrative → choice の基本フロー
4. 将来拡張に備えた型安全な設計
```

## 📋 次のステップ

### 即座に必要な作業
1. **UI/UX設計の更新**: Event概念に対応した画面設計
2. **アーキテクチャ設計の更新**: Event処理の状態管理設計
3. **実装計画の調整**: Event優先度を反映した開発順序

### レビューポイント
```markdown
## 設計品質確認
✅ Event概念がTRPG体験を適切に表現しているか
✅ MVP範囲での実装可能性が確保されているか
✅ 将来拡張への道筋が明確か

## 実装準備確認
✅ 型定義が実装に十分な詳細度か
✅ MVP制約が開発チームに明確に伝わるか
✅ Phase 2への引き継ぎ事項が整理されているか
```

## 🎉 設計修正の成果

### 設計品質向上
- **TRPG適合性**: より自然なTRPG体験の表現
- **実装適性**: MVP範囲内での実現可能性確保
- **拡張性**: 将来機能への明確な発展計画

### プロジェクト価値向上
- **迅速なMVP実現**: 複雑度制御による開発期間短縮
- **品質の確保**: TRPG体験価値の維持
- **将来性**: Phase 2での機能拡張準備

---

## 📝 メタデータ

**承認待ち項目**:
- Event概念の導入方針
- MVP実装制約の適切性
- 選択肢提案機能の Phase 2移行判断

**関連文書**:
- [mock-data-design.md](mock-data-design.md) - 修正済み
- [future-player-choice-proposal-feature.md](future-player-choice-proposal-feature.md) - 新規作成
- [player-context-requirements.md](player-context-requirements.md) - 要更新検討

**作成者**: 設計担当Claude Code  
**レビュー依頼先**: プロジェクトリーダー  

#design-revision #event-concept #mvp-scope #implementation-ready