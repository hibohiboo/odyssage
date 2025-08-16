# Player文脈 設計文書

## 📋 文書構成

### 🎯 概要・戦略
- **[概要](./overview.md)**: Player文脈全体の設計理念・方針
- **[要件定義](./requirements.md)**: 機能要件・非機能要件
- **[技術アーキテクチャ](./architecture.md)**: システム構成・技術選定

### 📱 画面設計（1画面1ドキュメント）
- **[セッション一覧画面](./screens/session-list.md)**: セッション探索・選択
- **[セッション詳細画面](./screens/session-detail.md)**: セッション詳細確認・参加
- **[プレイ画面](./screens/play-session.md)**: 基本プレイ体験・シーン進行
- **[プレイ履歴画面](./screens/play-history.md)**: プレイ記録・振り返り（Phase2）

### 📊 データ・API設計
- **[データ設計](./data-design.md)**: モックデータ・データ構造
- **[API設計](./api-design.md)**: Player文脈API仕様（予定）

## 🚀 MVP実装状況

### ✅ Phase 1B完了（2025-08-16）
- 要件定義・設計完了
- BDD Feature作成・レビュー完了
- 進化的設計アプローチ確立

### 🔄 Phase 2予定（実装フェーズ）
- 3つの主要画面実装
- BDD Featureに基づく実装・テスト
- 継続的な設計改善

### 📈 Phase 3以降（拡張）
- プレイ履歴画面の詳細実装
- 高度な機能・分析機能
- Author・GM文脈との統合

## 🔄 進化的設計原則

### 生きたドキュメント
この設計文書群は**生きたドキュメント**として、実装・テスト・ユーザーフィードバックに基づいて継続的に更新されます。

### 1画面1ドキュメント原則
- **可読性**: 画面ごとの詳細設計で読みやすさ向上
- **保守性**: 変更時の影響範囲を明確化
- **並行作業**: 複数画面の並行設計・実装支援

### 設計変更の記録
全ての設計変更は以下に記録されます：
- 各文書の更新履歴
- BDDレビューからの学習記録
- 実装フィードバックの反映

## 📚 関連文書

### Sprint記録
- **[Sprint 4 設計記録](../../03-development/sprints/sprint_004/)**
- **[進化的設計アプローチ](../../03-development/sprints/sprint_004/evolutionary-design-approach.md)**
- **[協働記録](../../03-development/sprints/sprint_004/collaboration-record.md)**

### BDD Features
- **[scenario-discovery.feature](../../../packages/bdd-e2e-test/e2e/features/scenario-discovery.feature)**
- **[session-joining.feature](../../../packages/bdd-e2e-test/e2e/features/session-joining.feature)**
- **[play-experience.feature](../../../packages/bdd-e2e-test/e2e/features/play-experience.feature)**

### プロジェクト全体
- **[プロジェクトビジョン](../../PROJECT_VISION.md)**
- **[アーキテクチャ概要](../overview.md)**

## 📝 更新方針

### 定期更新
- **実装フェーズ**: 実装進捗に応じた設計調整
- **テストフェーズ**: テスト結果に基づく改善
- **ユーザーテスト**: ユーザビリティテスト結果の反映

### 変更管理
- **設計変更**: 理由・経緯を明確に記録
- **文書同期**: 関連文書間の整合性維持
- **バージョン管理**: Gitによる変更履歴追跡

**最終更新**: 2025-08-16  
**ドキュメント構造**: 上位移動・1画面1ドキュメント化完了

#player-context #design-documents #living-documents #evolutionary-design