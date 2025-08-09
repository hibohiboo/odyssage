# ドキュメントリアーキテクティングの実装

## プロジェクト概要

GitHub Issue #109 に基づくドキュメント構造の全面的な再設計・整理プロジェクト。散らばったドキュメントの統合、不要ファイルの削除、Foamを活用した知識グラフ化による効率的なドキュメント管理体制の構築を目指す。

### 問題点
- **ドキュメントが散らばっている**: 9つの主要ディレクトリに50+のファイルが分散
- **記事同士のリンクがない**: 相互参照が不十分で情報の関連性が不明確
- **GitHub Copilot向けドキュメントが残存**: 使用されていない古い指示書群が残っている

### 目標
- 統合されたナレッジベースの構築（Foam連携）
- 効率的な情報アクセスの実現（3クリック以内）
- ドキュメント保守性の向上

## アーキテクチャ分析

### 現在のドキュメント分散状況

**プロジェクトルート**
- `readme.md`（英語版）: プロジェクトメインREADME
- `readme-ja.md`（日本語版）: 詳細なプロジェクト説明
- `CLAUDE.md`: 開発プロセス全体の定義（**極めて重要**）

**アプリケーション層**
- `apps/backend/readme.md`: バックエンド実行前提条件
- `apps/frontend/README.md`: フロントエンド実行前提条件
- `apps/frontend/readme-ja.md`: Feature-Sliced Design説明

**アーキテクチャドキュメント**
- `docs/architecture/`: 設計ドキュメント群
- `docs/architecture/database-design.md`: ハイブリッドDB設計（**極めて重要**）

**開発ドキュメント**
- `docs/development/`: 実装記録・証跡管理
- `docs/development/sprints/`: スプリント実装記録

**GitHub関連**
- `.github/copilot-instructions/`: 旧Copilot指示書群（**削除対象**）
- `.github/prompts/`: 旧プロンプト群（**削除対象**）

**その他**
- `docs/astro/src/pages/ja/`: 重複する日本語ドキュメント群（**削除対象**）
- `packages/*/README.md`: 各パッケージの説明書
- `infra/local/*/readme.md`: ローカル環境設定

### 技術スタック
- **Foam**: VS Code拡張、WikiリンクとGUIでの知識グラフ化
- **Markdown**: ドキュメント記述形式
- **Git**: バージョン管理

## データモデル設計

### 新しいドキュメント構成

```
docs/
├── 00-index.md                    # 全体インデックス（Foamメイン）
├── 01-getting-started/            # はじめに
│   ├── README.md                  # プロジェクト概要
│   ├── setup.md                   # 環境構築
│   └── quick-start.md             # クイックスタート
├── 02-architecture/               # アーキテクチャ
│   ├── README.md
│   ├── overview.md                # システム全体像
│   ├── database-design.md         # データベース設計
│   └── api-design.md             # API設計
├── 03-development/               # 開発ガイド
│   ├── README.md
│   ├── process.md                # 開発プロセス（現CLAUDE.md）
│   ├── testing-strategy.md
│   └── sprints/                  # スプリント記録
├── 04-deployment/               # デプロイ
│   ├── README.md
│   ├── local-environment.md
│   └── production.md
└── 05-archive/                  # アーカイブ
    └── deprecated/              # 廃止予定
        └── copilot-instructions/ # 旧Copilot指示書
```

### Foamリンク構造設計

**基本リンク形式**
```markdown
[[ファイル名]]               # ファイルへの直接リンク
[[ファイル名#セクション]]      # セクションへのリンク
[[ファイル名|表示名]]         # エイリアス付きリンク
```

**タグシステム**
```markdown
#architecture #development #deployment #getting-started #archive
```

## 実装計画

### Phase 1: 基盤整備（週1）
- [ ] 新ディレクトリ構造作成
- [ ] メインインデックス（00-index.md）作成
- [ ] 重要ドキュメント移行（CLAUDE.md → process.md）
- [ ] 基本Foamリンク構築

