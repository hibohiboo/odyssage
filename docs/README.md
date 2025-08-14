# Odyssage ドキュメント

このディレクトリには、Odyssageプロジェクトの包括的なドキュメンテーションが含まれています。

> **📖 プロジェクトビジョン**: [PROJECT_VISION.md](./PROJECT_VISION.md) でプロジェクトの核となる目標と価値をご確認ください。

## 📋 ドキュメント構成

### 🎯 はじめての方へ
- **[📋 ドキュメントインデックス](./00-index.md)** - 全ドキュメントのハブページ
- **[🚀 プロジェクト入門](./01-getting-started/README.md)** - プロジェクト概要・セットアップガイド
- **[📖 プロジェクトビジョン](./PROJECT_VISION.md)** - プロジェクトの目標・価値・方針

### 🏗️ 技術・アーキテクチャ
- **[⚙️ システムアーキテクチャ](./02-architecture/README.md)** - 全体設計・技術選定・データベース設計
- **[⚡ 開発プロセス](./03-development/README.md)** - 開発手法・テスト戦略・品質保証

### 🚀 デプロイ・運用
- **[🌐 デプロイメント](./04-deployment/README.md)** - 本番環境・ローカル環境構築
- **[📦 アーカイブ](./05-archive/README.md)** - 過去の設計・廃止された仕様

## 🎯 ドキュメント利用ガイド

### **開発者として参加したい場合**
1. [プロジェクトビジョン](./PROJECT_VISION.md) でプロジェクトの価値・方針を理解
2. [環境構築ガイド](./04-deployment/local-environment.md) で開発環境をセットアップ
3. [開発プロセス](./03-development/process.md) で開発フローを確認
4. [現在のスプリント](./03-development/sprints/README.md) で進行中の作業を把握

### **プロジェクトを理解したい場合**
1. [プロジェクトビジョン](./PROJECT_VISION.md) で基本的な価値提案を理解
2. [システム概要](./02-architecture/overview.md) で技術構成を把握
3. [ドメイン分析](./01-getting-started/domain.md) でビジネスロジックを理解

### **API・技術仕様を確認したい場合**
1. [OpenAPI仕様](./redocly/openapi/api.yaml) でAPI詳細を確認
2. [データベース設計](./02-architecture/database-design.md) でデータ構造を理解
3. [フロントエンドアーキテクチャ](./02-architecture/frontend-architecture.md) でUI設計を把握

## 🛠️ 生成されたドキュメント

### **自動生成・外部ツール**
- **[Storybook](./astro/public/odyssage-components/)** - UIコンポーネントドキュメント
- **[OpenAPI Docs](./astro/public/odyssage-openapi/)** - API仕様書
- **[Database Schema](./astro/public/odyssage-schemaspy/)** - データベーススキーマ
- **[ESLint Config](./astro/public/odyssage-eslint-config-inspector/)** - ESLint設定

### **コード分析・メトリクス**
- **[Code Maat分析](./code-maat/)** - コード複雑性・ホットスポット分析
- **[Cucumber Reports](./astro/public/odyssage-cucumber/)** - BDDテスト結果

## 📝 ドキュメント管理方針

### **更新頻度**
- **PROJECT_VISION.md**: 重要な方針変更時のみ
- **アーキテクチャ文書**: 設計変更時に随時更新
- **開発プロセス**: スプリント振り返り時に改善
- **API仕様**: 実装変更と同期して更新

### **品質保証**
- **一貫性**: PROJECT_VISION.mdを単一情報源として参照
- **実装同期**: コードと仕様の乖離防止
- **アクセシビリティ**: 明確なナビゲーション・相互参照

### **貢献ガイドライン**
- **文書作成**: [ドキュメンテーションポリシー](./DOCUMENTATION_POLICY.md) に従う
- **構造変更**: 既存のディレクトリ構成を維持
- **言語**: 日本語を基本、必要に応じて英語併記

## 🔗 関連リンク

### **ライブ環境**
- **[Odyssage (本番)](https://odyssage.pages.dev/)** - プロダクション環境
- **[開発環境](https://develop.odyssage.pages.dev/)** - 開発ブランチ
- **[技術ドキュメント](https://hibohiboo.github.io/odyssage/ja/introduction/)** - 公開ドキュメントサイト

### **開発ツール**
- **リポジトリ**: GitHub - hibohiboo/odyssage
- **プロジェクト管理**: GitHub Issues・Projects
- **CI/CD**: GitHub Actions + Cloudflare Pages

---

## 🏷️ メタデータ

**作成日**: 2025-08-14  
**対象**: Odyssageプロジェクトの全ドキュメント  
**メンテナンス**: プロジェクトメンバー  
**言語**: 日本語 (一部英語併記)

**重要な文書**:
- ✅ [PROJECT_VISION.md](./PROJECT_VISION.md) - プロジェクトの核となる価値・方針
- ✅ [00-index.md](./00-index.md) - 全ドキュメントの詳細インデックス
- ✅ [開発プロセス](./03-development/process.md) - 開発手法・品質保証
- ✅ [システム概要](./02-architecture/overview.md) - 技術アーキテクチャ

#documentation #project-overview #navigation #odyssage