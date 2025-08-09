# ドキュメントリアーキテクティング TODOリスト

## プロジェクト概要
GitHub Issue #109 に基づくドキュメント構造の全面再設計実装タスク一覧

**関連証跡**: `document-architecture-implementation.md`

## Phase 1: 基盤整備（週1）

### ディレクトリ構造作成
- [ ] `docs/00-index.md` 作成（Foamメインインデックス）
- [ ] `docs/01-getting-started/` ディレクトリ作成
- [ ] `docs/02-architecture/` ディレクトリ作成
- [ ] `docs/03-development/` ディレクトリ作成
- [ ] `docs/04-deployment/` ディレクトリ作成
- [ ] `docs/05-archive/` ディレクトリ作成
- [ ] `docs/05-archive/deprecated/` ディレクトリ作成

### 重要ドキュメント移行
- [ ] `CLAUDE.md` → `docs/03-development/process.md` 移行
- [ ] `docs/architecture/database-design.md` → `docs/02-architecture/database-design.md` 移行
- [ ] `readme-ja.md` の内容を `docs/01-getting-started/README.md` に統合
- [ ] 各ディレクトリの `README.md` 作成

### Foamリンク基盤構築
- [ ] メインインデックスでの主要ドキュメント間リンク作成
- [ ] WikiリンクFormat `[[ファイル名]]` での相互参照追加
- [ ] VS Code Foam拡張の動作確認

## Phase 2: コンテンツ統合（週2-3）

### 不要ファイル削除
- [ ] `.github/copilot-instructions/` 全体削除
  - [ ] `base.md` 削除
  - [ ] `backend.md` 削除
  - [ ] `frontend.md` 削除
  - [ ] `naming.md` 削除
  - [ ] `testing.md` 削除
- [ ] `.github/prompts/` 全体削除
  - [ ] `docs.prompt.md` 削除
  - [ ] `project-development-rules.prompt.md` 削除
  - [ ] `tdd.prompt.md` 削除
  - [ ] `typescript.prompt.md` 削除
- [ ] `docs/astro/src/pages/ja/` の重複ドキュメント削除
  - [ ] `introduction.md` 削除（内容をREADME.mdに統合済み）
  - [ ] `application-architecture.md` 削除（アーキテクチャ文書に統合）
  - [ ] その他日本語ドキュメント（13ファイル）削除
  - [ ] 削除前に重要情報の他文書への移行確認

### ドキュメント集約・統合
- [ ] スプリント記録を `docs/03-development/sprints/` に移行
  - [ ] 既存スプリント記録の整理
  - [ ] ディレクトリ構造の統一
- [ ] アーキテクチャドキュメントを `docs/02-architecture/` に集約
  - [ ] `docs/architecture/environment-variables.md` 移行
  - [ ] `docs/architecture/database-design.md` 移行  
  - [ ] `docs/architecture/README.md` 更新
  - [ ] `docs/design/README.md` を `docs/02-architecture/` に統合
- [ ] インフラ関連を `docs/04-deployment/` に統合
  - [ ] `infra/local/*/readme.md` の内容統合
  - [ ] ローカル環境構築手順の一元化
- [ ] アプリケーション個別READMEの統合検討
  - [ ] `apps/backend/readme.md` の内容確認
  - [ ] `apps/frontend/README.md` の内容確認
  - [ ] `apps/frontend/readme-ja.md` の内容確認

### Foamリンクネットワーク強化
- [ ] ドキュメント間の相互参照を `[[]]` 形式で統一
  - [ ] アーキテクチャ文書間のリンク
  - [ ] 開発プロセス文書間のリンク
  - [ ] デプロイメント文書間のリンク
- [ ] タグシステム導入
  - [ ] `#architecture` タグ設定
  - [ ] `#development` タグ設定
  - [ ] `#deployment` タグ設定
  - [ ] `#getting-started` タグ設定
  - [ ] `#archive` タグ設定
- [ ] コンテキストリンクの追加
  - [ ] 関連トピックへの自然な参照追加
  - [ ] 双方向リンクの確保

## Phase 3: 最適化・完成（週4）

