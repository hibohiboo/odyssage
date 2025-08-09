# ドキュメントリアーキテクティング TODOリスト

## プロジェクト概要
GitHub Issue #109 に基づくドキュメント構造の全面再設計実装タスク一覧

**関連証跡**: `document-architecture-implementation.md`

## 🎯 Sprint 003 進捗サマリー（2025-01-09時点）

### ✅ **主要達成事項**
1. **新ドキュメント構造完成**: 5つの主要ディレクトリ + Foamハブ構築 ✅
2. **重要ドキュメント移行完了**: CLAUDE.md→process.md、database-design.md等 ✅  
3. **不要ファイル削除完了**: 22ファイル削除（重複解消・保守負荷軽減） ✅
4. **Foamリンク基盤完成**: VS Code + 知識グラフで利用可能 ✅

### 📊 **定量成果**
- **新規作成**: 6つのREADME.md + メインインデックス
- **移行完了**: 2つの重要ドキュメント
- **削除実行**: 22ファイル（Copilot指示書5 + プロンプト4 + 重複文書13）
- **統合達成**: 散らばった情報の一元化完了

## ✅ Phase 1: 基盤整備（完了: 2025-01-09）

### ディレクトリ構造作成
- [x] `docs/00-index.md` 作成（Foamメインインデックス）
- [x] `docs/01-getting-started/` ディレクトリ作成
- [x] `docs/02-architecture/` ディレクトリ作成
- [x] `docs/03-development/` ディレクトリ作成
- [x] `docs/04-deployment/` ディレクトリ作成
- [x] `docs/05-archive/` ディレクトリ作成
- [x] `docs/05-archive/deprecated/` ディレクトリ作成

### 重要ドキュメント移行
- [x] `CLAUDE.md` → `docs/03-development/process.md` 移行
- [x] `docs/architecture/database-design.md` → `docs/02-architecture/database-design.md` 移行
- [x] `readme-ja.md` の内容を `docs/01-getting-started/README.md` に統合
- [x] 各ディレクトリの `README.md` 作成

### Foamリンク基盤構築
- [x] メインインデックスでの主要ドキュメント間リンク作成
- [x] WikiリンクFormat `[[ファイル名]]` での相互参照追加
- [x] VS Code Foam拡張の動作確認

## ✅ Phase 2: コンテンツ統合（完了: 2025-01-09）

### 不要ファイル削除
- [x] `.github/copilot-instructions/` 全体削除
  - [x] `base.md` 削除
  - [x] `backend.md` 削除
  - [x] `frontend.md` 削除
  - [x] `naming.md` 削除
  - [x] `testing.md` 削除
- [x] `.github/prompts/` 全体削除
  - [x] `docs.prompt.md` 削除
  - [x] `project-development-rules.prompt.md` 削除
  - [x] `tdd.prompt.md` 削除
  - [x] `typescript.prompt.md` 削除
- [x] `docs/astro/src/pages/ja/` の重複ドキュメント削除
  - [x] `introduction.md` 削除（内容をREADME.mdに統合済み）
  - [x] `application-architecture.md` 削除（アーキテクチャ文書に統合）
  - [x] その他日本語ドキュメント（13ファイル）削除
  - [x] 削除前に重要情報の他文書への移行確認

### ドキュメント集約・統合
- [x] スプリント記録を `docs/03-development/sprints/` に移行
  - [x] 既存スプリント記録の配置確認（正常に配置済み）
  - [x] ディレクトリ構造の統一確認
- [x] アーキテクチャドキュメントを `docs/02-architecture/` に集約
  - [x] `docs/architecture/environment-variables.md` 移行
  - [x] `docs/architecture/database-design.md` 移行済み（Phase 1で完了）
  - [x] `docs/02-architecture/README.md` 更新（新ドキュメントリンク追加）
- [x] インフラ関連を `docs/04-deployment/` に統合
  - [x] `infra/local/*/readme.md` の内容統合（local-environment.md作成）
  - [x] ローカル環境構築手順の一元化
  - [x] 本番環境運用手順の包括的整備（production.md作成）
- [x] アプリケーション個別READMEの統合検討
  - [x] `apps/backend/readme.md` の内容確認・統合
  - [x] `apps/frontend/README.md` の内容確認・統合  
  - [x] `apps/frontend/readme-ja.md` の内容確認・統合
  - [x] 構造詳細情報を `docs/01-getting-started/README.md` に統合
  - [x] 起動前提条件を `docs/04-deployment/local-environment.md` に統合

### Foamリンクネットワーク強化
- [x] ドキュメント間の相互参照を `[[]]` 形式で統一
  - [x] アーキテクチャ文書間のリンク強化
  - [x] 開発プロセス文書間のリンク強化
  - [x] デプロイメント文書間のリンク強化
- [x] タグシステム導入・拡張
  - [x] 基本カテゴリタグ: `#architecture`, `#development`, `#deployment`, `#getting-started`, `#archive`
  - [x] 技術別タグ: `#graphdb`, `#api`, `#configuration`, `#security`, `#monitoring`
  - [x] 作業別タグ: `#sprint`, `#tdd`, `#infrastructure`, `#troubleshooting`
- [x] コンテキストリンクの追加
  - [x] メインインデックスの関連情報拡充
  - [x] 各READMEファイルでの双方向リンク確保
  - [x] 専門文書からの適切な相互参照追加

## 🔄 Phase 3: 最適化・完成（進行中: 2025-01-09）

### ドキュメント構造問題の解決
- [x] **現在実装 vs 将来計画の混在問題**対応
  - [x] `current-deployment.md` 作成（実装済み機能のみ）
  - [x] `production-roadmap.md` 作成（段階的改善計画）
  - [x] `production.md` 修正（将来計画として明記）
  - [x] `deployment/README.md` 更新（3段階構造の説明）
- [x] **メインインデックス・関連文書のリンク更新**
  - [x] 新しい3段階構造に対応したナビゲーション
  - [x] 目的別アクセス経路の修正

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