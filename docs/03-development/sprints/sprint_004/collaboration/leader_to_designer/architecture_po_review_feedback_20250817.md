# 作業指示書：architecture.mdのPOレビューフィードバック反映作業

## 📋 基本情報

**指示者**: リーダー  
**作業者**: 設計担当  
**作成日時**: 2025-08-17 午後  
**優先度**: 高  
**期限**: 本日中

## 🎯 作業概要

architecture.mdに対するPOレビューフィードバックを反映し、技術的実装方針・テスト戦略の修正を実施してください。

## 📍 POレビューフィードバック内容

### 1. Player文脈ディレクトリ構造設計
**POレビュー指摘事項**:
```markdown
packages\ui に画面部品を作成してもらい、StoryBookで人間が確認したいです。

ただ、既存のコードは vercel v0が作成したもので、非常に可読性が低いものとなっています。
これは参考にしないように、人間が読んで理解しやすいコードを目指してください。

既存のコードは、いずれdeprecatedにする予定なので、混ざらないように注意してください。
```

### 2. App Layer: Player文脈アプリケーション設定
**POレビュー指摘事項**:
```markdown
- React Router v6を使用した宣言的ルーティング

react-routerはv7を使っています。修正してください。
```

### 3. テスト実装原則
**POレビュー指摘事項**:
```markdown
- Playwrightを使用したBDDシナリオテスト
- ユーザージャーニー全体の検証
- クロスブラウザー・デバイステスト

Playwrightの名前をだすなら、cucumberを使っていることも明示しておきましょう。

クロスブラウザはMVPとしてはやらないことにします。
最新のchromeで確認したら十分とします。
```

## 🔍 具体的な作業内容

### 1. UI開発方針の追加・明確化（必須）

**追加内容**:
```markdown
## UI Component開発方針

### packages/ui Component戦略
- **StoryBook統合**: 画面部品の視覚的確認・テスト
- **人間可読性**: 既存vercel v0コードとは異なる可読性重視
- **Deprecated コード分離**: 既存コードとの混在回避

### 実装品質方針
- 人間が読んで理解しやすいコード
- 既存vercel v0コードは参考にしない
- 新規実装は別ディレクトリ構造で管理
```

### 2. React Router バージョン修正（必須）

**修正対象**: App Layer実装方針

```markdown
## 修正前
- React Router v6を使用した宣言的ルーティング

## 修正後  
- React Router v7を使用した宣言的ルーティング
```

### 3. テスト戦略の修正・明確化（必須）

**修正対象**: E2Eテスト実装原則

```markdown
## 修正前
- Playwrightを使用したBDDシナリオテスト
- ユーザージャーニー全体の検証
- クロスブラウザー・デバイステスト

## 修正後
- Playwright + Cucumberを使用したBDDシナリオテスト
- ユーザージャーニー全体の検証
- Chrome最新版での確認（MVP制約）
```

### 4. 関連セクションの整合性確認

**確認対象**:
- FSD（Feature-Sliced Design）との整合性
- packages/ui配置方針の他セクションとの一致
- 実装ガイドラインとの整合性

## 📊 制約・前提条件

### POレビュー方針（必須遵守）
- **UI Component品質**: StoryBook統合・人間可読性
- **既存コード分離**: vercel v0コードとの混在回避
- **技術選択正確性**: React Router v7、Playwright + Cucumber
- **MVP制約**: クロスブラウザテスト除外

### 実装現実性
- **packages/ui活用**: 画面部品の体系的管理
- **StoryBook統合**: 視覚的確認・品質保証
- **Chrome最新版**: MVPテスト環境の簡素化

## 📋 期待成果物

### 1. 修正されたarchitecture.md
**修正箇所**:
- UI Component開発方針の追加・明確化
- React Router v7への修正
- テスト戦略の修正（Cucumber明記・クロスブラウザ除外）
- 既存コード分離方針の明確化

### 2. フィードバック反映報告書
**ファイル名**: `designer_to_leader_architecture_po_feedback_report_20250817.md`

**内容**:
- POフィードバック反映の詳細
- UI開発方針の策定内容
- 技術選択修正の影響評価
- 実装チームへの伝達事項

### 3. 更新履歴の適切な記録
- POレビューフィードバック反映の記録
- 技術方針修正の理由明確化
- StoryBook統合・既存コード分離方針の記録

## 🔄 作業プロセス

### Step 1: POフィードバック詳細分析（20分）
- UI開発方針の要件整理
- 技術選択修正の影響範囲確認
- 実装への影響評価

### Step 2: architecture.md修正（40分）
- UI Component開発方針の追加
- React Router v7への修正
- テスト戦略の修正実施
- 関連セクションの整合性確保

### Step 3: 影響確認・実装ガイダンス（30分）
- 他設計文書との整合性確認
- 実装チームへの影響評価
- StoryBook統合計画の策定

### Step 4: 報告書作成（20分）
- フィードバック反映結果の整理
- 実装フェーズへの伝達事項整理
- 品質保証方針の明確化

## 🚨 注意事項・特記事項

### 重要な考慮点
1. **既存コード分離**: vercel v0コードとの混在完全回避
2. **StoryBook統合**: packages/ui配置での視覚的品質確保
3. **技術選択正確性**: React Router v7、Cucumber明記
4. **MVP制約遵守**: 過度な品質要求の排除

### エスカレーション基準
以下の場合は即座にリーダーに相談：
- UI開発方針の策定に重大な課題が発見された場合
- 既存コード分離で技術的困難が想定される場合
- 実装フェーズへの影響が重大な場合

### 品質確認ポイント
- **実装現実性**: StoryBook統合・packages/ui配置の実現可能性
- **コード品質**: 人間可読性・保守性の確保
- **分離戦略**: 既存コードとの混在回避の確実性

## 📚 参考資料

### 主要参照文書
- [POレビュー記録](../reviews/architecture.review.md)
- [Player文脈MVP要件定義](../02-architecture/player-context/requirements.md)
- [複数ClaudeCode協働フレームワーク](../../../06-teams/processes/multi-claude-collaboration-framework.md)

### 技術参考情報
- React Router v7仕様
- StoryBook統合ガイドライン
- FSD（Feature-Sliced Design）原則

---

**リーダーからのメッセージ**:
POのフィードバックは実装品質・開発体験の重要な指摘です。特にUI Component開発でのStoryBook統合と既存コード分離は、実装フェーズでの開発効率に直結します。

技術選択の正確性（React Router v7、Cucumber明記）とMVP制約（クロスブラウザ除外）により、実装チームが混乱なく作業を進められるよう明確化してください。

**作業完了後の次ステップ**: 全設計文書のPOフィードバック反映完了、最終整合性確認

#work-instruction #architecture #po-feedback #ui-components #storybook #collaboration-v2