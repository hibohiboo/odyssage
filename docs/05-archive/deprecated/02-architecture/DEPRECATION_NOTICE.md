# Deprecated Architecture Documents - Notice

**移動日**: 2025-08-23  
**移動理由**: Player文脈特化アーキテクチャへの移行・設計文書間整合性問題の解決

---

## 📋 **Deprecated Files**

### **frontend-architecture.md**
- **移動理由**: `docs/02-architecture/player-context/architecture.md` との整合性不備
- **問題**: 
  - Player文脈の具体的パス設計が不明確
  - Context-First + FSD統合アプローチとの不整合
  - 設計レビュー時の混乱原因となった不一致
- **代替文書**: `docs/02-architecture/player-context/architecture.md`
- **状態**: 非推奨・参照禁止

---

## 🔄 **Migration Path**

### **新しいアーキテクチャ文書体系**
```markdown
有効なアーキテクチャ文書:
✅ docs/02-architecture/player-context/architecture.md
   - Player文脈専用アーキテクチャ設計
   - Context-First + FSD統合アプローチ
   - 具体的パス設計・ルーティング仕様

✅ docs/02-architecture/player-context/requirements.md
   - Player文脈MVP要件定義
   - 機能範囲・制約・価値定義

❌ docs/02-architecture/frontend-architecture.md（非推奨・移動済み）
   - 汎用フロントエンドアーキテクチャ
   - Player文脈特化設計との不整合
```

### **参照更新が必要な文書**
- 設計担当ガイド: `docs/06-teams/roles/design-specialist.md`（更新済み）
- スプリント文書: 各スプリントの参照リンクを確認・更新推奨
- 実装ガイド: Player文脈アーキテクチャ文書への参照変更推奨

---

## 📚 **Context**

この移動は Sprint 5 での設計レビュー品質問題の根本対策として実施されました。

**問題の詳細**: `docs/03-development/sprints/sprint_005/quality-analysis/design_review_failure_analysis_20250823.md`

**改善効果**:
- 設計文書間の整合性確保
- Player文脈特化設計への一本化
- 設計レビューでの混乱回避
- 今後の品質保証プロセス改善

---

**作成者**: Sprint 5 設計担当（Claude Code）  
**目的**: 設計文書整合性確保・品質向上  
**影響範囲**: アーキテクチャ参照・設計レビュープロセス

#deprecated #architecture #cleanup #quality-improvement #sprint5