### Phase 2: コンテンツ統合（週2-3）
- [ ] 不要ファイル削除
- [ ] ドキュメント集約・統合
- [ ] Foamリンクネットワーク強化
- [ ] タグシステム導入

### Phase 3: 最適化・完成（週4）
- [ ] ナビゲーション最適化
- [ ] 古い情報の更新・整理
- [ ] 運用ルール策定

### 削除対象ファイル
- `.github/copilot-instructions/` （全体）
- `.github/prompts/` （全体）
- `docs/astro/src/pages/ja/` （重複ドキュメント）

## 実装ガイドライン

### Foam導入方針
1. **VS Code拡張インストール**: Foam for VS Code
2. **WikiリンクFormat**: `[[ファイル名]]` 形式に統一
3. **グラフビュー活用**: 関連ドキュメント可視化

### ファイル命名規則
- **番号付きディレクトリ**: `00-`, `01-` で順序を明確化
- **README.md**: 各ディレクトリのインデックス
- **小文字ケバブケース**: `database-design.md`

### リンク構築原則
- **双方向リンク**: A→B の場合、B→A も設定
- **コンテキストリンク**: 関連する情報への自然な参照
- **インデックスハブ**: メインインデックスから主要コンテンツへの導線

## 品質保証手順

### 移行前チェックリスト
- [ ] 既存ドキュメント一覧の完全把握
- [ ] 重要情報の識別・マーキング
- [ ] バックアップ作成

### 移行中チェックリスト
- [ ] ファイル移動の記録
- [ ] リンク切れの検証
- [ ] 情報の欠落チェック

### 移行後チェックリスト
- [ ] Foamグラフでの関連性確認
- [ ] 主要情報への3クリック以内アクセス検証
- [ ] チームメンバーによる使用感確認

## 成果指標（KPI）

### 定量指標
- **アクセス効率**: 目的の情報への到達クリック数（目標: 3クリック以内）
- **リンク密度**: ドキュメント間の相互参照数（目標: 各文書平均5リンク以上）
- **検索性**: Foamでの関連文書発見率（目標: 80%以上）

### 定性指標
- **情報の見つけやすさ**: 新規参加者の情報アクセス改善
- **保守性**: ドキュメント更新負荷の軽減
- **一貫性**: プロジェクト全体の情報整合性向上

## 進捗記録

### 2025-01-09
- [x] Issue #109の詳細確認
- [x] プロジェクト全体のドキュメント分散状況調査完了
  - 9つの主要ディレクトリに50+のMarkdownファイルを確認
  - 重要ドキュメント（CLAUDE.md、database-design.md等）を特定
  - 削除対象（copilot-instructions、prompts等）を明確化
- [x] リアーキテクティング方針策定
- [x] 新しいドキュメント構成設計完了
- [x] 3段階の移行計画作成
- [x] 本証跡ファイル作成

### 技術的課題と解決方法

**課題1**: 大量のドキュメントファイルの効率的な移行
- **解決方法**: 重要度による優先度付けと段階的移行
- **理由**: 一度に全て移行するとリスクが高く、段階的な方が安全

**課題2**: Foamの学習コスト
- **解決方法**: 基本的なWikiリンク形式から開始し、徐々に機能拡張
- **理由**: 最小限の機能から始めることで習得負荷を軽減

**課題3**: 既存の開発プロセスへの影響
- **解決方法**: CLAUDE.mdの優先移行と段階的な構造変更
- **理由**: 開発に直接影響する重要ファイルを最初に移行して安定性を確保

## 参考情報

### 関連ファイル
- `CLAUDE.md`: 現在の開発プロセス定義
- `docs/architecture/database-design.md`: アーキテクチャ設計
- `docs/development/README.md`: 開発ドキュメント管理方針

### 外部リソース
- [Foam Documentation](https://foambubble.github.io/foam/): Foam公式ドキュメント
- [Wiki-style linking](https://help.obsidian.md/How+to/Internal+link): Wikiリンク形式の説明

### 技術環境
- VS Code with Foam extension
- Git for version control
- Markdown format for documentation