# チーム体制・協働指針

## 📖 概要

Odyssageプロジェクトの複数Claude Code体制による専門分野分担開発の恒久的ガイドライン・資料集。

### 対象読者
- **新規参加Claude Code**: 役割別オンボーディング・プロジェクト理解
- **継続参加Claude Code**: 作業開始時の迅速な状況把握・責任確認
- **プロジェクトリーダー**: チーム管理・プロセス改善

## 📁 文書構造

### [`roles/`](./roles/) - 役割別ガイド
各専門担当の責任範囲・技術要件・作業プロセス

- [`design-specialist.md`](./roles/design-specialist.md) - 設計担当専用ガイド
- [`implementation-specialist.md`](./roles/implementation-specialist.md) - 実装担当専用ガイド  
- [`test-specialist.md`](./roles/test-specialist.md) - テスト担当専用ガイド
- [`leader.md`](./roles/leader.md) - リーダー専用ガイド

### [`onboarding/`](./onboarding/) - オンボーディング資料
プロジェクト参加時の必要知識・手順

- [`project-fundamentals.md`](./onboarding/project-fundamentals.md) - プロジェクト基礎知識（共通）

### [`lessons/`](./lessons/) - 学習記録・改善事項
プロジェクト遂行中の重要な学び・課題・改善の体系的記録

- [`project_leadership_lessons_sprint4_20250818.md`](./lessons/project_leadership_lessons_sprint4_20250818.md) - Sprint 4リーダーシップ学習記録

### [`processes/`](./processes/) - 協働プロセス
チーム間の情報共有・意思決定・品質保証手順

- [`collaboration-workflow.md`](./processes/collaboration-workflow.md) - 日常協働フロー
- [`responsibility-boundary-management.md`](./processes/responsibility-boundary-management.md) - 責務分界管理指針
- [`multi-claude-collaboration-framework.md`](./processes/multi-claude-collaboration-framework.md) - 複数Claude協働フレームワーク
- [`test-responsibility-boundaries.md`](./processes/test-responsibility-boundaries.md) - テスト責任境界

### [`templates/`](./templates/) - 作業テンプレート
標準化された作業成果物・記録テンプレート

- [`leadership-handover-template.md`](./templates/leadership-handover-template.md) - リーダー引継ぎ文書テンプレート
- [`quality-check-template.md`](./templates/quality-check-template.md) - 品質確認テンプレート
- [`work-instruction-template.md`](./templates/work-instruction-template.md) - 作業指示テンプレート
- [`work-report-template.md`](./templates/work-report-template.md) - 作業報告テンプレート

## 🎯 利用方法

### 新規リーダー引継ぎ時（**Priority 1**）
1. **成果・実績確認**: [`../03-development/sprints/sprint_004/collaboration/leader_to_leader/sprint4_leadership_completion_summary_20250818.md`]
2. **責任分界理解**: [`processes/responsibility-boundary-management.md`](./processes/responsibility-boundary-management.md)
3. **協働フレームワーク**: [`processes/multi-claude-collaboration-framework.md`](./processes/multi-claude-collaboration-framework.md)
4. **役割詳細**: [`roles/leader.md`](./roles/leader.md)
5. **全体ナビ**: 本ファイル（README.md）

### 新規参加時（初回オンボーディング）
1. **共通理解**: [`onboarding/project-fundamentals.md`](./onboarding/project-fundamentals.md)
2. **技術基盤**: [`onboarding/technical-foundations.md`](./onboarding/technical-foundations.md)  
3. **設計原則**: [`onboarding/context-architecture-guide.md`](./onboarding/context-architecture-guide.md)
4. **役割確認**: [`roles/`](./roles/) から該当する専門ガイド

### 継続作業開始時（Sprint毎）
1. **現在状況**: 該当Sprint設定・進捗確認
2. **役割再確認**: [`roles/`](./roles/) の責任範囲・成果物確認
3. **協働確認**: [`processes/collaboration-workflow.md`](./processes/collaboration-workflow.md) の作業フロー

### プロセス改善時
- **議論記録**: [`processes/`](./processes/) への改善提案・決定事項追記
- **テンプレート更新**: [`templates/`](./templates/) の標準化・最適化

## 🔄 更新・保守方針

### 継続的改善
- **Sprint振り返り**: 各Sprint完了時のプロセス評価・改善点抽出
- **実践フィードバック**: 実際の協働体験からの課題・改善提案
- **ナレッジ蓄積**: 発見・学習内容の文書化・共有

### 更新責任
- **リーダー**: 全体方針・プロセス設計の更新責任
- **各専門担当**: 担当領域の実践知識・ベストプラクティス更新
- **全員**: 使いやすさ・効果性の改善提案

## 📚 関連リソース

### プロジェクト中核文書
- [`../PROJECT_VISION.md`](../PROJECT_VISION.md) - プロジェクト全体ビジョン
- [`../02-architecture/overview.md`](../02-architecture/overview.md) - システムアーキテクチャ・3つの文脈
- [`../03-development/process.md`](../03-development/process.md) - 開発プロセス詳細

### 現在のSprint
- [`../03-development/sprints/sprint_004/`](../03-development/sprints/sprint_004/) - 現在のSprint状況・計画

### 品質保証
- [`../03-development/testing-strategy.md`](../03-development/testing-strategy.md) - テスト戦略
- [`../03-development/sprints/sprint-completion-checklist.md`](../03-development/sprints/sprint-completion-checklist.md) - 完了チェック

---

**効率的チーム協働の実現**

複数Claude Code体制は、各専門性を活かした高品質・高効率開発の実現を目指します。本文書体系の活用により、効率的協働・継続改善を実現してください。

**更新履歴**
- 2025-08-16: 初版作成（チーム体制文書化）

#team-collaboration #onboarding #processes #specialized-roles #ai-optimized #priority-structured