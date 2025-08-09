# GitHub Pages移行計画 - astro/ja削除後の代替案

## 目標
`docs/astro/src/pages/ja/` 削除後も、統合された新しいドキュメント構成をGitHub Pagesで公開し続ける。

## 現状分析

### 削除対象の重要コンテンツ
- `introduction.md`: プロジェクト概要、ブランチ戦略、ディレクトリ構造
- `application-architecture.md`: 技術選定、アプリケーション設計
- その他DDD設計、開発メモ類

### 現在のAstro構成
- **サイトURL**: `https://hibohiboo.github.io/odyssage/`  
- **ベースパス**: `/odyssage`
- **技術**: Astro + MDX + Sitemap

## 推奨実装案: Option 1 - Foam→Astro自動変換

### システム設計

#### 1. 変換スクリプト作成
```javascript
// scripts/foam-to-astro.js
import fs from 'fs';
import path from 'path';

export function generatePagesFromDocs() {
  return {
    name: 'foam-to-astro',
    buildStart() {
      // docs/ ディレクトリをスキャン
      // Wikiリンク [[filename]] を Astroリンク [filename](/path) に変換
      // astro/src/pages/ に自動生成
    }
  };
}
```

#### 2. ファイルマッピング規則
```
docs/01-getting-started/README.md     → pages/index.md
docs/01-getting-started/setup.md      → pages/getting-started/setup.md
docs/02-architecture/database-design.md → pages/architecture/database-design.md
docs/03-development/process.md        → pages/development/process.md
```

#### 3. Wikiリンク変換
```markdown
// 変換前（Foam形式）
[[database-design]] を参照してください。

// 変換後（Astro形式）  
[database-design](/odyssage/architecture/database-design) を参照してください。
```

### 実装手順

#### Phase 1: 基本変換システム構築
1. **変換スクリプト作成**
   - [ ] `scripts/foam-to-astro.js` 作成
   - [ ] Wikiリンク正規表現パターン定義
   - [ ] ファイルパス変換ロジック実装

2. **Astro設定更新**
   - [ ] `astro.config.mjs` にプラグイン追加
   - [ ] ビルドプロセス統合

3. **テンプレート作成** 
   - [ ] Astroレイアウト更新（統一デザイン）
   - [ ] ナビゲーション自動生成

#### Phase 2: 高度な機能追加
1. **リンク解析強化**
   - [ ] 双方向リンク検出
   - [ ] 関連ドキュメント自動表示
   - [ ] パンくずリスト生成

2. **SEO最適化**
   - [ ] メタデータ自動生成
   - [ ] サイトマップ更新
   - [ ] OGP設定

#### Phase 3: CI/CD統合
1. **自動デプロイ**
   - [ ] GitHub Actions設定
   - [ ] docs変更検知でビルドトリガー
   - [ ] GitHub Pagesデプロイ

2. **品質保証**
   - [ ] リンク切れチェック
   - [ ] ビルドエラー検知
   - [ ] プレビュー環境

### 技術仕様

#### ディレクトリ構造（変換後）
```
docs/astro/
├── astro.config.mjs           # 変換プラグイン統合
├── scripts/
│   └── foam-to-astro.js      # 変換スクリプト
├── src/
│   ├── layouts/
│   │   └── DocLayout.astro   # ドキュメント用レイアウト
│   └── pages/                # 自動生成されるページ
│       ├── index.md          # docs/01-getting-started/README.md から生成
│       ├── architecture/
│       ├── development/
│       └── deployment/
└── public/
    └── images/               # 既存画像継続利用
```

#### 変換ルール詳細

**Frontmatter生成**
```yaml
---
title: "データベース設計"           # ファイル内のH1から取得
description: "ハイブリッドDB構成の設計書"  # 最初の段落から生成
layout: "../../layouts/DocLayout.astro"
tags: ["architecture", "database"]     # #タグから変換
lastModified: "2025-01-09"            # Gitから取得
---
```

**リンク変換パターン**
```javascript
// Wikiリンク → Astroリンク
const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
const convertWikiLinks = (content, filePath) => {
  return content.replace(wikiLinkRegex, (match, linkText) => {
    const targetPath = resolveDocPath(linkText);
    return `[${linkText}](${targetPath})`;
  });
};
```

### Alternative Option: GitHub Actions Simple Deploy

より簡単な実装として、定期的にdocsをAstroページに同期：

```yaml
# .github/workflows/sync-docs.yml  
name: Sync Documentation
on:
  push:
    paths: ['docs/**']
schedule:
  - cron: '0 2 * * *'  # 毎日2時に実行

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Copy docs to Astro
        run: |
          cp -r docs/01-getting-started/* docs/astro/src/pages/getting-started/
          cp -r docs/02-architecture/* docs/astro/src/pages/architecture/
      - name: Convert Wiki links
        run: node scripts/convert-links.js
      - name: Build and Deploy
        run: |
          cd docs/astro
          npm run build
          npm run deploy
```

## 移行スケジュール

### Week 1: 基盤構築
- [ ] 変換スクリプト基本実装
- [ ] テスト用小規模変換
- [ ] 既存astro/jaコンテンツのバックアップ

### Week 2: 本格移行  
- [ ] 全ドキュメント変換実装
- [ ] リンク整合性検証
- [ ] デザイン統合

### Week 3: 完成・公開
- [ ] CI/CD統合
- [ ] 最終動作確認
- [ ] astro/ja削除実行

## 成功基準

### 機能要件
- [ ] すべてのFoamドキュメントがAstroサイトで閲覧可能
- [ ] Wikiリンクが正しくWebリンクに変換
- [ ] 既存のAstro機能（MDX、サイトマップ）が動作

### 非機能要件
- [ ] ビルド時間5分以内
- [ ] リンク切れゼロ
- [ ] GitHub Pagesでの正常表示

## リスク対策

### 高リスク: 変換ミスによる情報損失
- **対策**: 段階的移行とバックアップ保持
- **検証**: 自動テストによるリンク検証

### 中リスク: パフォーマンス問題
- **対策**: 増分ビルド、キャッシュ活用
- **監視**: ビルド時間計測

## 関連リソース
- [[document-architecture-implementation]] - メイン実装記録
- [[DOCUMENTATION_POLICY]] - ドキュメント管理方針
- [Astro公式ドキュメント](https://docs.astro.build/)

#github-pages #astro #foam #migration