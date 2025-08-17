# 作業指示書：session-detail.mdのPOレビューフィードバック反映作業

## 📋 基本情報

**指示者**: リーダー  
**作業者**: 設計担当  
**作成日時**: 2025-08-17 午後  
**優先度**: 高  
**期限**: 本日中

## 🎯 作業概要

session-detail.mdに対するPOレビューフィードバックを反映し、MVP制約に適合した機能要件・パフォーマンス要件への調整を実施してください。

## 📍 POレビューフィードバック内容

### 1. 全体構造からのMVP範囲外機能除去

**POレビュー指摘事項**:
```markdown
docs\02-architecture\player-context\data-design.md からジャンルの情報や難易度の情報は削ったはずです。 
MVPのやらないことが反映されていません。反映してください。
```

**対象**: ヒーローセクション - HeroMeta基本情報

### 2. ヒーローセクションのジャンル参照除去

**POレビュー指摘事項**:
```markdown
ここも、ジャンルはMVPから削っています
```

**対象**: HeroSectionSpec.image_display.fallback

### 3. セッション状態表示の簡素化

**POレビュー指摘事項**:
```markdown
難易度やジャンルもMVP範囲外です
```

**対象**: SessionStatusDisplay.additional_info

### 4. 確認ダイアログの簡素化

**POレビュー指摘事項**:
```markdown
推定プレイ時間もMVPから削っています。
```

**対象**: ParticipationConfirmationSpec.dialog_content

### 5. パフォーマンス最適化の除外

**POレビュー指摘事項**:
```markdown
下記はMVPではやらないことにしてください
```

**対象**: PerformanceOptimization.image_loading

## 🔍 具体的な作業内容

### 1. 全体構造図の修正（必須）

**修正対象**: Mermaidダイアグラム - HeroMeta

```mermaid
## 修正前
HeroMeta[基本情報: 難易度・推定時間・ジャンル]

## 修正後
HeroMeta[基本情報: シナリオタイトル・概要のみ]
```

### 2. ヒーローセクション仕様の修正（必須）

**修正対象**: HeroSectionSpec.image_display

```typescript
## 修正前
image_display: {
  aspect_ratio: '16:9（デスクトップ）、4:3（モバイル）';
  fallback: 'シナリオジャンルに応じたデフォルト画像';
  loading: 'プログレッシブ画像読み込み';
};

## 修正後
image_display: {
  aspect_ratio: '16:9（デスクトップ）、4:3（モバイル）';
  fallback: '統一デフォルト画像';
  loading: '基本的な画像読み込み';
};
```

### 3. セッション状態表示の簡素化（必須）

**修正対象**: SessionStatusDisplay.additional_info

```typescript
## 修正前
additional_info: {
  estimated_time: '推定プレイ時間の表示';
  scenario_genre: 'シナリオジャンル・カテゴリ';
  difficulty_level: '難易度レベル表示';
  // MVP範囲外: participant_count: "参加者数情報";
};

## 修正後
additional_info: {
  // MVP制約: 基本情報のみ表示
  scenario_overview: 'シナリオ概要・説明文';
};
```

### 4. 確認ダイアログの簡素化（必須）

**修正対象**: ParticipationConfirmationSpec.dialog_content

```typescript
## 修正前
dialog_content: {
  commitment_info: "推定プレイ時間・参加への責任";
};

## 修正後
dialog_content: {
  commitment_info: "セッション参加への確認";
};
```

### 5. パフォーマンス最適化の除外（必須）

**修正対象**: PerformanceOptimization全体

```typescript
## 修正前
interface PerformanceOptimization {
  image_loading: {
    hero_image: 'プライオリティ読み込み';
    progressive: 'プログレッシブJPEG対応';
    webp_support: 'WebP形式での配信';
  };
}

## 修正後（セクション除外）
// PerformanceOptimizationセクション自体をMVP範囲外として除外
```

### 6. MVP制約除外機能の明記（推奨）

**追加内容**: MVP制約の明確化

