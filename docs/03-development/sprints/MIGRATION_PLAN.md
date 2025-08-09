# Sprints ディレクトリ移行計画

## 概要

`docs/development/sprtints/` （typo）ディレクトリから `docs/development/sprints/` への既存ファイル移行計画。
新しいスプリント運用ルールに合わせた構造統一を目的とする。

## 現状分析

### 移行対象ディレクトリ
```
docs/development/sprtints/   # Typoディレクトリ（移行元）
├── sprint_001/
│   ├── scene-graphdb-implementation.md
│   ├── scenario-graphdb-implementation.md
│   ├── delete-scene-graphdb-implementation.md
│   └── scene-manual-test-guide.md
└── sprint_002/
    └── scene-batch-update-implementation.md
```

### 移行先ディレクトリ
```
docs/development/sprints/    # 正しいディレクトリ（移行先）
├── README.md               # 運用ルール
├── sprint_001/             # 移行後配置
├── sprint_002/             # 移行後配置  
└── sprint_003/             # 現在のスプリント（既存）
    ├── document-architecture-implementation.md
    ├── document-architecture-todo.md
    ├── github-pages-migration-plan.md
    └── SPRINT_CONFIG.md
```

## 移行方針

### 1. ナンバリング整理
- **現在のsprint_003**: ドキュメントアーキテクチャ実装（継続）
- **移行するsprint_001**: GraphDB機能実装 → **sprint_001として維持**
- **移行するsprint_002**: バッチ更新機能実装 → **sprint_002として維持**

### 2. ファイル標準化
各スプリントに以下ファイルを追加：

#### Sprint 001 追加ファイル
- [ ] `SPRINT_CONFIG.md`: GraphDB機能実装のスプリント設定
- [ ] `retrospective.md`: 完了スプリントの振り返り

#### Sprint 002 追加ファイル  
- [ ] `SPRINT_CONFIG.md`: バッチ更新機能のスプリント設定
- [ ] `retrospective.md`: 完了スプリントの振り返り

### 3. 移行手順

#### Phase 1: ディレクトリ移行
```bash
# 1. sprint_001 移行
cp -r docs/development/sprtints/sprint_001/* docs/development/sprints/sprint_001/

# 2. sprint_002 移行  
cp -r docs/development/sprtints/sprint_002/* docs/development/sprints/sprint_002/
```

#### Phase 2: 標準ファイル作成
- [ ] Sprint 001 の `SPRINT_CONFIG.md` 作成
- [ ] Sprint 001 の `retrospective.md` 作成
- [ ] Sprint 002 の `SPRINT_CONFIG.md` 作成
- [ ] Sprint 002 の `retrospective.md` 作成

#### Phase 3: 旧ディレクトリ削除
```bash
# 移行完了確認後
rm -rf docs/development/sprtints/
```

## 各スプリントの詳細設定

### Sprint 001: GraphDB機能実装
```markdown
# Sprint 001 設定

## スプリント基本情報
- **開始日**: 2024-XX-XX（推定）
- **終了日**: 2024-XX-XX（推定） 
- **期間**: 推定期間
- **スプリント名**: GraphDB Integration Implementation

## 目標
- シナリオGraphDB機能実装
- シーンGraphDB機能実装  
- 削除機能実装

## 主要成果物
1. Neo4jデータベース連携システム
2. GraphDBクエリ最適化
3. 手動テストガイド作成
```

### Sprint 002: バッチ更新機能実装
```markdown
# Sprint 002 設定

## スプリント基本情報  
- **開始日**: 2024-XX-XX（推定）
- **終了日**: 2024-XX-XX（推定）
- **期間**: 推定期間
- **スプリント名**: Scene Batch Update Implementation

## 目標
- シーン一括更新機能の実装

## 主要成果物
1. バッチ更新API実装
2. フロントエンド対応
3. パフォーマンス最適化
```

## ファイルマッピング詳細

### Sprint 001 移行マッピング
```
sprtints/sprint_001/scene-graphdb-implementation.md
→ sprints/sprint_001/scene-graphdb-implementation.md

sprtints/sprint_001/scenario-graphdb-implementation.md  
→ sprints/sprint_001/scenario-graphdb-implementation.md

sprtints/sprint_001/delete-scene-graphdb-implementation.md
→ sprints/sprint_001/delete-scene-graphdb-implementation.md

sprtints/sprint_001/scene-manual-test-guide.md
→ sprints/sprint_001/scene-manual-test-guide.md

[新規作成]
→ sprints/sprint_001/SPRINT_CONFIG.md
→ sprints/sprint_001/retrospective.md
```

### Sprint 002 移行マッピング
```
sprtints/sprint_002/scene-batch-update-implementation.md
→ sprints/sprint_002/scene-batch-update-implementation.md

[新規作成]
→ sprints/sprint_002/SPRINT_CONFIG.md
→ sprints/sprint_002/retrospective.md
```

## 実行チェックリスト

### 移行前準備
- [ ] 移行対象ファイル一覧確認
- [ ] 移行先ディレクトリ構造確認
- [ ] バックアップ作成（念のため）

### 移行実行
- [ ] sprint_001 ディレクトリ作成
- [ ] sprint_001 ファイル移行
- [ ] sprint_002 ディレクトリ作成  
- [ ] sprint_002 ファイル移行

### 標準化作業
- [ ] Sprint 001 SPRINT_CONFIG.md 作成
- [ ] Sprint 001 retrospective.md 作成
- [ ] Sprint 002 SPRINT_CONFIG.md 作成
- [ ] Sprint 002 retrospective.md 作成

### 移行後確認
- [ ] 全ファイル移行完了確認
- [ ] ディレクトリ構造統一確認
- [ ] リンク・参照関係の整合性確認

### 清掃作業
- [ ] 旧 `sprtints` ディレクトリ削除
- [ ] 関連ドキュメントの参照更新
- [ ] TODOリスト・CLAUDE.mdでの参照更新

## 成功基準

### 構造統一
- [ ] すべてのスプリントが統一された構造
- [ ] SPRINT_CONFIG.md が全スプリントに存在
- [ ] retrospective.md が完了スプリントに存在

### 情報継続性
- [ ] 既存実装記録の内容が欠損なく移行
- [ ] 技術判断・課題解決記録が保持
- [ ] 参考情報・リンクが有効

## リスク対策

### 情報消失リスク
- **対策**: 移行前の完全バックアップ
- **検証**: 移行後のファイル内容比較

### 参照切れリスク
- **対策**: 移行後の参照関係全体確認
- **検証**: Foamリンク・Markdownリンクの動作確認

## 関連更新作業

### CLAUDE.md 更新
```markdown
# 変更前
docs/development/sprtints/sprint_001/

# 変更後  
docs/development/sprints/sprint_001/
```

### README.md 更新
各種READMEファイルでのパス参照を新しいディレクトリ構造に更新

---

## 実行予定
- **実行日**: Sprint 003 実行中（2025-08-09〜2025-08-15）
- **担当**: Claude Code
- **完了目標**: 2025-08-12（Sprint 003 中間時点）

#migration #sprints #documentation