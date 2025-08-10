# Odyssage ドキュメント ハブ

Odyssage プロジェクトの全体的なナレッジベース - Foam対応の知識グラフで効率的な情報アクセスを実現

## 🚀 はじめに

### 新規参加者向け
- [[01-getting-started/README]] - プロジェクト概要・コンセプト
- [[01-getting-started/setup]] - 環境構築手順
- [[01-getting-started/quick-start]] - クイックスタートガイド

### 開発者向け
- [[03-development/process]] - 開発プロセス（元CLAUDE.md）
- [[03-development/sprints/README]] - スプリント運用ルール
- [[02-architecture/database-design]] - データベース設計

## 📚 主要コンテンツ

### [[01-getting-started]] - プロジェクト入門
TRPGセッション管理システムの概要、技術選定、ブランチ戦略など、プロジェクト理解のための基礎情報

### [[02-architecture]] - システム設計
- **ハイブリッドDB構成**: PostgreSQL + Neo4j の設計思想
- **環境変数仕様**: 設定管理・セキュリティ・環境分離戦略
- **API設計**: OpenAPI仕様書とREST設計原則
- **アーキテクチャ概要**: システム全体の技術構成

### [[03-development]] - 開発ガイド
- **開発プロセス**: TDD、証跡管理、品質保証手順
- **スプリント管理**: 1週間スプリント運用（土〜金）
- **実装記録**: 各機能の詳細な実装証跡

### [[04-deployment]] - 運用・デプロイ
- **ローカル環境**: 開発環境構築・Docker活用・トラブルシューティング
- **現在のデプロイ**: 実装済み手動デプロイ手順・基本設定
- **改善ロードマップ**: 段階的自動化・監視・セキュリティ強化計画
- **理想的運用**: 将来の完全自動化・高可用性・エンタープライズ運用

### [[05-archive]] - 過去記録
- **廃止予定**: 使用しなくなった技術・ドキュメント
- **履歴保持**: 過去の技術判断・学習記録

## 🔧 技術ツール（現状維持）

### [[code-maat]] - コード分析
```
docs/code-maat/ - ホットスポット分析・複雑度測定
```

### [[dbdoc]] - データベース文書
```
docs/dbdoc/ - SchemaSpy活用のDB可視化
```

### [[redocly]] - API仕様書
```
docs/redocly/ - OpenAPI管理・ドキュメント生成
```

### [[astro]] - 静的サイト
```
docs/astro/ - GitHub Pages公開・Storybook・技術文書
```

## 🎯 ナビゲーション

### 目的別アクセス

**環境構築したい**
→ [[01-getting-started/setup]] → [[04-deployment/local-environment]]

**機能開発したい**
→ [[03-development/process]] → [[02-architecture/api-design]] → [[スプリント記録|03-development/sprints]]

**システム理解したい**
→ [[02-architecture/overview]] → [[02-architecture/database-design]]

**デプロイしたい**
→ [[04-deployment/local-environment]] → [[04-deployment/current-deployment]] → [[04-deployment/production-roadmap]]

### タグ検索

**カテゴリ別**
- #getting-started - 入門・概要情報
- #architecture - システム設計・技術構成
- #development - 開発プロセス・実装記録  
- #deployment - 運用・インフラ・環境構築
- #archive - 過去記録・廃止予定

**技術別**
- #graphdb - Neo4j・グラフDB関連
- #api - API設計・OpenAPI仕様
- #configuration - 環境変数・設定管理
- #security - セキュリティ・認証・暗号化
- #monitoring - 監視・可観測性・アラート

**作業別**
- #sprint - スプリント実装記録
- #tdd - テスト駆動開発・品質保証
- #infrastructure - インフラ・Docker・運用
- #troubleshooting - 問題解決・デバッグ・FAQ

## 📊 プロジェクト状況

### 現在のスプリント
**Sprint 003** (2025-08-09土 〜 2025-08-15金): [[document-architecture-implementation|03-development/sprints/sprint_003/document-architecture-implementation]]
- **フェーズ**: Phase 6 CLAUDE.md混乱問題解決 完了
- **進捗**: ドキュメント品質改善・構造最適化完了

### 最近の主要成果
- **Sprint 003**: [[ドキュメント品質改善|03-development/sprints/sprint_003]] - Foam構造構築・重複削除・導線最適化
- **Sprint 002**: [[楽観的更新実装|03-development/sprints/sprint_002]] - UX改善・バッチ処理
- **Sprint 001**: [[GraphDB実装|03-development/sprints/sprint_001]] - Neo4j連携基盤構築

### 技術スタック
- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Hono.js + Cloudflare Workers
- **データベース**: PostgreSQL (Neon) + Neo4j
- **認証**: Firebase Authentication
- **テスト**: Vitest + Playwright

## 🔄 この文書について

**更新頻度**: リアルタイム更新  
**保守担当**: 開発チーム全体  
**Foam対応**: VS Code Foam拡張で知識グラフ表示

**関連**
- [[DOCUMENTATION_POLICY]] - ドキュメント管理方針
- [[03-development/sprints/README]] - スプリント運用ルール

---

💡 **Tip**: VS Code + Foam拡張で `Ctrl+Shift+P` → `Foam: Show Graph` でドキュメント関連性を可視化

#documentation #index #foam