```markdown
## MVP制約による除外機能

### Phase 2以降への移行項目
- **ジャンル・カテゴリ表示**: シナリオジャンル分類・表示
- **難易度レベル**: 難易度レベル表示・フィルタリング
- **推定プレイ時間**: プレイ時間表示・参加判断材料
- **高度な画像最適化**: WebP・プログレッシブJPEG・プライオリティ読み込み

### MVP範囲の集中
- シナリオタイトル・概要の表示
- 基本的なセッション参加確認
- シンプルな画像表示・読み込み
```

## 📊 制約・前提条件

### MVP制約（必須遵守）
- **data-design.md整合**: ジャンル・難易度情報の除外徹底
- **機能集中**: 基本的なセッション詳細表示・参加確認に集中
- **実装シンプル化**: 複雑な最適化・分類機能の除外

### POレビュー方針
- **MVP制約反映**: 他設計文書での除外決定の一貫適用
- **過度な機能除外**: 本質的価値に不要な機能の排除
- **実装現実性**: 開発工数・複雑度の適切な管理

## 📋 期待成果物

### 1. 修正されたsession-detail.md
**修正箇所**:
- 全体構造図のMVP制約適用
- ヒーローセクション仕様の簡素化
- セッション状態表示の簡素化
- 確認ダイアログの簡素化
- パフォーマンス最適化セクションの除外
- MVP制約除外機能の明記

### 2. フィードバック反映報告書
**ファイル名**: `designer_to_leader_session_detail_po_feedback_report_20250817.md`

**内容**:
- POフィードバック反映の詳細
- MVP制約適用の根拠・影響評価
- data-design.mdとの整合性確保
- 実装チームへの伝達事項

### 3. 更新履歴の適切な記録
- POレビューフィードバック反映の記録
- MVP制約適用による機能調整の記録
- data-design.md整合性確保の記録

## 🔄 作業プロセス

### Step 1: POフィードバック詳細分析（20分）
- 除外機能の影響範囲確認
- data-design.mdとの整合性確認
- MVP制約との統一性確認

### Step 2: session-detail.md修正（40分）
- 全体構造図の修正
- 各セクション仕様の簡素化
- パフォーマンス最適化除外
- MVP制約除外機能の明記

### Step 3: 影響確認・整合性チェック（20分）
- data-design.mdとの整合性確認
- 他設計文書との一致確認
- MVP制約一貫適用の確認

### Step 4: 報告書作成（20分）
- フィードバック反映結果の整理
- 実装フェーズへの影響評価
- MVP制約適用の効果整理

## 🚨 注意事項・特記事項

### 重要な考慮点
1. **data-design.md整合**: ジャンル・難易度除外の一貫適用
2. **MVP価値維持**: 機能除外でもセッション詳細の基本価値確保
3. **実装現実性**: 複雑機能除外による開発効率化
4. **将来拡張性**: Phase 2での機能追加への配慮

### エスカレーション基準
以下の場合は即座にリーダーに相談：
- 機能除外でMVP価値に重大な影響が想定される場合
- data-design.mdとの重大な不整合が発見された場合
- 実装フェーズへの影響が重大な場合

### 品質確認ポイント
- **MVP制約遵守**: data-design.mdとの完全一致
- **機能一貫性**: 全設計文書でのMVP制約統一適用
- **実装現実性**: 開発工数・複雑度の適切な管理

## 📚 参考資料

### 主要参照文書
- [POレビュー記録](../reviews/session-detail.review.md)
- [Player文脈データ設計](../02-architecture/player-context/data-design.md)
- [Player文脈MVP要件定義](../02-architecture/player-context/requirements.md)

### MVP制約参考
- [mvp-guidelines.md POフィードバック反映](../mvp-guidelines.review.md)
- [session-list.md POフィードバック反映](../session-list.review.md)

---

**リーダーからのメッセージ**:
POのフィードバックは、data-design.mdでの除外決定との整合性確保の重要な指摘です。全設計文書でのMVP制約一貫適用により、実装チームが混乱なく開発を進められる環境を整備してください。

機能除外により本質的価値（セッション詳細表示・参加確認）に集中し、実装成功可能性を最大化してください。

**作業完了後の次ステップ**: 全設計文書のPOフィードバック反映完了、最終整合性確認

#work-instruction #session-detail #po-feedback #mvp-constraints #data-design-consistency #collaboration-v2