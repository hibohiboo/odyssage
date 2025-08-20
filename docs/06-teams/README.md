# チーム体制・協働指針

## 📖 概要

Odyssageプロジェクトの複数Claude Code体制による専門分野分担開発の恒久的ガイドライン・資料集。

## 🎯 **チーム基本原則：段階的試行アプローチ**

### **核心理念**
```markdown
🔄 段階的試行による確実な成功実現:
✓ 小さな成功の積み重ね・リスク最小化
✓ 失敗時の即座停止・問題分析・改善
✓ 一括処理・バッチ実行の完全回避
✓ 継続的学習・適応・品質向上
```

### **全担当共通の絶対原則**
```markdown
🚨 絶対禁止事項（全役割共通）:
❌ 複数タスクの同時実行・一括処理
❌ 「まとめて」「一気に」「全部」の発想・行動
❌ 失敗を無視した継続・推測による作業
❌ 時間短縮を狙った安全手順の省略

✅ 必須実行原則（全役割共通）:
✓ 1つのタスクのみ実行・完了確認・次検討
✓ 成功確認後のみ次段階への移行
✓ 失敗・不明時の即座停止・相談・解決
✓ 環境確認・事前準備・安全手順の徹底
```

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

### **⚠️ 作業開始前の必須確認（全担当共通）**
```markdown
🔍 段階的試行の準備・確認手順:
1. 段階的試行原則の理解・遵守意識確認
2. 担当作業の段階分割・優先順位設定
3. 失敗時対応・エスカレーション基準確認
4. 環境・ツール・前提条件の事前確認
5. **1つのタスクのみ選択・開始宣言**
```

### 新規リーダー引継ぎ時（**Priority 1**）
1. **段階的試行原則**: 本README.md冒頭の基本原則確認
2. **成果・実績確認**: [`../03-development/sprints/sprint_004/collaboration/leader_to_leader/sprint4_leadership_completion_summary_20250818.md`]
3. **責任分界理解**: [`processes/responsibility-boundary-management.md`](./processes/responsibility-boundary-management.md)
4. **協働フレームワーク**: [`processes/multi-claude-collaboration-framework.md`](./processes/multi-claude-collaboration-framework.md)
5. **役割詳細**: [`roles/leader.md`](./roles/leader.md)

### 新規参加時（初回オンボーディング）
1. **段階的試行原則**: 本README.md冒頭の基本原則確認・理解
2. **共通理解**: [`onboarding/project-fundamentals.md`](./onboarding/project-fundamentals.md)
3. **技術基盤**: [`onboarding/technical-foundations.md`](./onboarding/technical-foundations.md)  
4. **設計原則**: [`onboarding/context-architecture-guide.md`](./onboarding/context-architecture-guide.md)
5. **役割確認**: [`roles/`](./roles/) から該当する専門ガイド（段階的試行統合版）

### 継続作業開始時（Sprint毎）
1. **段階的試行確認**: 前回作業の振り返り・学習事項確認
2. **現在状況**: 該当Sprint設定・進捗確認
3. **役割再確認**: [`roles/`](./roles/) の責任範囲・成果物確認
4. **協働確認**: [`processes/collaboration-workflow.md`](./processes/collaboration-workflow.md) の作業フロー
5. **今回タスク**: 段階分割・優先順位・実行計画の設定

### プロセス改善時
- **議論記録**: [`processes/`](./processes/) への改善提案・決定事項追記
- **テンプレート更新**: [`templates/`](./templates/) の標準化・最適化

## 🔄 更新・保守方針

### 段階的改善アプローチ
```markdown
🔄 文書・プロセス改善の段階的実行:
✓ 1つの文書・プロセスのみ改善・確認・反映
✓ 改善効果確認後のみ次の改善検討
✓ 大規模変更の回避・小さな改善の積み重ね
✓ 失敗時の即座復旧・学習記録・再設計
```

### 継続的改善
- **Sprint振り返り**: 各Sprint完了時のプロセス評価・改善点抽出（段階的実施）
- **実践フィードバック**: 実際の協働体験からの課題・改善提案（1つずつ検証）
- **ナレッジ蓄積**: 発見・学習内容の文書化・共有（段階的試行の事例蓄積）

### 更新責任
- **リーダー**: 全体方針・プロセス設計の更新責任（段階的改善の推進）
- **各専門担当**: 担当領域の実践知識・ベストプラクティス更新（段階的試行の実証）
- **全員**: 使いやすさ・効果性の改善提案（段階的試行原則の遵守）

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

## 💡 **段階的試行チームとしての成功**

**効率的チーム協働の実現**

複数Claude Code体制は、段階的試行原則に基づく確実な成功積み重ねにより、各専門性を活かした高品質・高効率開発の実現を目指します。

### **段階的試行チームの特徴**
```markdown
🎯 確実性重視・リスク最小化:
✓ 小さな成功の積み重ねによる確実な目標達成
✓ 失敗の早期発見・学習・改善による品質向上
✓ バッチ処理・一括実行リスクの完全排除
✓ 継続的学習・適応による持続可能な成長

🤝 協働効率・品質向上:
✓ 各担当の段階的作業による相互支援・連携
✓ 問題の早期発見・共有・協力による解決
✓ 知識・経験の蓄積・共有による全体レベル向上
✓ 安全で確実なプロセスによる持続的生産性
```

本文書体系の活用により、段階的試行原則に基づく効率的協働・継続改善を実現してください。

**更新履歴**
- 2025-08-16: 初版作成（チーム体制文書化）
- 2025-08-20: 段階的試行アプローチ統合・チーム基本原則追加

#team-collaboration #gradual-trial #onboarding #processes #specialized-roles #ai-optimized #priority-structured #risk-minimization