# 旧アーキテクチャドキュメント構造

> **アーカイブ理由**: ドキュメント構造リアーキテクティング（Sprint 003）により廃止
>
> **移行日**: 2025-08-09
> **移行先**: `docs/02-architecture/` (Foam対応新構造)

## 📋 この文書について

これは `docs/architecture/` ディレクトリの旧構造記録です。新しいFoam対応ドキュメント体系への移行により廃止されました。

### 移行経緯

1. **問題**: 分散したアーキテクチャドキュメント（`docs/architecture/` と `docs/02-architecture/`）
2. **解決**: Foam対応の統一構造（`docs/02-architecture/`）に集約
3. **結果**: 重複解消・ナビゲーション改善・保守負荷軽減

## 🗂️ 旧ディレクトリ構成

### 元々の内容

```
docs/architecture/
├── README.md              # このファイル（旧構造説明）
├── database-design.md     # → docs/02-architecture/database-design.md に移行
└── environment-variables.md # → docs/02-architecture/environment-variables.md に移行
```

### 移行状況

- ✅ `database-design.md` → `docs/02-architecture/database-design.md`
- ✅ `environment-variables.md` → `docs/02-architecture/environment-variables.md`
- ✅ `README.md` → この文書（アーカイブ記録）

---

## 📚 旧README.md内容（参考記録）

### 元々の設計思想

**Architecture Documentation**

システム全体のアーキテクチャ設計と技術仕様を記録するディレクトリでした。

#### アーキテクチャドキュメントの目的

1. **設計方針の統一**: 技術選択の理由と根拠を明文化
2. **長期的な保守性**: 将来の機能拡張時の指針
3. **新メンバーへの知識移転**: システム全体の理解促進

#### ドキュメント管理方針

- **更新タイミング**: 重要な技術選択・アーキテクチャ変更時
- **内容の種類**: 設計原則・技術選択・制約事項・今後の計画

#### 関連ドキュメント

- `development/`: 実装時の記録・証跡
- `design/`: UI/UXデザイン関連
- API仕様書: `redocly/openapi/`

### 廃止理由

#### 1. **構造の重複**

- `docs/architecture/` と `docs/02-architecture/` が併存
- 同じ目的で異なる場所にドキュメント配置
- 保守負荷とユーザー混乱の原因

#### 2. **Foam非対応**

- 旧構造はFoamによる知識グラフ機能未対応
- WikiリンクやBacklinkが十分活用できない
- ドキュメント間の関連性可視化不可

#### 3. **新体系への統一必要性**

- Sprint 003でのドキュメント体系再設計
- 5段階ディレクトリ構造（01-getting-started〜05-archive）
- より体系的・直感的なナビゲーション実現

## 🎯 学習価値・教訓

### 成功した点

- **目的の明確化**: アーキテクチャドキュメントの役割定義が適切
- **保守性重視**: 継続的更新の重要性を認識
- **知識移転**: 新メンバー教育の観点を含有

### 改善された点

- **統一構造**: 分散したドキュメントの一元化
- **Foam連携**: 知識グラフ・双方向リンクの活用
- **タグ体系**: 検索性・関連性の向上

### 今後への示唆

- **初期から統一構造**: 後々の移行コストを回避
- **ツール選定時の拡張性考慮**: Foam等の知識管理ツールとの親和性
- **定期的構造見直し**: プロジェクト成長に応じた最適化

## 🔗 関連リソース

### 新しいアーキテクチャドキュメント

- [[../../02-architecture/README]] - 新構造のアーキテクチャハブ
- [[../../02-architecture/overview]] - システム全体概要
- [[../../02-architecture/database-design]] - ハイブリッドDB設計
- [[../../02-architecture/api-design]] - API設計指針

### 移行関連記録

- [[document-architecture/document-architecture-implementation]] - リアーキテクティング実装記録
- [[document-architecture/document-architecture-todo]] - 移行作業詳細

### ドキュメント管理

- [[../../00-index]] - 新しいドキュメントハブ
- [[../../DOCUMENTATION_POLICY]] - ドキュメント管理方針

---

## 📊 統計情報

### 移行実績

- **移行ファイル数**: 3ファイル（README.md含む）
- **移行完了日**: 2025-08-09
- **関連Sprint**: Sprint 003 Phase 4

### 影響範囲

- **重複解消**: 1ディレクトリ削除
- **リンク修正**: 自動解決（新ファイル作成により）
- **ユーザビリティ改善**: 統一ナビゲーション実現

#archive #deprecated #architecture #documentation #migration #sprint003
