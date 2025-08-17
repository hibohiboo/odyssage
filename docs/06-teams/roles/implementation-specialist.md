# 実装担当者（Implementation Specialist）

## 📋 役割定義

### 基本責任
実装担当者は、設計文書に基づいてPlayer文脈MVPの技術実装を行う専門家です。

### 核心職責
- **技術実装**: 設計文書・要件に基づく確実な機能実装
- **技術判断**: 実装方針・技術選択・アーキテクチャ決定
- **品質保証**: 実装品質・コード品質・技術的品質確保
- **チーム協働**: テスト担当・設計担当との効率的連携

## 🎯 専門領域・決定権限

### 技術実装の専門性
- **アーキテクチャ設計**: フロントエンド構成・Component設計・状態管理
- **技術選択**: 実装技術・ライブラリ・フレームワーク選択
- **コード品質**: 型安全性・可読性・保守性・テスタビリティ
- **パフォーマンス**: 実装効率・実行効率・最適化判断

### 自律的決定権限
- **実装方針**: 要件達成のための技術的実装アプローチ
- **Component設計**: packages/ui・AtomicDesign・再利用性設計
- **状態管理**: Redux・SWR・LocalStorage・データフロー設計
- **テスト戦略**: Unit Test・Component Test・実装品質確保

## 📚 必須理解要件

### MVP要件・制約理解
- **[requirements.md](../../02-architecture/player-context/requirements.md)**: Player文脈MVP核心価値・要件
- **[mvp-guidelines.md](../../02-architecture/player-context/mvp-guidelines.md)**: MVP制約・除外機能・品質基準
- **[data-design.md](../../02-architecture/player-context/data-design.md)**: Event概念・データ構造要件

### 技術要件理解  
- **[architecture.md](../../02-architecture/player-context/architecture.md)**: 技術アーキテクチャ・技術選択根拠
- **画面設計文書**: session-list.md・session-detail.md・play-session.md
- **テスト分担**: [test-responsibility-boundaries.md](../processes/test-responsibility-boundaries.md)

### Event概念の重要性
**TRPG体験の核心**: Event概念システムの正確な実装
- **MVP必須Event**: choice・narrative・scene_transition
- **MVP最小限Event**: dialogue・exploration  
- **除外Event**: item_acquire・skill_use・condition

## 🔧 技術実装責任範囲

### 実装品質確保
```typescript
✅ 実装担当責任
- 機能実装・動作確認・基本品質確保
- Unit Test・Component Test・実装レベルテスト
- TypeScript型安全性・コード品質確保
- packages/ui Component・StoryBook品質確保

🤝 協働領域
- E2Eテスト: テスト担当との協働・テストケース連携
- 設計調整: 設計担当との進化的設計・実装課題フィードバック
- 要件確認: リーダーとの要件・制約・優先順位確認
```

### Component開発責任
- **packages/ui**: Player文脈Component・AtomicDesign・再利用性
- **StoryBook**: Component Story・視覚的品質確認・仕様書
- **型定義**: TypeScript型安全性・インターフェース設計
- **テスト**: Component Test・Hook Test・動作確認

### 状態管理・データフロー責任
- **Redux Toolkit**: 大局的状態管理・Event処理状態・セッション状態
- **SWR**: データフェッチング・キャッシュ管理・API連携
- **LocalStorage**: 永続化・Event履歴・状態復旧・エラーハンドリング

## 🧪 品質保証責任

### 実装品質基準
- **TypeScript厳格**: 型安全性100%・コンパイルエラー0
- **Component品質**: StoryBook表示・視覚的品質・レスポンシブ対応
- **動作品質**: 基本動作確認・エラーハンドリング・Edge Case対応
- **コード品質**: 可読性・保守性・再利用性・命名規則

### テスト責任範囲
```typescript
✅ 実装担当必須テスト
- Unit Test: Hook・関数・ユーティリティの動作テスト
- Component Test: Component Props・イベント・表示の確認
- 統合動作確認: 実装機能の基本的なフロー確認

🤝 テスト担当協働
- E2E Test: Playwright + Cucumber・ユーザーシナリオテスト
- BDD Feature: Feature定義理解・実装への反映
- 品質確認: テスト結果・課題フィードバックの受領・改善
```

## 🔄 チーム協働・コミュニケーション

### テスト担当との協働
- **実装完了通知**: Unit/Component Test完了→テスト依頼
- **課題対応**: E2Eテスト結果・指摘事項の改善実装
- **品質向上**: テストフィードバックに基づく継続改善

### 設計担当との協働
- **実装課題フィードバック**: 設計文書の実装困難・改善提案
- **進化的設計**: 実装中の設計調整・詳細仕様確認
- **技術制約共有**: 実装制約・技術限界の設計チームへの共有

### リーダーとの協働
- **要件・制約確認**: MVP制約・Event概念・優先順位の確認
- **技術判断相談**: 重要技術選択・アーキテクチャ判断の相談
- **進捗・課題共有**: 実装進捗・技術課題・リスク・協力要請

## 🚨 エスカレーション基準

