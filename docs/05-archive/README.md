# アーカイブ

過去の記録・廃止予定ドキュメント・履歴保持

## 📋 概要

本ディレクトリは、現在は使用していないが履歴として保持すべきドキュメント・技術判断記録・学習リソースを管理します。

### アーカイブ方針

1. **履歴保持**: 過去の技術判断・失敗からの学習価値
2. **整理**: 現在のドキュメントと明確に分離
3. **検索可能性**: 必要時に参照できる状態で保持
4. **定期レビュー**: 年次での保持価値評価

## 🗂️ ディレクトリ構成

### [[deprecated]] - 廃止予定

現在は使用していないが、移行期間中に参照の可能性があるドキュメント

#### 含まれるもの

- **GitHub Copilot関連**: `.github/copilot-instructions/` から移行予定
- **古いプロンプト**: `.github/prompts/` から移行予定
- **重複ドキュメント**: `docs/astro/src/pages/ja/` から移行予定

### 履歴ドキュメント（将来追加）

- **技術選定記録**: 採用しなかった技術・理由
- **失敗プロジェクト**: 中断・変更した取り組みの記録
- **学習記録**: 個人・チームの学習過程・ノウハウ

## 📚 現在のアーカイブ内容

### 廃止予定ドキュメント

移行作業中のため、以下が順次移動予定：

#### GitHub Copilot 指示書（廃止理由: Claude移行）

```
.github/copilot-instructions/
├── base.md           # 基本指示書
├── backend.md        # バックエンド指示
├── frontend.md       # フロントエンド指示
├── naming.md         # 命名規則
└── testing.md        # テスト指示
```

#### プロンプト群（廃止理由: 開発プロセス変更）

```
.github/prompts/
├── docs.prompt.md                          # ドキュメント記述ルール
├── project-development-rules.prompt.md    # 開発ルール
├── tdd.prompt.md                          # TDD実践ガイド
└── typescript.prompt.md                   # TypeScript ガイドライン
```

#### 重複日本語ドキュメント（廃止理由: 新構成に統合）

```
docs/astro/src/pages/ja/
├── introduction.md           # プロジェクト概要
├── application-architecture.md # アプリケーション設計
├── contextmap.md            # DDDコンテキストマップ
├── domain.md                # ドメインモデル
├── ubiquitous.md            # ユビキタス言語
├── usecase.md               # ユースケース
├── exp.md                   # 開発メモ
├── storybook.md             # Storybook設定
├── test.md                  # テスト設定
├── github-actions.md        # CI/CD設定
├── vercel.md                # Vercel設定
├── skyway.md                # SkyWay連携
└── spa.md                   # SPA設計
```

## 🔍 アーカイブの活用方法

### 検索・参照

- **Foamリンク**: `[[deprecated/filename]]` で参照
- **履歴調査**: 過去の技術選定理由・変更経緯確認
- **学習リソース**: 新メンバーの技術選定理解

### 定期レビュー

- **年次評価**: アーカイブ内容の保持価値評価
- **容量管理**: 不要になったファイルの完全削除
- **移行判断**: アーカイブから現行ドキュメントへの復帰

## 📊 アーカイブ統計

### ファイル数（予定）

- **Copilot指示書**: 5ファイル
- **プロンプト**: 4ファイル
- **重複ドキュメント**: 13ファイル
- **合計**: 約22ファイルの移行予定

### 保持理由

1. **技術選定記録**: Copilot→Claude移行の判断記録
2. **プロセス変遷**: 開発プロセス進化の証跡
3. **コンテンツ変遷**: ドキュメント構造改善の履歴

## 🔄 移行スケジュール

### Sprint 003実行中

- [ ] GitHub Copilot指示書移行
- [ ] プロンプト群移行
- [ ] 重複ドキュメント移行
- [ ] deprecated/README.md 更新

### 移行後のメンテナンス

- [ ] アーカイブ内容のインデックス作成
- [ ] Foamリンクでの相互参照構築
- [ ] 検索用タグ付与

## 🏷️ タグ分類

### 廃止理由別

- `#deprecated-tool` - ツール変更による廃止
- `#deprecated-process` - プロセス変更による廃止
- `#deprecated-duplicate` - 重複解消による廃止

### 価値分類別

- `#historical-value` - 履歴価値あり・長期保持
- `#reference-value` - 参照価値あり・中期保持
- `#temporary-hold` - 移行期間のみ保持

### コンテンツ種別

- `#instructions` - 指示書・ガイドライン
- `#prompts` - AIプロンプト・テンプレート
- `#documentation` - 技術文書・設計書

## 📚 学習価値

### 技術選定の変遷

- **AI開発支援**: GitHub Copilot → Claude の選択理由
- **ドキュメント管理**: 分散管理 → Foam統合 の進化
- **開発プロセス**: プロンプトベース → 証跡ベース の改善

### プロジェクト成熟度

- **初期段階**: 試行錯誤・多様なツール利用
- **成長段階**: 標準化・プロセス確立
- **安定段階**: 最適化・効率化重視

---

## 📖 関連リソース

### 現行ドキュメント

- [[../03-development/process]] - 現在の開発プロセス
- [[../00-index]] - 統合後のドキュメントハブ
- [[../DOCUMENTATION_POLICY]] - ドキュメント管理方針

### 移行関連

- [[document-architecture/document-architecture-implementation]] - リアーキテクティング実装記録
- [[document-architecture/document-architecture-todo]] - 移行作業TODO

### 技術判断記録

- 各スプリントの `retrospective.md` - 継続的改善記録
- `implementation.md` - 技術選定・判断記録

#archive #deprecated #historical #reference
