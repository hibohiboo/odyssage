# 実装担当オンボーディング資料

## 📋 基本情報

**作成者**: リーダー  
**対象者**: 実装担当  
**作成日時**: 2025-08-17 午後  
**Sprint**: Sprint 4 - Player文脈MVP実装フェーズ

## 🎯 プロジェクト概要

### Player文脈MVP実装フェーズ開始

Sprint 4では、Player文脈MVPの実装を開始します。設計フェーズが完了し、全設計文書の整合性確認・POフィードバック反映が完了済みです。

#### 🚀 実装開始状況
- **設計完成度**: ✅ 実装開始可能レベル達成
- **整合性確認**: ✅ 全設計文書の矛盾・不整合解消完了
- **POフィードバック**: ✅ 全フィードバック反映完了
- **品質保証体制**: ✅ テスト担当・設計担当との協働体制確立

## 📚 必須参照文書

### 🎯 実装担当者の役割・責任
**最重要**: **[implementation-specialist.md](../../06-teams/roles/implementation-specialist.md)** - 実装担当者の役割定義・専門領域・協働方針

### 核心設計文書
- **[requirements.md](../../02-architecture/player-context/requirements.md)** - MVP要件・核心価値
- **[data-design.md](../../02-architecture/player-context/data-design.md)** - Event概念（最重要）
- **[architecture.md](../../02-architecture/player-context/architecture.md)** - 技術アーキテクチャ

### 実装対象画面
- **[session-list.md](../../02-architecture/player-context/screens/session-list.md)**
- **[session-detail.md](../../02-architecture/player-context/screens/session-detail.md)**  
- **[play-session.md](../../02-architecture/player-context/screens/play-session.md)**

## 🎯 Sprint 4実装概要

### 技術スタック
React 19+ + React Router v7 + TypeScript + packages/ui + StoryBook
（詳細は architecture.md 参照）

### 実装対象
**3つの主要画面**: session-list → session-detail → play-session
**Event概念**: choice・narrative・scene_transition（必須実装）

### MVP制約
❌ **除外機能**: フィルタリング・ジャンル表示・参加者数・再プレイ・キーボード操作
✅ **集中領域**: 確実なEvent処理・TRPG体験・基本的UI

## 🎮 Event概念実装（最重要）

Player文脈MVPの核心は「Event概念」によるTRPG体験です。
詳細は **data-design.md** を参照してください。

### Event優先度
- **MVP必須**: choice・narrative・scene_transition（完全実装）
- **MVP最小限**: dialogue・exploration（簡素実装）
- **Phase 2移行**: item_acquire・skill_use・condition（実装禁止）

## 📅 実装ロードマップ

詳細は **implementation_priority_roadmap_20250817.md** を参照

### 概要
- **Week 1**: packages/ui・StoryBook・画面デザイン
- **Week 2**: 状態管理・画面機能実装  
- **Week 3**: Event処理・プレイ体験
- **Week 4-5**: 品質保証・E2Eテスト協働

## 🤝 協働・コミュニケーション

詳細は **implementation-specialist.md** を参照

### 基本方針
- **専門性発揮**: 技術判断・実装方針の自律的決定
- **チーム協働**: テスト・設計・リーダーとの効率的連携
- **品質確保**: Unit/Component Test・StoryBook品質確認

### エスカレーション
- 技術実現困難・MVP制約判断・Event概念理解困難時は即座相談

---

**Sprint 4実装フェーズ開始**

設計完了・POフィードバック反映済み。Event概念実装によるTRPG体験実現を期待しています。

**次ステップ**: implementation-specialist.md確認・実装環境構築開始

#implementation-onboarding #sprint4 #event-concept