### ナビゲーション最適化
- [ ] TOC（Table of Contents）の自動生成設定
- [ ] Foamグラフビューでの関連ドキュメント可視化確認
- [ ] メインインデックスから主要コンテンツへの導線最適化
- [ ] 3クリック以内でのアクセス性検証

### 品質向上・情報更新
- [ ] 古い情報の更新・整理
  - [ ] プロジェクト概要の最新化
  - [ ] 技術スタック情報の更新
  - [ ] 開発環境手順の最新化
- [ ] 不足部分の補完
  - [ ] API設計ドキュメント作成 (`docs/02-architecture/api-design.md`)
  - [ ] 本番環境デプロイメントガイド作成 (`docs/04-deployment/production.md`)
  - [ ] クイックスタートガイド作成 (`docs/01-getting-started/quick-start.md`)

### 運用ルール策定
- [ ] 新規ドキュメント作成ルールの文書化
  - [ ] ファイル命名規則
  - [ ] ディレクトリ配置規則
  - [ ] Foamリンク作成ルール
- [ ] リンク保守のガイドライン作成
  - [ ] リンク切れチェック手順
  - [ ] 定期メンテナンス方法
- [ ] 定期レビュープロセス定義
  - [ ] 四半期レビュー計画
  - [ ] 情報鮮度管理手順

## 最終検証・完了確認

### 機能検証
- [ ] Foamグラフビューでの全ドキュメント可視化確認
- [ ] 主要情報への3クリック以内アクセス検証
  - [ ] 開発環境構築手順
  - [ ] API仕様書
  - [ ] データベース設計書
  - [ ] テスト実行手順
- [ ] Wikiリンクのすべてのリンク切れチェック

### ユーザー受け入れ確認
- [ ] チームメンバーによる使用感確認
- [ ] 新規参加者向けのナビゲーション性確認
- [ ] ドキュメント検索効率の評価

### 成果測定
- [ ] アクセス効率測定（目標: 3クリック以内）
- [ ] リンク密度測定（目標: 各文書平均5リンク以上）
- [ ] 検索性測定（目標: Foamでの関連文書発見率80%以上）

## 専門ディレクトリ対応

### 技術ツール現状維持
- [ ] `docs/code-maat/` 動作確認・現状維持
- [ ] `docs/dbdoc/` 動作確認・現状維持  
- [ ] `docs/redocly/` 動作確認・現状維持
- [ ] `docs/astro/public/` 生成コンテンツ確認・保持

### Astro統合システム改修
- [ ] Foam→Astro自動変換スクリプト実装
- [ ] `docs/astro/src/pages/` の自動生成システム構築
- [ ] GitHub Pages公開システムの新構成対応
- [ ] Wikiリンク→Webリンク変換機能実装

## 継続的改善

### モニタリング設定
- [ ] ドキュメント使用頻度の追跡方法検討
- [ ] ユーザーフィードバック収集仕組み構築
- [ ] 情報の古さ検出アラート設定

### プロセス改善
- [ ] ドキュメント作成・更新プロセスの最適化
- [ ] Foamワークフロー改善
- [ ] チーム内での知識共有方法改善

## リスク管理

### バックアップ・復旧計画
- [ ] 移行前の完全バックアップ作成
- [ ] ロールバック手順の準備
- [ ] 重要ファイル消失時の復旧計画

### 影響範囲管理
- [ ] 開発プロセスへの影響最小化確認
- [ ] CI/CDパイプラインへの影響チェック
- [ ] 外部リンク・参照への影響評価

---

## 実装優先度

**High Priority（即座に着手）**
- ディレクトリ構造作成
- CLAUDE.md移行（開発プロセス影響回避）
- 不要ファイル削除

**Medium Priority（基盤完成後）**
- ドキュメント統合・集約
- Foamリンク強化

**Low Priority（最終段階）**
- ナビゲーション最適化
- 運用ルール策定

---

## 関連リソース
- **証跡ファイル**: `document-architecture-implementation.md`
- **GitHub Issue**: #109
- **Foam公式**: https://foambubble.github.io/foam/