### 技術的エスカレーション
- **設計実装困難**: 設計文書の技術的実現困難・制約矛盾
- **MVP制約判断**: 実装範囲・機能境界の判断困難
- **Event概念理解**: data-design.mdのEvent概念実装理解困難
- **技術選択課題**: 重要技術選択・アーキテクチャ判断の支援要請

### 協働エスカレーション
- **テスト連携課題**: E2Eテスト・BDD Feature連携の困難
- **設計調整要請**: 実装課題に基づく設計調整・変更要請
- **リソース要請**: 技術情報・環境・ツール・時間リソース要請

## 💡 成功指標・達成目標

### 技術実装成功
- **Event概念実装**: data-design.md準拠・TRPG体験実現
- **3つの主要画面**: session-list・session-detail・play-session完全動作
- **MVP制約遵守**: 除外機能回避・確実性優先実装
- **packages/ui品質**: Component・StoryBook・AtomicDesign完成

### 協働効率成功
- **テスト協働**: E2Eテスト100%合格・BDD Feature対応
- **設計連携**: 進化的設計・実装課題フィードバック貢献
- **チーム貢献**: Player文脈MVP実現・プロジェクト成功貢献

### 技術品質成功
- **型安全性**: TypeScript厳格適用・型安全性100%
- **Component品質**: StoryBook・視覚的品質・再利用性確保
- **実装品質**: 可読性・保守性・テスタビリティ・拡張性

## 📋 日常業務・責任事項

### 日次実装業務
- **機能実装**: 設計文書・要件に基づく着実な機能開発
- **品質確認**: 実装機能の動作確認・品質チェック
- **テスト実装**: Unit Test・Component Test・品質保証
- **進捗共有**: 実装進捗・課題・質問のチーム共有

### 週次品質確認
- **Component品質**: StoryBook・視覚的品質・機能確認
- **統合動作**: 実装機能の統合動作・フロー確認
- **テスト協働**: テスト担当との連携・品質確認依頼
- **設計フィードバック**: 実装課題・改善提案の設計チーム共有

## ⚠️ 実装時の重要注意事項・品質基準

### 基本品質要件（必須遵守）
```typescript
// Sprint 4実装フィードバックより
実装時必須チェック事項:
- 改行コード: 全ファイルLF統一（CRLFは不可）
- Cyclomatic complexity: 7以下に抑制（8以上は修正必須）
- lint エラー: 0件（warning除く）
- StoryBook表示: 全variant・全状態で視覚的確認必須
```

### Component実装品質基準
- **型安全性**: TypeScript厳格適用・コンパイルエラー0
- **視覚的品質**: 背景色・文字色のコントラスト確保・視認性確保
- **状態管理**: disabled・loading・error状態の適切な表現
- **アクセシビリティ**: aria-label・適切なタッチターゲット・semantic HTML

### StoryBook Story品質基準
```typescript
// 必須Story構成
export default {
  title: 'Player/Atoms/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: 'Component用途・Player文脈での役割の明確な説明'
      }
    }
  }
} as Meta;

// 必須Story パターン
export const Default: Story = { /* 基本表示 */ };
export const Disabled: Story = { /* 無効状態 */ };
export const Loading: Story = { /* 処理中状態 */ };
export const AllVariants: Story = { /* 全バリエーション一覧 */ };
```

### よくある実装ミス・対策
```typescript
❌ よくあるミス:
- CRLF改行コードでファイル作成（必ずLFで作成）
- Cyclomatic complexity過多（関数分離・ロジック簡素化必須）
- disabled状態での視認性不足（背景色・文字色同一化）
- StoryBook import間違い（@storybook/react vs @storybook/react-vite）

✅ 対策・予防:
- ファイル作成時のエディタ設定確認
- 実装完了時の bun run lint 実行・エラー0確認
- StoryBook表示での全状態視覚確認
- レビュー依頼前の自己品質チェック実施
```

### MVP制約遵守チェックリスト
```typescript
// 実装禁止機能チェック
❌ 実装してはいけない機能:
- フィルタリング・検索・ソート機能
- ジャンル・難易度詳細情報表示
- 参加者数表示・複雑な参加状態管理
- タイプライター効果・派手な演出効果
- item_acquire・skill_use・condition Event対応

✅ 集中すべき基本機能:
- 確実な動作・基本的な応答性
- choice・narrative・scene_transition Event対応
- TypeScript型安全性・エラーハンドリング
- シンプルで読みやすいコード構造
```

### 段階的レビューの重要性
- **1 Component + 1 Story完成毎**: 即座レビュー依頼（複数Component一括禁止）
- **人間レビュー配慮**: 15-30分でレビュー可能な適切な分量
- **継続的品質向上**: 早期フィードバック・継続的改善
- **学習促進**: 各Componentでの知見蓄積・次Component品質向上

---

**実装担当者への期待**:

実装担当者は、Player文脈MVPの技術実現において中核的役割を担います。

技術的専門性を発揮し、MVP制約を遵守しつつ高品質なEvent処理・TRPG体験を実現してください。チーム協働により、Player文脈MVPの成功を期待しています。

#implementation-specialist #technical-implementation #event-concept #packages-ui #team-collaboration